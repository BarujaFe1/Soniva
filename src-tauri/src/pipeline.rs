use anyhow::{anyhow, bail, Context, Result};
use rusqlite::{params, Connection, OptionalExtension};
use serde_json::{json, Value};
use std::ffi::OsStr;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use uuid::Uuid;

use crate::db::{canonicalize_lossy, domain_from_url, ensure_directory, file_size, now, open_connection, resolve_paths};
use crate::models::{BinaryProbe, IngestionRequest};

#[derive(Debug, Clone)]
struct ExistingMediaItem {
    media_item_id: String,
    media_source_id: String,
    library_dir: String,
}

pub fn detect_binary(binary_name: &str, preferred_path: Option<&str>) -> BinaryProbe {
    let preferred = preferred_path
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty());

    let resolved = preferred
        .as_ref()
        .and_then(|value| probe_binary_candidate(PathBuf::from(value)))
        .or_else(|| find_in_path(binary_name).and_then(probe_binary_candidate));

    if let Some((resolved_path, version)) = resolved {
        BinaryProbe {
            found: true,
            binary_name: binary_name.to_string(),
            resolved_path: Some(resolved_path.display().to_string()),
            version,
            message: format!("Resolved {} successfully.", binary_name),
        }
    } else {
        BinaryProbe {
            found: false,
            binary_name: binary_name.to_string(),
            resolved_path: None,
            version: None,
            message: format!(
                "Could not resolve {}. Install it system-wide or save an explicit path in Settings.",
                binary_name
            ),
        }
    }
}

fn probe_binary_candidate(candidate: PathBuf) -> Option<(PathBuf, Option<String>)> {
    if !candidate.exists() || !candidate.is_file() {
        return None;
    }

    let output = Command::new(&candidate).arg("--version").output().ok()?;
    if !output.status.success() {
        return None;
    }

    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    let version = stdout
        .lines()
        .chain(stderr.lines())
        .map(str::trim)
        .find(|line| !line.is_empty())
        .map(|line| line.to_string());

    Some((candidate, version))
}

fn find_in_path(binary_name: &str) -> Option<PathBuf> {
    let locator = if cfg!(target_os = "windows") { "where" } else { "which" };
    let output = Command::new(locator).arg(binary_name).output().ok()?;
    if !output.status.success() {
        return None;
    }
    let candidate = String::from_utf8_lossy(&output.stdout)
        .lines()
        .find(|line| !line.trim().is_empty())?
        .trim()
        .to_string();

    Some(PathBuf::from(candidate))
}

pub fn queue_ingestion_job(db_path: PathBuf, payload: IngestionRequest) -> Result<String> {
    if !payload.authorized {
        bail!("Soniva only processes authorized local media and explicitly permitted source URLs.");
    }

    if payload.input_value.trim().is_empty() {
        bail!("Input value is required.");
    }

    let job_id = Uuid::new_v4().to_string();
    let connection = open_connection(&db_path)?;
    let created_at = now();

    connection.execute(
        r#"
        INSERT INTO ingestion_jobs (
          id, source_kind, input_value, status, stage, progress, media_item_id, output_directory, log_excerpt,
          error_message, created_at, started_at, finished_at, updated_at
        ) VALUES (?1, ?2, ?3, 'queued', 'Queued', 0, NULL, NULL, ?4, NULL, ?5, NULL, NULL, ?5)
        "#,
        params![
            &job_id,
            payload.source_kind.as_str(),
            payload.input_value.as_str(),
            "Job accepted and waiting for local pipeline execution.",
            &created_at
        ],
    )?;

    let job_id_for_worker = job_id.clone();

    std::thread::spawn(move || {
        if let Err(error) = run_ingestion_job(&db_path, &job_id_for_worker, &payload) {
            let _ = persist_failure(&db_path, &job_id_for_worker, &error.to_string());
        }
    });

    Ok(job_id)
}

