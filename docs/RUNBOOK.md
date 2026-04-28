# Soniva Runbook

## Goal

This runbook is the shortest reliable path to getting Soniva running locally.

## 1. Install prerequisites

Required:

- Node.js
- npm
- Rust stable toolchain
- Cargo
- OS-specific Tauri prerequisites
- `ffmpeg`
- `yt-dlp` for URL ingestion

## 2. Install project dependencies

```bash
npm install
```

## 3. Launch the desktop app

```bash
npm run tauri:dev
```

## 4. Configure Settings

In **Settings**:

1. choose a **library root**
2. leave `yt-dlp` and `ffmpeg` blank if PATH auto-detection works, or save explicit paths
3. select the overwrite policy:
   - `skip`
   - `replace`
4. save

### Readiness rules

- URL ingestion requires `library_root` + `yt-dlp` + `ffmpeg`
- local-file ingestion requires `library_root` + `ffmpeg`

## 5. Run a local validation

### URL path

Use an authorized source URL.

Expected result:

- job row is created immediately
- metadata probe succeeds
- source media is downloaded
- MP3 is extracted
- item appears in Library

### Local-file path

Select a local media file.

Expected result:

- job row is created immediately
- source file is copied into the managed library
- MP3 is extracted
- item appears in Library

## 6. Validate overwrite policy

### Skip

Re-run the same source with overwrite policy set to `skip`.

Expected result:

- job completes without writing a second artifact
- existing cataloged item is reused

### Replace

Re-run the same source with overwrite policy set to `replace`.

Expected result:

- a fresh run succeeds first
- previous catalog entry and previous library directory are removed after the new run succeeds

## 7. Open Drizzle Studio against the real app database

Soniva stores the live SQLite database outside the repository.

Set `SONIVA_DB_PATH` to the real `soniva.sqlite` path before launching Studio.

PowerShell:

```powershell
$env:SONIVA_DB_PATH = "C:\path\to\soniva.sqlite"
npm run db:studio
```

bash/zsh:

```bash
export SONIVA_DB_PATH="/path/to/soniva.sqlite"
npm run db:studio
```

## 8. Troubleshooting

### Settings says incomplete

Check:

- the library root exists and is writable
- `ffmpeg` is resolvable for both ingestion modes
- `yt-dlp` is resolvable for URL ingestion

### A job fails immediately

Check:

- authorization checkbox is enabled
- the selected local file still exists
- the configured binary path is valid, or PATH auto-detection is working

### Drizzle Studio opens the wrong database

Check:

- `SONIVA_DB_PATH` is pointing to the actual runtime `soniva.sqlite`
- the app has been launched at least once so the database file exists
