import { isTauriRuntime } from "./platform";

export async function pickFile(filters: { name: string; extensions: string[] }[]): Promise<string | null> {
  if (!isTauriRuntime()) {
    const value = window.prompt("Informe o caminho do arquivo de mídia (demo web):", "C:/Users/Demo/Media/exemplo.mov");
    return value?.trim() || null;
  }

  const { open } = await import("@tauri-apps/plugin-dialog");
  const selected = await open({
    directory: false,
    multiple: false,
    filters
  });
  return typeof selected === "string" ? selected : null;
}

export async function pickDirectory(): Promise<string | null> {
  if (!isTauriRuntime()) {
    const value = window.prompt("Informe a pasta da biblioteca (demo web):", "C:/Users/Demo/SonivaLibrary");
    return value?.trim() || null;
  }

  const { open } = await import("@tauri-apps/plugin-dialog");
  const selected = await open({ directory: true, multiple: false });
  return typeof selected === "string" ? selected : null;
}
