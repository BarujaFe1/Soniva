export type AppPage = "overview" | "ingest" | "library" | "jobs" | "settings";

export type JobStatus =
  | "queued"
  | "processing"
  | "completed"
  | "failed";

export type SourceKind = "url" | "local_file";

export type BootstrapResponse = {
  appDataDir: string;
  databasePath: string;
  libraryRoot: string | null;
  detectedYtDlpPath: string | null;
  detectedFfmpegPath: string | null;
  appVersion: string;
  overwritePolicy?: string;
};

export type BinaryProbe = {
  found: boolean;
  binaryName: string;
  resolvedPath: string | null;
  version: string | null;
  message: string;
};

export type SettingsPayload = {
  libraryRoot: string;
  ytDlpPath: string;
  ffmpegPath: string;
  audioFormat: "mp3";
  overwritePolicy: "skip" | "replace";
};

export type DashboardMetrics = {
  totalItems: number;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
};

export type IngestionRequest = {
  sourceKind: SourceKind;
  inputValue: string;
  authorized: boolean;
};

export type IngestionJobRecord = {
  id: string;
  sourceKind: SourceKind;
  inputValue: string;
  status: JobStatus;
  stage: string;
  progress: number;
  mediaItemId: string | null;
  outputDirectory: string | null;
  logExcerpt: string | null;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  updatedAt: string;
};

export type LibraryListItem = {
  id: string;
  title: string;
  slug: string;
  status: string;
  originKind: string;
  durationSeconds: number | null;
  fileSizeBytes: number | null;
  sourceMediaPath: string | null;
  libraryDir: string;
  audioPath: string | null;
  audioFormat: string | null;
  sourceLabel: string | null;
  uploader: string | null;
  thumbnailPath: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MediaItemDetail = {
  item: LibraryListItem;
  metadataJson: string | null;
  sourceMetadataJson: string | null;
  remoteUrl: string | null;
};

export type SaveSettingsResponse = {
  saved: boolean;
  message: string;
};

export type JobDetailResponse = {
  job: IngestionJobRecord;
  detail: MediaItemDetail | null;
};

export type LibraryFilter = "all" | "ready" | "failed";