fn run_ingestion_job(db_path: &Path, job_id: &str, payload: &IngestionRequest) -> Result<()> {
    let connection = open_connection(db_path)?;
    update_job_stage(&connection, job_id, "processing", "Initializing", 5, None, None)?;

    match payload.source_kind.as_str() {
        "url" => process_url_ingestion(&connection, db_path, job_id, payload),
        "local_file" => process_local_file_ingestion(&connection, db_path, job_id, payload),
        other => bail!("Unsupported source kind: {}", other),
    }
}

fn process_url_ingestion(connection: &Connection, db_path: &Path, job_id: &str, payload: &IngestionRequest) -> Result<()> {
    let resolved = resolve_paths(db_path)?;
    let overwrite_policy = normalize_overwrite_policy(&resolved.overwrite_policy);
    let library_root = PathBuf::from(
        resolved
            .library_root
            .clone()
            .ok_or_else(|| anyhow!("Configure a library root directory before starting ingestion jobs."))?,
    );

    let yt_dlp = resolved
        .yt_dlp_path
        .clone()
        .or_else(|| detect_binary("yt-dlp", None).resolved_path)
        .ok_or_else(|| anyhow!("yt-dlp was not found. Save a valid yt-dlp path in Settings."))?;

    let ffmpeg = resolved
        .ffmpeg_path
        .clone()
        .or_else(|| detect_binary("ffmpeg", None).resolved_path)
        .ok_or_else(|| anyhow!("ffmpeg was not found. Save a valid ffmpeg path in Settings."))?;

    ensure_directory(&library_root)?;
    ensure_directory(&library_root.join("items"))?;

    append_job_log(connection, job_id, &format!("Using library root: {}", library_root.display()))?;
    append_job_log(connection, job_id, &format!("Using yt-dlp binary: {}", yt_dlp))?;
    append_job_log(connection, job_id, &format!("Using ffmpeg binary: {}", ffmpeg))?;
    append_job_log(connection, job_id, &format!("Using overwrite policy: {}", overwrite_policy))?;

    update_job_stage(connection, job_id, "processing", "Resolving source metadata", 15, None, None)?;
    let metadata_output = run_command(
        Command::new(&yt_dlp)
            .arg("--dump-single-json")
            .arg("--no-warnings")
            .arg(&payload.input_value),
        "yt-dlp metadata probe",
    )?;

    let metadata_json: Value = serde_json::from_str(&metadata_output)
        .context("yt-dlp returned metadata that could not be parsed as JSON")?;

    let title = metadata_json
        .get("title")
        .and_then(|value| value.as_str())
        .unwrap_or("Untitled media");
    let slug = slugify(title);
    let canonical_url = metadata_json
        .get("webpage_url")
        .and_then(|value| value.as_str())
        .unwrap_or(payload.input_value.as_str());

    let existing = find_existing_url_item(connection, canonical_url, payload.input_value.as_str())?;
    if overwrite_policy == "skip" {
        if let Some(existing_item) = existing.as_ref() {
            complete_job_as_skipped(
                connection,
                job_id,
                existing_item,
                "Skipped existing item",
                &format!(
                    "Existing item for this source already lives at {}. Job completed without writing new output because overwrite policy is set to skip.",
                    existing_item.library_dir
                ),
            )?;
            return Ok(());
        }
    } else if let Some(existing_item) = existing.as_ref() {
        append_job_log(
            connection,
            job_id,
            &format!(
                "Replace policy matched an existing item at {}. The previous catalog entry will be removed after the new run finishes successfully.",
                existing_item.library_dir
            ),
        )?;
    }

    let short_id = &job_id[..8];
    let item_dir = library_root.join("items").join(format!("{}--{}", slug, short_id));
    let source_dir = item_dir.join("source");
    let audio_dir = item_dir.join("audio");
    let thumbnails_dir = item_dir.join("thumbnails");

    ensure_directory(&source_dir)?;
    ensure_directory(&audio_dir)?;
    ensure_directory(&thumbnails_dir)?;

    let source_metadata_path = item_dir.join("source-metadata.json");
    fs::write(&source_metadata_path, serde_json::to_string_pretty(&metadata_json)?)
        .with_context(|| format!("failed to write {}", source_metadata_path.display()))?;

    update_job_stage(
        connection,
        job_id,
        "processing",
        "Downloading authorized source media",
        38,
        Some(canonicalize_lossy(&item_dir)),
        None,
    )?;

    let output_template = source_dir.join("source.%(ext)s");
    let download_output = run_command(
        Command::new(&yt_dlp)
            .arg("--no-warnings")
            .arg("--write-info-json")
            .arg("--write-thumbnail")
            .arg("--convert-thumbnails")
            .arg("jpg")
            .arg("-o")
            .arg(output_template.display().to_string())
            .arg("--paths")
            .arg(format!("thumbnail:{}", thumbnails_dir.display()))
            .arg(&payload.input_value),
        "yt-dlp download",
    )?;
    append_job_log(connection, job_id, &download_output)?;

    let source_media_path = find_primary_source_file(&source_dir)
        .ok_or_else(|| anyhow!("yt-dlp completed without leaving a source media file in {}", source_dir.display()))?;

    update_job_stage(connection, job_id, "processing", "Extracting audio asset", 72, Some(canonicalize_lossy(&item_dir)), None)?;

    let audio_path = audio_dir.join(format!("track.{}", resolved.audio_format));
    run_command(
        Command::new(&ffmpeg)
            .arg("-y")
            .arg("-i")
            .arg(&source_media_path)
            .arg("-vn")
            .arg("-acodec")
            .arg("libmp3lame")
            .arg("-q:a")
            .arg("2")
            .arg(&audio_path),
        "ffmpeg audio extraction",
    )?;

    let media_source_id = Uuid::new_v4().to_string();
    let media_item_id = Uuid::new_v4().to_string();
    let audio_asset_id = Uuid::new_v4().to_string();
    let thumbnail_id = Uuid::new_v4().to_string();
    let extractor_key = metadata_json.get("extractor_key").and_then(|value| value.as_str()).unwrap_or("yt-dlp");
    let uploader = metadata_json.get("uploader").and_then(|value| value.as_str());
    let uploaded_at = metadata_json
        .get("upload_date")
        .and_then(|value| value.as_str())
        .map(|value| value.to_string());
    let thumbnail_path = find_first_thumbnail(&thumbnails_dir);
    let duration_seconds = metadata_json.get("duration").and_then(|value| value.as_i64());

    connection.execute(
        r#"
        INSERT INTO media_sources (
          id, kind, original_value, canonical_url, extractor_key, source_domain, uploader, uploaded_at,
          metadata_json, created_at, updated_at
        ) VALUES (?1, 'url', ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?9)
        "#,
        params![
            media_source_id,
            payload.input_value,
            canonical_url,
            extractor_key,
            domain_from_url(canonical_url),
            uploader,
            uploaded_at,
            serde_json::to_string_pretty(&metadata_json)?,
            now()
        ],
    )?;

    connection.execute(
        r#"
        INSERT INTO media_items (
          id, source_id, title, slug, library_dir, source_media_path, origin_kind, status,
          duration_seconds, file_size_bytes, metadata_json, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'url', 'ready', ?7, ?8, ?9, ?10, ?10)
        "#,
        params![
            media_item_id,
            media_source_id,
            title,
            slug,
            canonicalize_lossy(&item_dir),
            canonicalize_lossy(&source_media_path),
            duration_seconds,
            file_size(&source_media_path),
            serde_json::to_string_pretty(&json!({
                "title": title,
                "sourceKind": "url",
                "jobId": job_id,
                "authorizedIngestion": true,
                "extractorKey": extractor_key,
                "sourceMetadataPath": canonicalize_lossy(&source_metadata_path),
            }))?,
            now()
        ],
    )?;

    connection.execute(
        r#"
        INSERT INTO extracted_audio_assets (
          id, media_item_id, audio_path, format, codec, duration_seconds, bitrate_kbps, file_size_bytes, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, 'libmp3lame', ?5, NULL, ?6, ?7, ?7)
        "#,
        params![
            audio_asset_id,
            media_item_id,
            canonicalize_lossy(&audio_path),
            resolved.audio_format,
            duration_seconds,
            file_size(&audio_path),
            now()
        ],
    )?;

    if let Some(thumbnail_path) = thumbnail_path {
        connection.execute(
            r#"
            INSERT INTO thumbnails (
              id, media_item_id, local_path, remote_url, width, height, created_at, updated_at
            ) VALUES (?1, ?2, ?3, NULL, NULL, NULL, ?4, ?4)
            "#,
            params![thumbnail_id, media_item_id, canonicalize_lossy(&thumbnail_path), now()],
        )?;
    }

    if overwrite_policy == "replace" {
        if let Some(existing_item) = existing.as_ref() {
            if let Some(warning) = cleanup_existing_media_item(connection, existing_item)? {
                append_job_log(connection, job_id, &warning)?;
            }
        }
    }

    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = 'completed',
            stage = 'Completed',
            progress = 100,
            media_item_id = ?2,
            output_directory = ?3,
            error_message = NULL,
            finished_at = ?4,
            updated_at = ?4
        WHERE id = ?1
        "#,
        params![job_id, media_item_id, canonicalize_lossy(&item_dir), now()],
    )?;

    append_job_log(connection, job_id, "Ingestion finished successfully.")?;
    Ok(())
}

