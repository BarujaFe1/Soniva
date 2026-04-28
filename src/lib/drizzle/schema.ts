import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const appSettings = sqliteTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const ingestionJobs = sqliteTable("ingestion_jobs", {
  id: text("id").primaryKey(),
  sourceKind: text("source_kind").notNull(),
  inputValue: text("input_value").notNull(),
  status: text("status").notNull(),
  stage: text("stage").notNull(),
  progress: integer("progress").notNull(),
  mediaItemId: text("media_item_id"),
  outputDirectory: text("output_directory"),
  logExcerpt: text("log_excerpt"),
  errorMessage: text("error_message"),
  createdAt: text("created_at").notNull(),
  startedAt: text("started_at"),
  finishedAt: text("finished_at"),
  updatedAt: text("updated_at").notNull()
});

export const mediaItems = sqliteTable("media_items", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  libraryDir: text("library_dir").notNull(),
  sourceMediaPath: text("source_media_path"),
  originKind: text("origin_kind").notNull(),
  status: text("status").notNull(),
  durationSeconds: integer("duration_seconds"),
  fileSizeBytes: integer("file_size_bytes"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const mediaSources = sqliteTable("media_sources", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  originalValue: text("original_value").notNull(),
  canonicalUrl: text("canonical_url"),
  extractorKey: text("extractor_key"),
  sourceDomain: text("source_domain"),
  uploader: text("uploader"),
  uploadedAt: text("uploaded_at"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const extractedAudioAssets = sqliteTable("extracted_audio_assets", {
  id: text("id").primaryKey(),
  mediaItemId: text("media_item_id").notNull(),
  audioPath: text("audio_path").notNull(),
  format: text("format").notNull(),
  codec: text("codec"),
  durationSeconds: integer("duration_seconds"),
  bitrateKbps: integer("bitrate_kbps"),
  fileSizeBytes: integer("file_size_bytes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});

export const thumbnails = sqliteTable("thumbnails", {
  id: text("id").primaryKey(),
  mediaItemId: text("media_item_id").notNull(),
  localPath: text("local_path"),
  remoteUrl: text("remote_url"),
  width: integer("width"),
  height: integer("height"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull()
});
