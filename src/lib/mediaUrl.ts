import { isTauriRuntime } from "./platform";

/**
 * Convert a local filesystem path into a URL the webview can load.
 * Desktop uses Tauri's convertFileSrc; web demo has no real media files.
 */
export async function toMediaUrl(filePath: string | null | undefined): Promise<string | null> {
  if (!filePath) return null;
  if (!isTauriRuntime()) return null;

  try {
    const { convertFileSrc } = await import("@tauri-apps/api/core");
    return convertFileSrc(filePath);
  } catch {
    return null;
  }
}
