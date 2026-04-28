use anyhow::{anyhow, Context, Result};
use chrono::Utc;
use rusqlite::{params, params_from_iter, types::Value as SqlValue, Connection, OptionalExtension};
use serde_json::{json, Value};
use std::fs;
use std::path::{Path, PathBuf};

use crate::models::{JobDetailResponse, LibraryListItem, MediaItemDetail, ResolvedPaths, SettingsPayload, SqlPayload, SqlResponse};

const MIGRATION_SQL: &str = include_str!("../../drizzle/0000_soniva_init.sql");

pub fn open_connection(db_path: &Path) -> Result<Connection> {
    if let Some(parent) = db_path.parent() {
        fs::create_dir_all(parent).with_context(|| format!("failed to create database directory {}", parent.display()))?;
    }

    let connection = Connection::open(db_path).with_context(|| format!("failed to open database at {}", db_path.display()))?;
    connection.pragma_update(None, "foreign_keys", "ON")?;
    connection.pragma_update(None, "journal_mode", "WAL")?;
    Ok(connection)
}

pub fn initialize_database(db_path: &Path) -> Result<()> {
    let connection = open_connection(db_path)?;
    connection.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS __soniva_migrations (
          version TEXT PRIMARY KEY NOT NULL,
          applied_at TEXT NOT NULL
        );
        "#,
    )?;

    let already_applied: Option<String> = connection
        .query_row(
            "SELECT version FROM __soniva_migrations WHERE version = ?1 LIMIT 1",
            ["0000_soniva_init"],
            |row| row.get(0),
        )
        .optional()?;

    if already_applied.is_none() {
        connection.execute_batch(MIGRATION_SQL)?;
        connection.execute(
            "INSERT INTO __soniva_migrations (version, applied_at) VALUES (?1, ?2)",
            params!["0000_soniva_init", now()],
        )?;
    }

    ensure_default_setting(&connection, "library_root", "")?;
    ensure_default_setting(&connection, "yt_dlp_path", "")?;
    ensure_default_setting(&connection, "ffmpeg_path", "")?;
    ensure_default_setting(&connection, "audio_format", "mp3")?;
    ensure_default_setting(&connection, "overwrite_policy", "skip")?;

    Ok(())
}

fn ensure_default_setting(connection: &Connection, key: &str, value: &str) -> Result<()> {
    connection.execute(
        "INSERT INTO app_settings (key, value, updated_at)
         VALUES (?1, ?2, ?3)
         ON CONFLICT(key) DO NOTHING",
        params![key, value, now()],
    )?;
    Ok(())
}

pub fn save_settings(db_path: &Path, payload: &SettingsPayload) -> Result<()> {
    let connection = open_connection(db_path)?;
    let tx = connection.unchecked_transaction()?;

    upsert_setting(&tx, "library_root", &payload.library_root)?;
    upsert_setting(&tx, "yt_dlp_path", &payload.yt_dlp_path)?;
    upsert_setting(&tx, "ffmpeg_path", &payload.ffmpeg_path)?;
    upsert_setting(&tx, "audio_format", &payload.audio_format)?;
    upsert_setting(&tx, "overwrite_policy", &payload.overwrite_policy)?;

    tx.commit()?;
    Ok(())
}

fn upsert_setting(connection: &Connection, key: &str, value: &str) -> Result<()> {
    connection.execute(
        r#"
        INSERT INTO app_settings (key, value, updated_at)
        VALUES (?1, ?2, ?3)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = excluded.updated_at
        "#,
        params![key, value, now()],
    )?;
    Ok(())
}

pub fn read_setting(connection: &Connection, key: &str) -> Result<Option<String>> {
    Ok(connection
        .query_row("SELECT value FROM app_settings WHERE key = ?1 LIMIT 1", [key], |row| row.get(0))
        .optional()?)
}

pub fn resolve_paths(db_path: &Path) -> Result<ResolvedPaths> {
    let connection = open_connection(db_path)?;
    Ok(ResolvedPaths {
        library_root: read_setting(&connection, "library_root")?.filter(|value| !value.trim().is_empty()),
        yt_dlp_path: read_setting(&connection, "yt_dlp_path")?.filter(|value| !value.trim().is_empty()),
        ffmpeg_path: read_setting(&connection, "ffmpeg_path")?.filter(|value| !value.trim().is_empty()),
        audio_format: read_setting(&connection, "audio_format")?.unwrap_or_else(|| "mp3".to_string()),
        overwrite_policy: read_setting(&connection, "overwrite_policy")?.unwrap_or_else(|| "skip".to_string()),
    })
}

pub fn ensure_directory(path: &Path) -> Result<()> {
    fs::create_dir_all(path).with_context(|| format!("failed to create directory {}", path.display()))?;
    Ok(())
}

