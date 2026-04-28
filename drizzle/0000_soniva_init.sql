CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media_sources (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL,
  original_value TEXT NOT NULL,
  canonical_url TEXT,
  extractor_key TEXT,
  source_domain TEXT,
  uploader TEXT,
  uploaded_at TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY NOT NULL,
  source_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  library_dir TEXT NOT NULL,
  source_media_path TEXT,
  origin_kind TEXT NOT NULL,
  status TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes INTEGER,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (source_id) REFERENCES media_sources(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_media_items_slug ON media_items(slug);
CREATE INDEX IF NOT EXISTS idx_media_items_created_at ON media_items(created_at DESC);

CREATE TABLE IF NOT EXISTS extracted_audio_assets (
  id TEXT PRIMARY KEY NOT NULL,
  media_item_id TEXT NOT NULL,
  audio_path TEXT NOT NULL,
  format TEXT NOT NULL,
  codec TEXT,
  duration_seconds INTEGER,
  bitrate_kbps INTEGER,
  file_size_bytes INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (media_item_id) REFERENCES media_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_audio_assets_media_item_id ON extracted_audio_assets(media_item_id);

CREATE TABLE IF NOT EXISTS thumbnails (
  id TEXT PRIMARY KEY NOT NULL,
  media_item_id TEXT NOT NULL,
  local_path TEXT,
  remote_url TEXT,
  width INTEGER,
  height INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (media_item_id) REFERENCES media_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_thumbnails_media_item_id ON thumbnails(media_item_id);

CREATE TABLE IF NOT EXISTS ingestion_jobs (
  id TEXT PRIMARY KEY NOT NULL,
  source_kind TEXT NOT NULL,
  input_value TEXT NOT NULL,
  status TEXT NOT NULL,
  stage TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  media_item_id TEXT,
  output_directory TEXT,
  log_excerpt TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL,
  started_at TEXT,
  finished_at TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (media_item_id) REFERENCES media_items(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_created_at ON ingestion_jobs(created_at DESC);
