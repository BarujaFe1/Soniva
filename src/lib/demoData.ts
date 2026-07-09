import type {
  BootstrapResponse,
  IngestionJobRecord,
  LibraryListItem,
  MediaItemDetail,
  SettingsPayload
} from "../types";

const now = Date.now();
const iso = (offsetMs: number) => new Date(now - offsetMs).toISOString();

export const DEMO_SETTINGS: SettingsPayload = {
  libraryRoot: "C:/Users/Demo/SonivaLibrary",
  ytDlpPath: "C:/Tools/yt-dlp.exe",
  ffmpegPath: "C:/Tools/ffmpeg.exe",
  audioFormat: "mp3",
  overwritePolicy: "skip"
};

export const DEMO_BOOTSTRAP: BootstrapResponse = {
  appDataDir: "C:/Users/Demo/AppData/Soniva",
  databasePath: "C:/Users/Demo/AppData/Soniva/soniva.db",
  libraryRoot: DEMO_SETTINGS.libraryRoot,
  detectedYtDlpPath: DEMO_SETTINGS.ytDlpPath,
  detectedFfmpegPath: DEMO_SETTINGS.ffmpegPath,
  appVersion: "0.1.0-web",
  overwritePolicy: DEMO_SETTINGS.overwritePolicy
};

export const DEMO_LIBRARY: LibraryListItem[] = [
  {
    id: "media-demo-001",
    title: "Podcast Autorizado — Episódio 12",
    slug: "podcast-autorizado-episodio-12",
    status: "ready",
    originKind: "url",
    durationSeconds: 1842,
    fileSizeBytes: 29_450_112,
    sourceMediaPath: "C:/Users/Demo/SonivaLibrary/podcast-autorizado-episodio-12/source.mp4",
    libraryDir: "C:/Users/Demo/SonivaLibrary/podcast-autorizado-episodio-12",
    audioPath: "C:/Users/Demo/SonivaLibrary/podcast-autorizado-episodio-12/audio.mp3",
    audioFormat: "mp3",
    sourceLabel: "Fonte licenciada (demo)",
    uploader: "Estúdio Norte",
    thumbnailPath: null,
    createdAt: iso(1000 * 60 * 60 * 26),
    updatedAt: iso(1000 * 60 * 60 * 25)
  },
  {
    id: "media-demo-002",
    title: "Workshop de Áudio Local",
    slug: "workshop-de-audio-local",
    status: "ready",
    originKind: "local_file",
    durationSeconds: 960,
    fileSizeBytes: 142_880_256,
    sourceMediaPath: "C:/Users/Demo/SonivaLibrary/workshop-de-audio-local/source.mov",
    libraryDir: "C:/Users/Demo/SonivaLibrary/workshop-de-audio-local",
    audioPath: "C:/Users/Demo/SonivaLibrary/workshop-de-audio-local/audio.mp3",
    audioFormat: "mp3",
    sourceLabel: "Arquivo local autorizado",
    uploader: "Você",
    thumbnailPath: null,
    createdAt: iso(1000 * 60 * 60 * 8),
    updatedAt: iso(1000 * 60 * 60 * 7)
  },
  {
    id: "media-demo-003",
    title: "Arquivo Domínio Público — Orquestra",
    slug: "arquivo-dominio-publico-orquestra",
    status: "failed",
    originKind: "url",
    durationSeconds: null,
    fileSizeBytes: null,
    sourceMediaPath: null,
    libraryDir: "C:/Users/Demo/SonivaLibrary/arquivo-dominio-publico-orquestra",
    audioPath: null,
    audioFormat: null,
    sourceLabel: "Domínio público (demo)",
    uploader: "Arquivo Aberto",
    thumbnailPath: null,
    createdAt: iso(1000 * 60 * 45),
    updatedAt: iso(1000 * 60 * 40)
  }
];