pub fn execute_sql_proxy(db_path: &Path, payload: SqlPayload) -> Result<SqlResponse> {
    let connection = open_connection(db_path)?;
    let mut statement = connection.prepare(&payload.sql)?;
    let params = payload.params.iter().map(json_to_sql_value).collect::<Vec<_>>();

    match payload.method.as_str() {
        "run" => {
            statement.execute(params_from_iter(params))?;
            Ok(SqlResponse { rows: json!([]) })
        }
        "get" => {
            let col_count = statement.column_count();
            let mut rows = statement.query(params_from_iter(params))?;
            if let Some(row) = rows.next()? {
                let value = row_to_value_with_count(row, col_count)?;
                Ok(SqlResponse {
                    rows: json!([value]),
                })
            } else {
                Ok(SqlResponse { rows: json!([]) })
            }
        }
        "values" => {
            let col_count = statement.column_count();
            let mut rows = statement.query(params_from_iter(params))?;
            let mut out = Vec::new();
            while let Some(row) = rows.next()? {
                let mut cells = Vec::new();
                for index in 0..col_count {
                    let raw: rusqlite::types::Value = row.get(index)?;
                    cells.push(sql_value_to_json(raw));
                }
                out.push(Value::Array(cells));
            }
            Ok(SqlResponse {
                rows: Value::Array(out),
            })
        }
        "all" => {
            let col_count = statement.column_count();
            let mut rows = statement.query(params_from_iter(params))?;
            let mut out = Vec::new();
            while let Some(row) = rows.next()? {
                out.push(row_to_value_with_count(row, col_count)?);
            }
            Ok(SqlResponse {
                rows: Value::Array(out),
            })
        }
        other => Err(anyhow!("unsupported SQL proxy method: {}", other)),
    }
}

fn json_to_sql_value(value: &Value) -> SqlValue {
    match value {
        Value::Null => SqlValue::Null,
        Value::Bool(flag) => SqlValue::Integer(if *flag { 1 } else { 0 }),
        Value::Number(number) => {
            if let Some(integer) = number.as_i64() {
                SqlValue::Integer(integer)
            } else if let Some(float) = number.as_f64() {
                SqlValue::Real(float)
            } else {
                SqlValue::Null
            }
        }
        Value::String(text) => SqlValue::Text(text.clone()),
        Value::Array(_) | Value::Object(_) => SqlValue::Text(value.to_string()),
    }
}

fn sql_value_to_json(value: rusqlite::types::Value) -> Value {
    match value {
        rusqlite::types::Value::Null => Value::Null,
        rusqlite::types::Value::Integer(number) => json!(number),
        rusqlite::types::Value::Real(number) => json!(number),
        rusqlite::types::Value::Text(text) => json!(text),
        rusqlite::types::Value::Blob(blob) => json!(blob),
    }
}

fn row_to_value_with_count(row: &rusqlite::Row<'_>, col_count: usize) -> Result<Value> {
    let mut cells = Vec::new();
    for index in 0..col_count {
        let raw: rusqlite::types::Value = row.get(index)?;
        cells.push(sql_value_to_json(raw));
    }
    Ok(Value::Array(cells))
}