fn process_local_file_ingestion(connection: &Connection, db_path: &Path, job_id: &str, payload: &IngestionRequest) -> Result<()> {
    let resolved = resolve_paths(db_path)?;
    let overwrite_policy = normalize_overwrite_policy(&resolved.overwrite_policy);
    let library_root = PathBuf::from(
        resolved
            .library_root
            .clone()
            .ok_or_else(|| anyhow!("Configure a library root directory before starting ingestion jobs."))?,
    );
    let ffmpeg = resolved
        .ffmpeg_path
        .clone()
        .or_else(|| detect_binary("ffmpeg", None).resolved_path)
        .ok_or_else(|| anyhow!("ffmpeg was not found. Save a valid ffmpeg path in Settings."))?;

    let source_path = PathBuf::from(payload.input_value.trim());
    if !source_path.exists() {
        bail!("The selected local file does not exist: {}", source_path.display());
    }

    let canonical_source_input = canonicalize_lossy(&source_path);

    ensure_directory(&library_root)?;
    ensure_directory(&library_root.join("items"))?;

    append_job_log(connection, job_id, &format!("Using library root: {}", library_root.display()))?;
    append_job_log(connection, job_id, &format!("Using ffmpeg binary: {}", ffmpeg))?;
    append_job_log(connection, job_id, &format!("Using overwrite policy: {}", overwrite_policy))?;

    let title = source_path
        .file_stem()
        .and_then(OsStr::to_str)
        .unwrap_or("local-media");
    let slug = slugify(title);

    let existing = find_existing_local_item(connection, payload.input_value.trim(), &canonical_source_input)?;
    if overwrite_policy == "skip" {
        if let Some(existing_item) = existing.as_ref() {
            complete_job_as_skipped(
                connection,
                job_id,
                existing_item,
                "Skipped existing item",
                &format!(
                    "Existing item for this local source already lives at {}. Job completed without writing new output because overwrite policy is set to skip.",
                    existing_item.library_dir
                ),
            )?;
            return Ok(());
        }
    } else if let Some(existing_item) = existing.as_ref() {
        append_job_log(
            connection,
            job_id,
            &format!(
                "Replace policy matched an existing local item at {}. The previous catalog entry will be removed after the new run finishes successfully.",
                existing_item.library_dir
            ),
        )?;
    }

    let short_id = &job_id[..8];
    let item_dir = library_root.join("items").join(format!("{}--{}", slug, short_id));
    let source_dir = item_dir.join("source");
    let audio_dir = item_dir.join("audio");
    ensure_directory(&source_dir)?;
    ensure_directory(&audio_dir)?;

    let extension = source_path.extension().and_then(OsStr::to_str).unwrap_or("bin");
    let managed_source_path = source_dir.join(format!("source.{}", extension));
    update_job_stage(connection, job_id, "processing", "Copying local source into managed library", 30, Some(canonicalize_lossy(&item_dir)), None)?;

    fs::copy(&source_path, &managed_source_path)
        .with_context(|| format!("failed to copy {} to {}", source_path.display(), managed_source_path.display()))?;

    let source_metadata = json!({
        "sourceKind": "local_file",
        "originalPath": canonical_source_input,
        "managedSourcePath": managed_source_path.display().to_string(),
        "jobId": job_id,
        "authorizedIngestion": true,
    });
    let source_metadata_path = item_dir.join("source-metadata.json");
    fs::write(&source_metadata_path, serde_json::to_string_pretty(&source_metadata)?)?;

    update_job_stage(connection, job_id, "processing", "Extracting audio asset", 68, Some(canonicalize_lossy(&item_dir)), None)?;
    let audio_path = audio_dir.join(format!("track.{}", resolved.audio_format));
    run_command(
        Command::new(&ffmpeg)
            .arg("-y")
            .arg("-i")
            .arg(&managed_source_path)
            .arg("-vn")
            .arg("-acodec")
            .arg("libmp3lame")
            .arg("-q:a")
            .arg("2")
            .arg(&audio_path),
        "ffmpeg audio extraction",
    )?;

    let media_source_id = Uuid::new_v4().to_string();
    let media_item_id = Uuid::new_v4().to_string();
    let audio_asset_id = Uuid::new_v4().to_string();

    connection.execute(
        r#"
        INSERT INTO media_sources (
          id, kind, original_value, canonical_url, extractor_key, source_domain, uploader, uploaded_at,
          metadata_json, created_at, updated_at
        ) VALUES (?1, 'local_file', ?2, NULL, 'local', NULL, NULL, NULL, ?3, ?4, ?4)
        "#,
        params![
            media_source_id,
            canonical_source_input,
            serde_json::to_string_pretty(&source_metadata)?,
            now()
        ],
    )?;

    connection.execute(
        r#"
        INSERT INTO media_items (
          id, source_id, title, slug, library_dir, source_media_path, origin_kind, status,
          duration_seconds, file_size_bytes, metadata_json, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'local_file', 'ready', NULL, ?7, ?8, ?9, ?9)
        "#,
        params![
            media_item_id,
            media_source_id,
            title,
            slug,
            canonicalize_lossy(&item_dir),
            canonicalize_lossy(&managed_source_path),
            file_size(&managed_source_path),
            serde_json::to_string_pretty(&json!({
                "title": title,
                "sourceKind": "local_file",
                "jobId": job_id,
                "authorizedIngestion": true,
                "sourceMetadataPath": canonicalize_lossy(&source_metadata_path),
            }))?,
            now()
        ],
    )?;

    connection.execute(
        r#"
        INSERT INTO extracted_audio_assets (
          id, media_item_id, audio_path, format, codec, duration_seconds, bitrate_kbps, file_size_bytes, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, 'libmp3lame', NULL, NULL, ?5, ?6, ?6)
        "#,
        params![
            audio_asset_id,
            media_item_id,
            canonicalize_lossy(&audio_path),
            resolved.audio_format,
            file_size(&audio_path),
            now()
        ],
    )?;

    if overwrite_policy == "replace" {
        if let Some(existing_item) = existing.as_ref() {
            if let Some(warning) = cleanup_existing_media_item(connection, existing_item)? {
                append_job_log(connection, job_id, &warning)?;
            }
        }
    }

    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = 'completed',
            stage = 'Completed',
            progress = 100,
            media_item_id = ?2,
            output_directory = ?3,
            error_message = NULL,
            finished_at = ?4,
            updated_at = ?4
        WHERE id = ?1
        "#,
        params![job_id, media_item_id, canonicalize_lossy(&item_dir), now()],
    )?;

    append_job_log(connection, job_id, "Local file ingestion finished successfully.")?;
    Ok(())
}