export const DEMO_JOBS: IngestionJobRecord[] = [
  {
    id: "job-demo-001",
    sourceKind: "url",
    inputValue: "https://example.com/autorizado/podcast-12",
    status: "completed",
    stage: "extração de áudio",
    progress: 100,
    mediaItemId: "media-demo-001",
    outputDirectory: "C:/Users/Demo/SonivaLibrary/podcast-autorizado-episodio-12",
    logExcerpt: "Metadados coletados · thumbnail preservada · MP3 gerado",
    errorMessage: null,
    createdAt: iso(1000 * 60 * 60 * 26),
    startedAt: iso(1000 * 60 * 60 * 26 - 5000),
    finishedAt: iso(1000 * 60 * 60 * 25),
    updatedAt: iso(1000 * 60 * 60 * 25)
  },
  {
    id: "job-demo-002",
    sourceKind: "local_file",
    inputValue: "C:/Users/Demo/Media/workshop-audio.mov",
    status: "completed",
    stage: "catalogação",
    progress: 100,
    mediaItemId: "media-demo-002",
    outputDirectory: "C:/Users/Demo/SonivaLibrary/workshop-de-audio-local",
    logExcerpt: "Arquivo copiado para biblioteca · áudio extraído com ffmpeg",
    errorMessage: null,
    createdAt: iso(1000 * 60 * 60 * 8),
    startedAt: iso(1000 * 60 * 60 * 8 - 2000),
    finishedAt: iso(1000 * 60 * 60 * 7),
    updatedAt: iso(1000 * 60 * 60 * 7)
  },
  {
    id: "job-demo-003",
    sourceKind: "url",
    inputValue: "https://example.com/autorizado/orquestra",
    status: "failed",
    stage: "download",
    progress: 42,
    mediaItemId: "media-demo-003",
    outputDirectory: "C:/Users/Demo/SonivaLibrary/arquivo-dominio-publico-orquestra",
    logExcerpt: "Falha simulada para demonstrar inspeção de erros",
    errorMessage: "Fonte temporariamente indisponível (demo).",
    createdAt: iso(1000 * 60 * 45),
    startedAt: iso(1000 * 60 * 44),
    finishedAt: iso(1000 * 60 * 40),
    updatedAt: iso(1000 * 60 * 40)
  },
  {
    id: "job-demo-004",
    sourceKind: "url",
    inputValue: "https://example.com/autorizado/entrevista",
    status: "processing",
    stage: "metadados",
    progress: 58,
    mediaItemId: null,
    outputDirectory: null,
    logExcerpt: "Consultando metadados da fonte autorizada…",
    errorMessage: null,
    createdAt: iso(1000 * 60 * 3),
    startedAt: iso(1000 * 60 * 2),
    finishedAt: null,
    updatedAt: iso(1000 * 30)
  }
];

export const DEMO_DETAILS: Record<string, MediaItemDetail> = {
  "media-demo-001": {
    item: DEMO_LIBRARY[0],
    metadataJson: JSON.stringify(
      {
        title: "Podcast Autorizado — Episódio 12",
        uploader: "Estúdio Norte",
        duration: 1842,
        format: "mp3",
        license: "uso autorizado (demo)"
      },
      null,
      2
    ),
    sourceMetadataJson: JSON.stringify(
      {
        id: "podcast-12",
        webpage_url: "https://example.com/autorizado/podcast-12",
        extractor: "demo"
      },
      null,
      2
    ),
    remoteUrl: "https://example.com/autorizado/podcast-12"
  },
  "media-demo-002": {
    item: DEMO_LIBRARY[1],
    metadataJson: JSON.stringify(
      {
        title: "Workshop de Áudio Local",
        origin: "local_file",
        duration: 960,
        format: "mp3"
      },
      null,
      2
    ),
    sourceMetadataJson: null,
    remoteUrl: null
  },
  "media-demo-003": {
    item: DEMO_LIBRARY[2],
    metadataJson: null,
    sourceMetadataJson: JSON.stringify({ error: "Fonte temporariamente indisponível (demo)." }, null, 2),
    remoteUrl: "https://example.com/autorizado/orquestra"
  }
};
