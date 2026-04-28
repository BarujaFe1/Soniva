# Soniva Architecture

## Architectural goals

Soniva optimizes for:

- local-first execution
- low operational complexity
- reliable desktop UX
- clean metadata traceability
- explicit local ownership of data and artifacts

## Runtime topology

### Frontend

React + TypeScript + Tailwind render the desktop UI.

Responsibilities:

- page-level UX
- settings forms
- ingestion submission
- jobs and library visibility
- relational reads through Drizzle over the SQLite proxy bridge

### Native layer

Rust + Tauri handle privileged local operations.

Responsibilities:

- app-data resolution
- SQLite bootstrap
- settings persistence
- command execution
- filesystem orchestration
- ingestion threading
- runtime validation and error propagation

### Data layer

SQLite stores:

- app settings
- ingestion jobs
- media sources
- media items
- extracted audio assets
- thumbnails

The live database is owned by the Tauri runtime and stored at:

- `app_data_dir/soniva.sqlite`

## Settings model

`app_settings` stores:

- `library_root`
- `yt_dlp_path`
- `ffmpeg_path`
- `audio_format`
- `overwrite_policy`

Binary paths are optional when runtime auto-detection from PATH succeeds.

## Ingestion rules

### URL ingestion

Requires:

- library root
- `yt-dlp`
- `ffmpeg`

### Local-file ingestion

Requires:

- library root
- `ffmpeg`

`yt-dlp` is not part of the local-file path.

## Overwrite behavior

Overwrite is applied only when Soniva recognizes the same source again.

Matching strategy:

- URL ingestion: canonical/original URL
- local-file ingestion: original local file path

Behavior:

- `skip`
  - completes the job without writing a new artifact
  - reuses the existing media item reference
- `replace`
  - performs a fresh run first
  - removes the previous catalog entry and previous library directory after the new run succeeds

This keeps the setting meaningful without changing the app away from its local-first file-ownership model.

## Filesystem layout

Each successful ingestion is stored under the configured library root:

```text
items/<slug>--<short-id>/
```

Subdirectories:

- `source/`
- `audio/`
- `thumbnails/`

Additional sidecar:

- `source-metadata.json`

## Drizzle / Studio note

The frontend reads SQLite through a Tauri-backed Drizzle `sqlite-proxy` bridge.

Drizzle Studio is a separate developer tool and must be pointed at the live runtime database with `SONIVA_DB_PATH`; the runtime DB is not a repository-root SQLite file.
