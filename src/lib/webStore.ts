import {
  DEMO_BOOTSTRAP,
  DEMO_DETAILS,
  DEMO_JOBS,
  DEMO_LIBRARY,
  DEMO_SETTINGS
} from "./demoData";
import type {
  BinaryProbe,
  BootstrapResponse,
  DashboardMetrics,
  IngestionJobRecord,
  IngestionRequest,
  JobDetailResponse,
  LibraryFilter,
  LibraryListItem,
  MediaItemDetail,
  SaveSettingsResponse,
  SettingsPayload
} from "../types";

type WebState = {
  bootstrap: BootstrapResponse;
  settings: SettingsPayload;
  jobs: IngestionJobRecord[];
  library: LibraryListItem[];
  details: Record<string, MediaItemDetail>;
  demoLoaded: boolean;
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

function emptyState(): WebState {
  return {
    bootstrap: {
      appDataDir: "web-demo/app-data",
      databasePath: "web-demo/soniva.db",
      libraryRoot: null,
      detectedYtDlpPath: null,
      detectedFfmpegPath: null,
      appVersion: "0.1.0-web",
      overwritePolicy: "skip"
    },
    settings: {
      libraryRoot: "",
      ytDlpPath: "",
      ffmpegPath: "",
      audioFormat: "mp3",
      overwritePolicy: "skip"
    },
    jobs: [],
    library: [],
    details: {},
    demoLoaded: false
  };
}

let state: WebState = emptyState();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeWebStore(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isDemoLoaded() {
  return state.demoLoaded;
}

export function loadDemoData() {
  state = {
    bootstrap: clone(DEMO_BOOTSTRAP),
    settings: clone(DEMO_SETTINGS),
    jobs: clone(DEMO_JOBS),
    library: clone(DEMO_LIBRARY),
    details: clone(DEMO_DETAILS),
    demoLoaded: true
  };
  notify();
}

export function clearDemoData() {
  state = emptyState();
  notify();
}

export async function webBootstrapApp(): Promise<BootstrapResponse> {
  return clone(state.bootstrap);
}

export async function webDetectBinary(
  binaryName: "yt-dlp" | "ffmpeg",
  preferredPath?: string
): Promise<BinaryProbe> {
  const configured =
    preferredPath?.trim() ||
    (binaryName === "yt-dlp" ? state.settings.ytDlpPath : state.settings.ffmpegPath) ||
    (binaryName === "yt-dlp" ? state.bootstrap.detectedYtDlpPath : state.bootstrap.detectedFfmpegPath);

  if (configured) {
    return {
      found: true,
      binaryName,
      resolvedPath: configured,
      version: "demo",
      message: `${binaryName} resolvido no modo demonstração web.`
    };
  }

  return {
    found: false,
    binaryName,
    resolvedPath: null,
    version: null,
    message: `Carregue os dados de demonstração ou informe o caminho de ${binaryName}.`
  };
}

export async function webSaveSettings(payload: SettingsPayload): Promise<SaveSettingsResponse> {
  state.settings = clone(payload);
  state.bootstrap = {
    ...state.bootstrap,
    libraryRoot: payload.libraryRoot || null,
    detectedYtDlpPath: payload.ytDlpPath || state.bootstrap.detectedYtDlpPath,
    detectedFfmpegPath: payload.ffmpegPath || state.bootstrap.detectedFfmpegPath,
    overwritePolicy: payload.overwritePolicy
  };
  notify();
  return {
    saved: true,
    message: "Configurações salvas no modo demonstração (memória local do navegador)."
  };
}

export async function webStartIngestionJob(payload: IngestionRequest): Promise<{ jobId: string }> {
  if (!payload.authorized) {
    throw new Error("Confirme o uso autorizado antes de criar o job.");
  }
  if (!state.bootstrap.libraryRoot) {
    throw new Error("Configure a raiz da biblioteca em Configurações primeiro.");
  }

  const jobId = `job-web-${Date.now()}`;
  const mediaId = `media-web-${Date.now()}`;
  const createdAt = new Date().toISOString();
  const title = payload.inputValue.split(/[\\/]/).pop() || payload.inputValue;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "item-demo";

  const item: LibraryListItem = {
    id: mediaId,
    title: `Demo — ${title}`,
    slug,
    status: "ready",
    originKind: payload.sourceKind,
    durationSeconds: 320,
    fileSizeBytes: 8_388_608,
    sourceMediaPath: `${state.bootstrap.libraryRoot}/${slug}/source.mp4`,
    libraryDir: `${state.bootstrap.libraryRoot}/${slug}`,
    audioPath: `${state.bootstrap.libraryRoot}/${slug}/audio.mp3`,
    audioFormat: "mp3",
    sourceLabel: payload.sourceKind === "url" ? "URL autorizada (demo)" : "Arquivo local (demo)",
    uploader: "Demo Web",
    thumbnailPath: null,
    createdAt,
    updatedAt: createdAt
  };

  const job: IngestionJobRecord = {
    id: jobId,
    sourceKind: payload.sourceKind,
    inputValue: payload.inputValue,
    status: "completed",
    stage: "extração de áudio",
    progress: 100,
    mediaItemId: mediaId,
    outputDirectory: item.libraryDir,
    logExcerpt: "Job simulado no modo web · metadados e áudio fictícios gerados",
    errorMessage: null,
    createdAt,
    startedAt: createdAt,
    finishedAt: createdAt,
    updatedAt: createdAt
  };

  state.jobs = [job, ...state.jobs];
  state.library = [item, ...state.library];
  state.details[mediaId] = {
    item,
    metadataJson: JSON.stringify({ title: item.title, mode: "web-demo" }, null, 2),
    sourceMetadataJson: JSON.stringify({ input: payload.inputValue }, null, 2),
    remoteUrl: payload.sourceKind === "url" ? payload.inputValue : null
  };
  notify();
  return { jobId };
}

export async function webListLibraryItems(query: string, filter: LibraryFilter): Promise<LibraryListItem[]> {
  const normalized = query.trim().toLowerCase();
  return state.library
    .filter((item) => {
      if (filter === "ready" && item.status !== "ready") return false;
      if (filter === "failed" && item.status !== "failed") return false;
      if (!normalized) return true;
      return [item.title, item.sourceLabel, item.uploader, item.slug]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(normalized));
    })
    .map(clone);
}

export async function webGetMediaItemDetail(mediaItemId: string): Promise<MediaItemDetail> {
  const detail = state.details[mediaItemId];
  if (detail) return clone(detail);
  const item = state.library.find((entry) => entry.id === mediaItemId);
  if (!item) {
    throw new Error("Item da biblioteca não encontrado.");
  }
  return {
    item: clone(item),
    metadataJson: null,
    sourceMetadataJson: null,
    remoteUrl: null
  };
}

export async function webGetJobDetail(jobId: string): Promise<JobDetailResponse> {
  const job = state.jobs.find((entry) => entry.id === jobId);
  if (!job) {
    throw new Error("Job não encontrado.");
  }
  const detail = job.mediaItemId ? await webGetMediaItemDetail(job.mediaItemId) : null;
  return { job: clone(job), detail };
}

export async function webOpenInFileManager(path: string): Promise<void> {
  console.info("[Soniva web demo] Abrir no gerenciador:", path);
}

export async function webReadSettingsMap(): Promise<Record<string, string>> {
  return {
    library_root: state.settings.libraryRoot,
    yt_dlp_path: state.settings.ytDlpPath,
    ffmpeg_path: state.settings.ffmpegPath,
    audio_format: state.settings.audioFormat,
    overwrite_policy: state.settings.overwritePolicy
  };
}

export async function webListJobs(limit = 24): Promise<IngestionJobRecord[]> {
  return state.jobs.slice(0, limit).map(clone);
}

export async function webCountDashboardMetrics(): Promise<DashboardMetrics> {
  return {
    totalItems: state.library.length,
    totalJobs: state.jobs.length,
    completedJobs: state.jobs.filter((job) => job.status === "completed").length,
    failedJobs: state.jobs.filter((job) => job.status === "failed").length
  };
}
