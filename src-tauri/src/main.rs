#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod models;
mod pipeline;

use anyhow::{anyhow, Result};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, State};

use crate::db::{get_job_detail as db_get_job_detail, get_media_item_detail as db_get_media_item_detail, initialize_database, list_library_items as db_list_library_items, resolve_paths, save_settings as db_save_settings};
use crate::models::{BootstrapResponse, IngestionRequest, SaveSettingsResponse, SettingsPayload, SqlPayload, SqlResponse, StartJobResponse};

#[derive(Clone)]
struct AppState {
    db_path: PathBuf,
    app_data_dir: PathBuf,
}

#[tauri::command]
fn bootstrap_app(app: AppHandle, state: State<AppState>) -> Result<BootstrapResponse, String> {
    initialize_database(&state.db_path).map_err(stringify_error)?;
    let resolved = resolve_paths(&state.db_path).map_err(stringify_error)?;
    let detected_yt_dlp = pipeline::detect_binary("yt-dlp", resolved.yt_dlp_path.as_deref());
    let detected_ffmpeg = pipeline::detect_binary("ffmpeg", resolved.ffmpeg_path.as_deref());

    Ok(BootstrapResponse {
        app_data_dir: state.app_data_dir.display().to_string(),
        database_path: state.db_path.display().to_string(),
        library_root: resolved.library_root,
        detected_yt_dlp_path: detected_yt_dlp.resolved_path,
        detected_ffmpeg_path: detected_ffmpeg.resolved_path,
        app_version: app.package_info().version.to_string(),
    })
}

#[allow(non_snake_case)]
#[tauri::command]
fn detect_binary(binaryName: String, preferredPath: Option<String>) -> crate::models::BinaryProbe {
    pipeline::detect_binary(&binaryName, preferredPath.as_deref())
}

#[tauri::command]
fn execute_sql(state: State<AppState>, payload: SqlPayload) -> Result<SqlResponse, String> {
    db::execute_sql_proxy(&state.db_path, payload).map_err(stringify_error)
}

#[tauri::command]
fn save_settings(state: State<AppState>, payload: SettingsPayload) -> Result<SaveSettingsResponse, String> {
    if payload.library_root.trim().is_empty() {
        return Err("Library root is required.".to_string());
    }

    let library_root = PathBuf::from(payload.library_root.trim());
    std::fs::create_dir_all(&library_root).map_err(|error| format!("Failed to create library root: {}", error))?;

    db_save_settings(&state.db_path, &payload).map_err(stringify_error)?;
    Ok(SaveSettingsResponse {
        saved: true,
        message: "Settings saved successfully.".to_string(),
    })
}

#[tauri::command]
fn start_ingestion_job(state: State<AppState>, payload: IngestionRequest) -> Result<StartJobResponse, String> {
    let job_id = pipeline::queue_ingestion_job(state.db_path.clone(), payload).map_err(stringify_error)?;
    Ok(StartJobResponse { job_id })
}

#[tauri::command]
fn list_library_items(state: State<AppState>, query: Option<String>, filter: Option<String>) -> Result<Vec<crate::models::LibraryListItem>, String> {
    db_list_library_items(&state.db_path, query, filter).map_err(stringify_error)
}

#[allow(non_snake_case)]
#[tauri::command]
fn get_media_item_detail(state: State<AppState>, mediaItemId: String) -> Result<crate::models::MediaItemDetail, String> {
    db_get_media_item_detail(&state.db_path, &mediaItemId)
        .map_err(stringify_error)?
        .ok_or_else(|| "Media item not found.".to_string())
}

#[allow(non_snake_case)]
#[tauri::command]
fn get_job_detail(state: State<AppState>, jobId: String) -> Result<crate::models::JobDetailResponse, String> {
    db_get_job_detail(&state.db_path, &jobId)
        .map_err(stringify_error)?
        .ok_or_else(|| "Job not found.".to_string())
}

#[tauri::command]
fn open_in_file_manager(path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        std::process::Command::new("explorer")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open file manager: {}", e))?;
    }
    
    #[cfg(target_os = "macos")]
    {
        std::process::Command::new("open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open file manager: {}", e))?;
    }
    
    #[cfg(target_os = "linux")]
    {
        std::process::Command::new("xdg-open")
            .arg(&path)
            .spawn()
            .map_err(|e| format!("Failed to open file manager: {}", e))?;
    }
    
    Ok(())
}

fn build_state(app_handle: &AppHandle) -> Result<AppState> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|error| anyhow!("failed to resolve app data dir: {}", error))?;

    std::fs::create_dir_all(&app_data_dir)?;
    let db_path = app_data_dir.join("soniva.sqlite");
    initialize_database(&db_path)?;

    Ok(AppState { db_path, app_data_dir })
}

fn stringify_error(error: impl ToString) -> String {
    error.to_string()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let handle = app.handle();
            let state = build_state(&handle)?;
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            bootstrap_app,
            detect_binary,
            execute_sql,
            save_settings,
            start_ingestion_job,
            list_library_items,
            get_media_item_detail,
            get_job_detail,
            open_in_file_manager
        ])
        .run(tauri::generate_context!())
        .expect("failed to run Soniva");
}