fn run_command(command: &mut Command, label: &str) -> Result<String> {
    let output = command
        .output()
        .with_context(|| format!("failed to execute {}", label))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

    if output.status.success() {
        if !stdout.is_empty() {
            Ok(stdout)
        } else {
            Ok(stderr)
        }
    } else {
        Err(anyhow!(
            "{} failed with exit code {:?}: {}",
            label,
            output.status.code(),
            if stderr.is_empty() { stdout } else { stderr }
        ))
    }
}

fn update_job_stage(
    connection: &Connection,
    job_id: &str,
    status: &str,
    stage: &str,
    progress: i64,
    output_directory: Option<String>,
    error_message: Option<String>,
) -> Result<()> {
    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = ?2,
            stage = ?3,
            progress = ?4,
            output_directory = COALESCE(?5, output_directory),
            error_message = ?6,
            started_at = COALESCE(started_at, ?7),
            updated_at = ?7
        WHERE id = ?1
        "#,
        params![job_id, status, stage, progress, output_directory, error_message, now()],
    )?;
    Ok(())
}

fn append_job_log(connection: &Connection, job_id: &str, message: &str) -> Result<()> {
    let existing: Option<String> = connection
        .query_row("SELECT log_excerpt FROM ingestion_jobs WHERE id = ?1", [job_id], |row| row.get(0))
        .optional()?;

    let mut next = existing.unwrap_or_default();
    if !next.is_empty() {
        next.push_str("\n\n");
    }
    next.push_str(message);

    if next.len() > 20000 {
        next = next[next.len().saturating_sub(20000)..].to_string();
    }

    connection.execute(
        "UPDATE ingestion_jobs SET log_excerpt = ?2, updated_at = ?3 WHERE id = ?1",
        params![job_id, next, now()],
    )?;
    Ok(())
}