pub fn list_library_items(db_path: &Path, query: Option<String>, filter: Option<String>) -> Result<Vec<LibraryListItem>> {
    let connection = open_connection(db_path)?;
    let mut sql = String::from(
        r#"
        SELECT
          mi.id,
          mi.title,
          mi.slug,
          mi.status,
          mi.origin_kind,
          mi.duration_seconds,
          mi.file_size_bytes,
          mi.source_media_path,
          mi.library_dir,
          ea.audio_path,
          ea.format,
          ms.canonical_url,
          ms.uploader,
          th.local_path,
          mi.created_at,
          mi.updated_at
        FROM media_items mi
        LEFT JOIN media_sources ms ON ms.id = mi.source_id
        LEFT JOIN extracted_audio_assets ea ON ea.media_item_id = mi.id
        LEFT JOIN thumbnails th ON th.media_item_id = mi.id
        WHERE 1 = 1
        "#,
    );

    let mut args: Vec<String> = Vec::new();

    if let Some(query) = query.filter(|value| !value.trim().is_empty()) {
        sql.push_str(
            " AND (LOWER(mi.title) LIKE LOWER(?)
                   OR LOWER(COALESCE(ms.canonical_url, '')) LIKE LOWER(?)
                   OR LOWER(COALESCE(ms.uploader, '')) LIKE LOWER(?)) ",
        );
        let pattern = format!("%{}%", query.trim());
        args.push(pattern.clone());
        args.push(pattern.clone());
        args.push(pattern);
    }

    if let Some(filter) = filter.filter(|value| value != "all") {
        sql.push_str(" AND mi.status = ? ");
        args.push(filter);
    }

    sql.push_str(" ORDER BY mi.created_at DESC");

    let mut statement = connection.prepare(&sql)?;
    let params = args.iter().map(|value| value as &dyn rusqlite::ToSql).collect::<Vec<_>>();

    let rows = statement.query_map(params.as_slice(), |row| {
        Ok(LibraryListItem {
            id: row.get(0)?,
            title: row.get(1)?,
            slug: row.get(2)?,
            status: row.get(3)?,
            origin_kind: row.get(4)?,
            duration_seconds: row.get(5)?,
            file_size_bytes: row.get(6)?,
            source_media_path: row.get(7)?,
            library_dir: row.get(8)?,
            audio_path: row.get(9)?,
            audio_format: row.get(10)?,
            source_label: row.get(11)?,
            uploader: row.get(12)?,
            thumbnail_path: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    })?;

    let mut items = Vec::new();
    for row in rows {
        items.push(row?);
    }

    Ok(items)
}

pub fn get_media_item_detail(db_path: &Path, media_item_id: &str) -> Result<Option<MediaItemDetail>> {
    let connection = open_connection(db_path)?;
    let row = connection
        .query_row(
            r#"
            SELECT
              mi.id,
              mi.title,
              mi.slug,
              mi.status,
              mi.origin_kind,
              mi.duration_seconds,
              mi.file_size_bytes,
              mi.source_media_path,
              mi.library_dir,
              ea.audio_path,
              ea.format,
              ms.canonical_url,
              ms.uploader,
              th.local_path,
              mi.created_at,
              mi.updated_at,
              mi.metadata_json,
              ms.metadata_json,
              ms.canonical_url
            FROM media_items mi
            LEFT JOIN media_sources ms ON ms.id = mi.source_id
            LEFT JOIN extracted_audio_assets ea ON ea.media_item_id = mi.id
            LEFT JOIN thumbnails th ON th.media_item_id = mi.id
            WHERE mi.id = ?1
            LIMIT 1
            "#,
            [media_item_id],
            |row| {
                let item = LibraryListItem {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    slug: row.get(2)?,
                    status: row.get(3)?,
                    origin_kind: row.get(4)?,
                    duration_seconds: row.get(5)?,
                    file_size_bytes: row.get(6)?,
                    source_media_path: row.get(7)?,
                    library_dir: row.get(8)?,
                    audio_path: row.get(9)?,
                    audio_format: row.get(10)?,
                    source_label: row.get(11)?,
                    uploader: row.get(12)?,
                    thumbnail_path: row.get(13)?,
                    created_at: row.get(14)?,
                    updated_at: row.get(15)?,
                };

                Ok(MediaItemDetail {
                    item,
                    metadata_json: row.get(16)?,
                    source_metadata_json: row.get(17)?,
                    remote_url: row.get(18)?,
                })
            },
        )
        .optional()?;

    Ok(row)
}

pub fn get_job_detail(db_path: &Path, job_id: &str) -> Result<Option<JobDetailResponse>> {
    let connection = open_connection(db_path)?;
    let job = connection
        .query_row(
            r#"
            SELECT
              id,
              source_kind,
              input_value,
              status,
              stage,
              progress,
              media_item_id,
              output_directory,
              log_excerpt,
              error_message,
              created_at,
              started_at,
              finished_at,
              updated_at
            FROM ingestion_jobs
            WHERE id = ?1
            LIMIT 1
            "#,
            [job_id],
            |row| {
                Ok(json!({
                    "id": row.get::<_, String>(0)?,
                    "sourceKind": row.get::<_, String>(1)?,
                    "inputValue": row.get::<_, String>(2)?,
                    "status": row.get::<_, String>(3)?,
                    "stage": row.get::<_, String>(4)?,
                    "progress": row.get::<_, i64>(5)?,
                    "mediaItemId": row.get::<_, Option<String>>(6)?,
                    "outputDirectory": row.get::<_, Option<String>>(7)?,
                    "logExcerpt": row.get::<_, Option<String>>(8)?,
                    "errorMessage": row.get::<_, Option<String>>(9)?,
                    "createdAt": row.get::<_, String>(10)?,
                    "startedAt": row.get::<_, Option<String>>(11)?,
                    "finishedAt": row.get::<_, Option<String>>(12)?,
                    "updatedAt": row.get::<_, String>(13)?,
                }))
            },
        )
        .optional()?;

    if let Some(job) = job {
        let detail = job
            .get("mediaItemId")
            .and_then(|value| value.as_str())
            .map(|media_item_id| get_media_item_detail(db_path, media_item_id))
            .transpose()?
            .flatten();

        Ok(Some(JobDetailResponse { job, detail }))
    } else {
        Ok(None)
    }
}

pub fn now() -> String {
    Utc::now().to_rfc3339()
}

pub fn domain_from_url(url: &str) -> Option<String> {
    let trimmed = url.trim();
    let without_scheme = trimmed
        .strip_prefix("https://")
        .or_else(|| trimmed.strip_prefix("http://"))
        .unwrap_or(trimmed);

    let host = without_scheme.split('/').next()?.trim();
    if host.is_empty() {
        None
    } else {
        Some(host.to_string())
    }
}

pub fn read_sidecar_json(path: &Path) -> Option<String> {
    fs::read_to_string(path).ok()
}

pub fn file_size(path: &Path) -> Option<i64> {
    fs::metadata(path).ok().map(|metadata| metadata.len() as i64)
}

pub fn canonicalize_lossy(path: &Path) -> String {
    path.canonicalize()
        .unwrap_or_else(|_| PathBuf::from(path))
        .display()
        .to_string()
}
