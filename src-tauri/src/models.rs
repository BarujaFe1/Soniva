use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BootstrapResponse {
    pub app_data_dir: String,
    pub database_path: String,
    pub library_root: Option<String>,
    pub detected_yt_dlp_path: Option<String>,
    pub detected_ffmpeg_path: Option<String>,
    pub app_version: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BinaryProbe {
    pub found: bool,
    pub binary_name: String,
    pub resolved_path: Option<String>,
    pub version: Option<String>,
    pub message: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SettingsPayload {
    pub library_root: String,
    pub yt_dlp_path: String,
    pub ffmpeg_path: String,
    pub audio_format: String,
    pub overwrite_policy: String,
}

#[derive(Debug, Serialize)]
pub struct SaveSettingsResponse {
    pub saved: bool,
    pub message: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IngestionRequest {
    pub source_kind: String,
    pub input_value: String,
    pub authorized: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StartJobResponse {
    pub job_id: String,
}

#[derive(Debug, Deserialize)]
pub struct SqlPayload {
    pub sql: String,
    pub params: Vec<serde_json::Value>,
    pub method: String,
}

#[derive(Debug, Serialize)]
pub struct SqlResponse {
    pub rows: serde_json::Value,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LibraryListItem {
    pub id: String,
    pub title: String,
    pub slug: String,
    pub status: String,
    pub origin_kind: String,
    pub duration_seconds: Option<i64>,
    pub file_size_bytes: Option<i64>,
    pub source_media_path: Option<String>,
    pub library_dir: String,
    pub audio_path: Option<String>,
    pub audio_format: Option<String>,
    pub source_label: Option<String>,
    pub uploader: Option<String>,
    pub thumbnail_path: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaItemDetail {
    pub item: LibraryListItem,
    pub metadata_json: Option<String>,
    pub source_metadata_json: Option<String>,
    pub remote_url: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct JobDetailResponse {
    pub job: serde_json::Value,
    pub detail: Option<MediaItemDetail>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResolvedPaths {
    pub library_root: Option<String>,
    pub yt_dlp_path: Option<String>,
    pub ffmpeg_path: Option<String>,
    pub audio_format: String,
    pub overwrite_policy: String,
}
