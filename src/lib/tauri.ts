import { invoke } from "@tauri-apps/api/core";
import type {
  BinaryProbe,
  BootstrapResponse,
  IngestionRequest,
  JobDetailResponse,
  LibraryFilter,
  LibraryListItem,
  MediaItemDetail,
  SaveSettingsResponse,
  SettingsPayload
} from "../types";

export async function bootstrapApp() {
  return invoke<BootstrapResponse>("bootstrap_app");
}

export async function detectBinary(binaryName: "yt-dlp" | "ffmpeg", preferredPath?: string) {
  return invoke<BinaryProbe>("detect_binary", { binaryName, preferredPath });
}

export async function saveSettings(payload: SettingsPayload) {
  return invoke<SaveSettingsResponse>("save_settings", { payload });
}

export async function startIngestionJob(payload: IngestionRequest) {
  return invoke<{ jobId: string }>("start_ingestion_job", { payload });
}

export async function listLibraryItems(query: string, filter: LibraryFilter) {
  return invoke<LibraryListItem[]>("list_library_items", { query, filter });
}

export async function getMediaItemDetail(mediaItemId: string) {
  return invoke<MediaItemDetail>("get_media_item_detail", { mediaItemId });
}

export async function getJobDetail(jobId: string) {
  return invoke<JobDetailResponse>("get_job_detail", { jobId });
}

export async function openInFileManager(path: string) {
  return invoke<void>("open_in_file_manager", { path });
}