fn persist_failure(db_path: &Path, job_id: &str, error_message: &str) -> Result<()> {
    let connection = open_connection(db_path)?;
    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = 'failed',
            stage = 'Failed',
            error_message = ?2,
            finished_at = ?3,
            updated_at = ?3
        WHERE id = ?1
        "#,
        params![job_id, error_message, now()],
    )?;
    append_job_log(&connection, job_id, error_message)?;
    Ok(())
}

fn normalize_overwrite_policy(value: &str) -> &str {
    if value == "replace" {
        "replace"
    } else {
        "skip"
    }
}

fn find_existing_url_item(connection: &Connection, canonical_url: &str, original_value: &str) -> Result<Option<ExistingMediaItem>> {
    let row = connection
        .query_row(
            r#"
            SELECT mi.id, mi.source_id, mi.library_dir
            FROM media_items mi
            INNER JOIN media_sources ms ON ms.id = mi.source_id
            WHERE ms.kind = 'url'
              AND (
                LOWER(COALESCE(ms.canonical_url, '')) = LOWER(?1)
                OR LOWER(ms.original_value) = LOWER(?2)
              )
            ORDER BY mi.created_at DESC
            LIMIT 1
            "#,
            params![canonical_url, original_value],
            |row| {
                Ok(ExistingMediaItem {
                    media_item_id: row.get(0)?,
                    media_source_id: row.get(1)?,
                    library_dir: row.get(2)?,
                })
            },
        )
        .optional()?;

    Ok(row)
}

