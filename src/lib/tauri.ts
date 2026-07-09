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
import { isTauriRuntime } from "./platform";
import {
  webBootstrapApp,
  webDetectBinary,
  webGetJobDetail,
  webGetMediaItemDetail,
  webListLibraryItems,
  webOpenInFileManager,
  webSaveSettings,
  webStartIngestionJob
} from "./webStore";

async function invokeTauri<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(command, args);
}

export async function bootstrapApp() {
  if (!isTauriRuntime()) return webBootstrapApp();
  return invokeTauri<BootstrapResponse>("bootstrap_app");
}

export async function detectBinary(binaryName: "yt-dlp" | "ffmpeg", preferredPath?: string) {
  if (!isTauriRuntime()) return webDetectBinary(binaryName, preferredPath);
  return invokeTauri<BinaryProbe>("detect_binary", { binaryName, preferredPath });
}

export async function saveSettings(payload: SettingsPayload) {
  if (!isTauriRuntime()) return webSaveSettings(payload);
  return invokeTauri<SaveSettingsResponse>("save_settings", { payload });
}

export async function startIngestionJob(payload: IngestionRequest) {
  if (!isTauriRuntime()) return webStartIngestionJob(payload);
  return invokeTauri<{ jobId: string }>("start_ingestion_job", { payload });
}

export async function listLibraryItems(query: string, filter: LibraryFilter) {
  if (!isTauriRuntime()) return webListLibraryItems(query, filter);
  return invokeTauri<LibraryListItem[]>("list_library_items", { query, filter });
}

export async function getMediaItemDetail(mediaItemId: string) {
  if (!isTauriRuntime()) return webGetMediaItemDetail(mediaItemId);
  return invokeTauri<MediaItemDetail>("get_media_item_detail", { mediaItemId });
}

export async function getJobDetail(jobId: string) {
  if (!isTauriRuntime()) return webGetJobDetail(jobId);
  return invokeTauri<JobDetailResponse>("get_job_detail", { jobId });
}

export async function openInFileManager(path: string) {
  if (!isTauriRuntime()) return webOpenInFileManager(path);
  return invokeTauri<void>("open_in_file_manager", { path });
}