fn find_existing_local_item(connection: &Connection, raw_original_value: &str, canonical_original_value: &str) -> Result<Option<ExistingMediaItem>> {
    let row = connection
        .query_row(
            r#"
            SELECT mi.id, mi.source_id, mi.library_dir
            FROM media_items mi
            INNER JOIN media_sources ms ON ms.id = mi.source_id
            WHERE ms.kind = 'local_file'
              AND (
                ms.original_value = ?1
                OR ms.original_value = ?2
              )
            ORDER BY mi.created_at DESC
            LIMIT 1
            "#,
            params![raw_original_value, canonical_original_value],
            |row| {
                Ok(ExistingMediaItem {
                    media_item_id: row.get(0)?,
                    media_source_id: row.get(1)?,
                    library_dir: row.get(2)?,
                })
            },
        )
        .optional()?;

    Ok(row)
}

fn complete_job_as_skipped(
    connection: &Connection,
    job_id: &str,
    existing_item: &ExistingMediaItem,
    stage: &str,
    log_message: &str,
) -> Result<()> {
    let finished_at = now();
    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = 'completed',
            stage = ?2,
            progress = 100,
            media_item_id = ?3,
            output_directory = ?4,
            error_message = NULL,
            finished_at = ?5,
            updated_at = ?5
        WHERE id = ?1
        "#,
        params![
            job_id,
            stage,
            existing_item.media_item_id,
            existing_item.library_dir,
            finished_at
        ],
    )?;
    append_job_log(connection, job_id, log_message)?;
    Ok(())
}

fn cleanup_existing_media_item(connection: &Connection, existing_item: &ExistingMediaItem) -> Result<Option<String>> {
    let mut warnings = Vec::new();

    let existing_path = PathBuf::from(&existing_item.library_dir);
    if existing_path.exists() {
        if let Err(error) = fs::remove_dir_all(&existing_path) {
            warnings.push(format!(
                "Warning: Soniva created the replacement item but could not remove the previous directory {}: {}",
                existing_path.display(),
                error
            ));
        }
    }

    if let Err(error) = connection.execute("DELETE FROM media_sources WHERE id = ?1", [&existing_item.media_source_id]) {
        warnings.push(format!(
            "Warning: Soniva created the replacement item but could not remove the previous catalog record: {}",
            error
        ));
    }

    if warnings.is_empty() {
        Ok(None)
    } else {
        Ok(Some(warnings.join(" ")))
    }
}

fn slugify(input: &str) -> String {
    let mut slug = String::with_capacity(input.len());
    let mut previous_dash = false;

    for character in input.chars() {
        let lower = character.to_ascii_lowercase();
        if lower.is_ascii_alphanumeric() {
            slug.push(lower);
            previous_dash = false;
        } else if !previous_dash {
            slug.push('-');
            previous_dash = true;
        }
    }

    let slug = slug.trim_matches('-').to_string();
    if slug.is_empty() {
        "media-item".to_string()
    } else {
        slug
    }
}

fn find_primary_source_file(directory: &Path) -> Option<PathBuf> {
    let mut candidates = fs::read_dir(directory)
        .ok()?
        .filter_map(|entry| entry.ok().map(|entry| entry.path()))
        .filter(|path| path.is_file())
        .filter(|path| {
            let ext = path
                .extension()
                .and_then(OsStr::to_str)
                .unwrap_or_default()
                .to_ascii_lowercase();
            !matches!(ext.as_str(), "json" | "jpg" | "jpeg" | "png" | "webp" | "part")
        })
        .collect::<Vec<_>>();

    candidates.sort();
    candidates.into_iter().next()
}

fn find_first_thumbnail(directory: &Path) -> Option<PathBuf> {
    let mut candidates = fs::read_dir(directory)
        .ok()?
        .filter_map(|entry| entry.ok().map(|entry| entry.path()))
        .filter(|path| path.is_file())
        .filter(|path| {
            let ext = path
                .extension()
                .and_then(OsStr::to_str)
                .unwrap_or_default()
                .to_ascii_lowercase();
            matches!(ext.as_str(), "jpg" | "jpeg" | "png" | "webp")
        })
        .collect::<Vec<_>>();

    candidates.sort();
    candidates.into_iter().next()
}
