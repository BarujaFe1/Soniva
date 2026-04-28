# Soniva File Contents
This file contains the full contents of the created project files for audit and handoff.

## `.gitignore`
```gitignore
node_modules
dist
target
src-tauri/target
.DS_Store
*.db
*.db-shm
*.db-wal
*.log

```

## `LICENSE`
```
MIT License

Copyright (c) 2026 Soniva

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```

## `README.md`
```md
# Soniva

**Tagline:** A refined desktop application for authorized media ingestion, audio extraction, metadata preservation, and local library organization.

Soniva is a desktop-first, local-first application built to ingest **authorized** media, preserve traceable metadata, extract audio with `ffmpeg`, and organize a clean local library with searchable history and repeatable job records.

It is intentionally positioned as a responsible media operations tool for:

- authorized ingestion
- owned media
- public-domain or openly licensed media
- internal archive workflows
- metadata preservation and local organization

It is **not** framed or designed as a piracy utility, universal ripping tool, or suspicious downloader.

---

## Product vision

Soniva demonstrates a pragmatic product-engineering approach:

- desktop-first UX with Tauri
- local-first persistence and filesystem ownership
- polished React + Tailwind interface
- SQLite + Drizzle data model with explicit ingestion traceability
- conservative local integration with `yt-dlp` and `ffmpeg`
- repository quality intended for GitHub, portfolio review, demos, and technical interviews

The V1 keeps the scope narrow and strong: ingest, extract, preserve, organize, search, inspect, and troubleshoot.

---

## V1 features

### Ingestion
- Authorized ingestion from:
  - remote URL via `yt-dlp`
  - local source file copied into the managed library
- Explicit authorization checkbox before a job is allowed to start
- Job creation, progress states, log excerpts, success/failure persistence

### Metadata and traceability
- Structured `media_sources`
- Structured `media_items`
- `extracted_audio_assets`
- `thumbnails`
- `ingestion_jobs`
- `app_settings`
- Persisted source metadata JSON sidecars
- Stable library folder naming and artifact layout

### Audio extraction
- Audio extraction with `ffmpeg`
- MP3 output for V1
- Output persisted inside the managed library
- Clear file path visibility from the UI

### Local library
- Search
- Basic status filters
- Detail inspector
- Thumbnail path visibility
- Audio asset path visibility
- Origin/source trace visibility
- Metadata JSON inspection

### Settings
- Library root configuration
- `yt-dlp` path configuration or auto-detection
- `ffmpeg` path configuration or auto-detection
- Persisted local settings
- Clear validation feedback

### UX
- Refined dark desktop visual language
- Clear IA: Overview / Ingest / Library / Jobs / Settings
- Empty states
- Loading-aware flows
- Respectful error messaging
- Portfolio-friendly screenshots

---

## Stack

- **Desktop shell:** Tauri
- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Persistence:** SQLite
- **ORM / query layer:** Drizzle ORM via `sqlite-proxy`
- **Local media tooling:** `yt-dlp` and `ffmpeg`
- **Core runtime responsibilities:** Rust (filesystem, process execution, DB bootstrap, job pipeline, Tauri commands)

---

## Architecture summary

Soniva intentionally avoids a remote backend and keeps the local system simple:

1. **React frontend**
   - renders the desktop UI
   - invokes Tauri commands
   - reads relational state using Drizzle over a Tauri-backed SQLite proxy

2. **Rust Tauri layer**
   - initializes the SQLite database
   - persists settings
   - spawns ingestion jobs
   - invokes `yt-dlp` and `ffmpeg`
   - writes source metadata sidecars
   - manages filesystem paths and job status updates

3. **SQLite**
   - stores app settings
   - stores ingestion history
   - stores media/source/audio/thumbnail records

4. **Managed local library**
   - stores copied/downloaded source media
   - stores extracted audio
   - stores thumbnails
   - stores source metadata JSON

This architecture stays local-first, terminable, and portfolio-friendly.

---

## Repository structure

```text
soniva/
├── drizzle/
│   ├── 0000_soniva_init.sql
│   └── meta/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DELIVERY_REPORT.md
│   ├── FILE_CONTENTS.md
│   ├── PORTFOLIO_NOTES.md
│   ├── RUNBOOK.md
│   └── VALIDATION_CHECKLIST.md
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   │   └── drizzle/
│   ├── pages/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── types.ts
├── src-tauri/
│   ├── capabilities/
│   ├── src/
│   │   ├── db.rs
│   │   ├── lib.rs
│   │   ├── main.rs
│   │   ├── models.rs
│   │   └── pipeline.rs
│   ├── build.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Screenshots

Prepare a `/screenshots` folder and add images such as:

- `screenshots/overview.png`
- `screenshots/ingest.png`
- `screenshots/library.png`
- `screenshots/jobs.png`
- `screenshots/settings.png`

Suggested README section once screenshots are captured:

```md
## Screenshots

![Overview](./screenshots/overview.png)
![Ingest](./screenshots/ingest.png)
![Library](./screenshots/library.png)
![Jobs](./screenshots/jobs.png)
![Settings](./screenshots/settings.png)
```

---

## Prerequisites

Install these before running the app locally:

1. **Node.js** (recommended current LTS)
2. **Rust toolchain** with `cargo`
3. **Tauri system prerequisites** for your OS
4. **yt-dlp**
5. **ffmpeg**

### macOS / Linux / Windows note
Tauri requires platform-specific system dependencies for building native desktop bundles. Follow the official Tauri prerequisites for your operating system before running `tauri dev` or `tauri build`.

---

## Installing `yt-dlp`

You can install `yt-dlp` in any of these ways:

- system package manager
- official standalone binary
- Python package installation

After installation, confirm it resolves:

```bash
yt-dlp --version
```

If it is not on your global `PATH`, save the explicit binary path inside **Settings**.

---

## Installing `ffmpeg`

Install `ffmpeg` using your preferred package manager or official distribution, then confirm:

```bash
ffmpeg -version
```

If it is not globally available, save the explicit binary path inside **Settings**.

---

## Local setup

### 1) Clone and enter the repository

```bash
git clone <your-repo-url> soniva
cd soniva
```

### 2) Install frontend dependencies

```bash
npm install
```

### 3) Run type checking

```bash
npm run typecheck
```

### 4) Start the desktop app in development mode

```bash
npm run tauri:dev
```

This runs the Vite frontend plus the Tauri desktop shell.

---

## Database initialization and migrations

The database is created automatically by the Rust Tauri layer on first launch.

Current migration assets live in:

- `drizzle/0000_soniva_init.sql`
- `drizzle/meta/*`

### Generating new migrations later

```bash
npm run db:generate
```

### Opening Drizzle Studio later

```bash
npm run db:studio
```

For V1, the initial database bootstrap is already handled by the application startup path.

---

## First-run workflow

1. Open **Settings**
2. Set the **Library root**
3. Confirm or save paths for:
   - `yt-dlp`
   - `ffmpeg`
4. Go to **Ingest**
5. Choose either:
   - an authorized URL
   - a local source file path
6. Confirm the authorization checkbox
7. Start the job
8. Watch status updates in **Jobs**
9. Inspect the resulting item in **Library**

---

## Managed library layout

Example layout:

```text
<library-root>/
└── items/
    └── my-source-title--1a2b3c4d/
        ├── source/
        │   ├── source.mp4
        │   └── source.info.json
        ├── audio/
        │   └── track.mp3
        ├── thumbnails/
        │   └── source.jpg
        └── source-metadata.json
```

This layout favors:
- artifact traceability
- stable demoability
- local inspection
- debugging clarity

---

## Main usage flows

### Authorized URL ingestion
- Soniva probes the remote source using `yt-dlp`
- metadata is persisted
- the source media is downloaded into the managed library
- thumbnails are collected when available
- audio is extracted with `ffmpeg`
- records are stored in SQLite
- the library view becomes searchable immediately after completion

### Local file ingestion
- Soniva copies the local source file into the managed library
- creates a sidecar metadata record
- extracts MP3 audio with `ffmpeg`
- persists the job and library records

---

## Troubleshooting

### `yt-dlp` not found
- install `yt-dlp`
- verify with `yt-dlp --version`
- save the explicit path in **Settings**

### `ffmpeg` not found
- install `ffmpeg`
- verify with `ffmpeg -version`
- save the explicit path in **Settings**

### Job fails immediately
- confirm the authorization checkbox was enabled
- confirm the source URL/file is valid
- confirm the configured library root is writable
- inspect the job log excerpt in **Jobs**

### Desktop build fails
- confirm Rust and Cargo are installed
- confirm OS-specific Tauri prerequisites are installed
- re-run:
  ```bash
  npm install
  npm run tauri:dev
  ```

### Audio file not produced
- confirm the source media was copied/downloaded
- verify the source codec is readable by `ffmpeg`
- inspect the failure message and log excerpt in **Jobs**

---

## Scripts

```bash
npm run dev          # Vite frontend only
npm run build        # Frontend build + TypeScript compile
npm run preview      # Preview built frontend
npm run typecheck    # TypeScript validation
npm run tauri:dev    # Desktop app in development
npm run tauri:build  # Native desktop production bundle
npm run db:generate  # Generate Drizzle migration files
npm run db:studio    # Open Drizzle Studio
```

---

## Scope notes

### Included in V1
- local-first desktop app
- polished React/Tauri UI
- SQLite + Drizzle data model
- URL ingestion via `yt-dlp`
- local-file ingestion
- audio extraction via `ffmpeg`
- job history
- searchable library
- persisted settings
- structured documentation

### Intentionally excluded from V1
- accounts and authentication
- remote backend
- cloud sync
- collaboration
- streaming
- advanced audio editing
- plugin system
- analytics-heavy dashboards
- ML features
- enterprise complexity

---

## Portfolio framing

Soniva is intentionally useful as a portfolio artifact because it demonstrates:

- scope control
- product thinking
- clean UX
- local systems integration
- metadata modeling
- reliable job orchestration
- responsible product framing
- repository quality and docs discipline

Use the notes in `docs/PORTFOLIO_NOTES.md` when presenting the project publicly.

---

## License

MIT — see [`LICENSE`](./LICENSE).

```

## `docs/ARCHITECTURE.md`
```md
# Soniva Architecture

## Architectural goals

Soniva optimizes for:

- local-first execution
- low operational complexity
- reliable desktop UX
- clean metadata traceability
- demonstrable product maturity
- realistic V1 scope protection

## Why this architecture

A remote backend is unnecessary for V1. The strongest version of this product is a native desktop application that owns:

- local settings
- local database
- local library filesystem
- process execution for `yt-dlp` and `ffmpeg`

That keeps the project executable, understandable, and portfolio-ready.

---

## Runtime topology

### Frontend
React + TypeScript + Tailwind render the desktop UI.

Responsibilities:
- page-level UX
- data presentation
- settings forms
- ingestion submission
- library inspection
- job visibility

### Desktop/native layer
Rust + Tauri handle privileged local operations.

Responsibilities:
- app-data resolution
- SQLite bootstrap
- settings persistence
- command execution
- filesystem orchestration
- background ingestion threading
- error propagation

### Data layer
SQLite stores:
- app settings
- ingestion jobs
- media sources
- media items
- extracted audio assets
- thumbnails

Drizzle is used in the frontend through a Tauri-backed SQLite proxy, which keeps query code readable without adding a network backend.

---

## Data model

### `app_settings`
Key-value local configuration for:
- library root
- `yt-dlp` path
- `ffmpeg` path
- audio format
- overwrite policy

### `ingestion_jobs`
Operational timeline for each ingestion attempt:
- source kind
- input value
- status
- stage
- progress
- output directory
- log excerpt
- error message
- timestamps

### `media_sources`
Source traceability:
- original value
- canonical URL
- extractor key
- source domain
- uploader
- source metadata JSON

### `media_items`
Catalog entity:
- normalized title
- slug
- library directory
- source path
- status
- duration
- size
- structured metadata JSON

### `extracted_audio_assets`
Audio artifact metadata:
- output path
- format
- codec
- size
- timestamps

### `thumbnails`
Optional thumbnail persistence:
- local path
- remote URL slot
- timestamps

---

## Filesystem conventions

Each item is stored beneath the configured library root:

```text
items/<slug>--<short-id>/
```

Subdirectories:
- `source/`
- `audio/`
- `thumbnails/`

Plus:
- `source-metadata.json`

This convention keeps debugging and demos straightforward.

---

## Job pipeline design

The pipeline is intentionally conservative.

### URL ingestion
1. validate settings
2. resolve binaries
3. probe source metadata with `yt-dlp`
4. allocate managed library directory
5. persist source metadata JSON
6. download source media + thumbnail via `yt-dlp`
7. extract MP3 via `ffmpeg`
8. persist relational records
9. complete job or persist failure

### Local file ingestion
1. validate settings
2. validate local path
3. copy file into managed library
4. create sidecar metadata JSON
5. extract MP3 via `ffmpeg`
6. persist relational records
7. complete job or persist failure

---

## Trade-offs

### Chosen
- Tauri over Electron
- local SQLite over remote DB
- direct process execution over background service
- single desktop app over multi-process distributed architecture
- MP3-only extraction in V1 for scope control

### Deferred
- waveform previews
- advanced metadata enrichment
- retry orchestration
- batch ingestion
- tagging/collections
- tests that depend on actual media binaries in CI

---

## Why Drizzle through `sqlite-proxy`

This keeps the frontend query layer pleasant while still letting Rust remain the single authority over the native SQLite file.

It avoids:
- inventing a backend
- duplicating domain types across a fake API
- overcomplicating the local-first design

---

## Error philosophy

Soniva should not hide central failures.

The app preserves:
- explicit job status
- stage labels
- log excerpts
- failure message
- partial output directory visibility when available

That makes the project more honest and more useful in real debugging scenarios.

```

## `docs/PORTFOLIO_NOTES.md`
```md
# Soniva Portfolio Notes

## What this project communicates well

Soniva is strongest as a portfolio piece when positioned as a disciplined local-first desktop product rather than as a media downloader.

### Core themes to emphasize
- responsible product framing
- scope discipline
- elegant desktop UX
- realistic local systems integration
- metadata modeling
- filesystem and artifact management
- executable documentation

## Interview framing

A concise professional framing:

> Soniva is a desktop-first, local-first media operations tool for authorized ingestion, audio extraction, metadata preservation, and structured local library management. I built it to show product discipline, thoughtful scope control, desktop systems integration, and a polished UX without inventing unnecessary backend infrastructure.

## Engineering highlights
- Tauri shell with a minimal Rust core
- React + TypeScript + Tailwind for a refined desktop UI
- SQLite + Drizzle for local persistence and readable data modeling
- real process integration with `yt-dlp` and `ffmpeg`
- explicit job/status/error handling
- coherent library layout and traceability

## Product highlights
- clear user positioning
- non-suspicious copy
- local-first trust model
- clean information architecture
- detail views that support inspection and troubleshooting
- portfolio-friendly visual hierarchy

## What not to say
Avoid presenting Soniva as:
- a downloader for anything on the internet
- a ripping tool
- a bypass tool
- a universal media grabber

## What to say instead
Prefer:
- authorized ingestion
- owned or licensed media workflows
- archive preparation
- metadata preservation
- local library organization
- desktop operational tooling

## Best demo sequence
1. open Overview
2. open Settings and show binary/library configuration
3. start an authorized job
4. watch Jobs update live
5. open Library and inspect the resulting item
6. show the managed filesystem layout

## Resume bullet example
- Built **Soniva**, a desktop-first local media operations app with **Tauri, React, TypeScript, SQLite, Drizzle, yt-dlp, and ffmpeg**, featuring authorized ingestion, audio extraction, metadata preservation, job tracking, and searchable local library management.

## LinkedIn / GitHub description example
- Soniva is a polished local-first desktop application for authorized media ingestion, audio extraction, metadata preservation, and structured local library organization.

```

## `docs/RUNBOOK.md`
```md
# Soniva Runbook

## Goal

This runbook is written for someone who wants to get Soniva running locally with the highest chance of success.

## Execution order

1. Install system prerequisites
2. Install app dependencies
3. Confirm `yt-dlp` and `ffmpeg`
4. Launch the desktop app
5. Configure settings
6. Run an authorized ingestion test
7. Validate filesystem output and persisted data

---

## 1. Install prerequisites

### Required
- Node.js (current LTS recommended)
- Rust stable toolchain
- Cargo
- OS-specific Tauri build prerequisites
- `yt-dlp`
- `ffmpeg`

### Verify
```bash
node -v
npm -v
rustc -V
cargo -V
yt-dlp --version
ffmpeg -version
```

If any of those commands fail, fix that before moving on.

---

## 2. Install app dependencies

```bash
npm install
```

---

## 3. Start the app

```bash
npm run tauri:dev
```

The desktop window should open after the frontend and native shell initialize.

---

## 4. Configure Settings

Open **Settings** and populate:

- **Library root** → required
- **yt-dlp path** → optional if globally detected
- **ffmpeg path** → optional if globally detected
- **Audio format** → fixed to MP3 in V1
- **Overwrite policy** → `skip` or `replace`

Use a writable library root such as:

- macOS/Linux:
  ```text
  /Users/<you>/Media/SonivaLibrary
  ```
- Windows:
  ```text
  C:\Users\<you>\Media\SonivaLibrary
  ```

Save the settings and confirm the success message.

---

## 5. Run an authorized URL test

Use a URL that you have the right to ingest.

Example categories:
- your own uploaded media
- public-domain media
- openly licensed media
- organization-approved test assets

In **Ingest**:

1. choose **URL**
2. paste the URL
3. enable the authorization checkbox
4. submit the job

Then watch **Jobs**.

Expected job progression:
- Queued
- Initializing
- Resolving source metadata
- Downloading authorized source media
- Extracting audio asset
- Completed

---

## 6. Run a local file test

In **Ingest**:

1. choose **Local file**
2. paste an absolute path to a local media file
3. enable the authorization checkbox
4. submit

Expected behavior:
- file copied into managed library
- MP3 extracted into `audio/`
- record appears in **Library**

---

## 7. Validate filesystem output

Inside the configured library root you should see:

```text
items/<slug>--<job-short-id>/
```

Expected contents:
- `source/`
- `audio/`
- `thumbnails/` when available
- `source-metadata.json`

Validate:
- source media exists
- extracted `track.mp3` exists
- metadata sidecar exists

---

## 8. Validate persisted data

The database is created inside the Tauri app-data directory.

What to validate:
- settings persist across restarts
- job history remains visible
- completed items remain visible in Library
- detail view opens without error

You can also inspect tables manually with Drizzle Studio later:

```bash
npm run db:studio
```

---

## 9. Common failure handling

### Missing `yt-dlp`
Set the explicit binary path in **Settings**.

### Missing `ffmpeg`
Set the explicit binary path in **Settings**.

### Library root not writable
Choose another location and save Settings again.

### URL ingestion fails
Check:
- the URL is valid
- you are authorized to process it
- `yt-dlp` can resolve it locally from your machine

### Local file ingestion fails
Check:
- the path exists
- the file is readable
- `ffmpeg` can decode the source

### App launches but no library data appears
Check:
- the ingestion job actually completed
- the database is writable
- the selected filter is not hiding the item

---

## 10. Build for distribution

After local validation:

```bash
npm run tauri:build
```

This generates a native desktop bundle using your OS-specific Tauri toolchain.

```

## `docs/VALIDATION_CHECKLIST.md`
```md
# Soniva Validation Checklist

## Structure
- [x] coherent repository layout
- [x] clear frontend / native / docs separation
- [x] explicit migration file present
- [x] no remote backend introduced

## Data model
- [x] `app_settings`
- [x] `ingestion_jobs`
- [x] `media_sources`
- [x] `media_items`
- [x] `extracted_audio_assets`
- [x] `thumbnails`

## UI
- [x] overview page
- [x] ingest page
- [x] jobs page
- [x] library page
- [x] settings page
- [x] empty states
- [x] progress components
- [x] refined visual system

## Pipeline
- [x] URL ingestion path
- [x] local file ingestion path
- [x] `yt-dlp` probing
- [x] `yt-dlp` download
- [x] `ffmpeg` extraction
- [x] job failure persistence
- [x] job success persistence
- [x] metadata sidecar persistence

## Docs
- [x] README
- [x] runbook
- [x] architecture notes
- [x] portfolio framing
- [x] delivery report
- [x] file contents dump

## Intentional limitations
- [x] no remote backend
- [x] no auth
- [x] no cloud sync
- [x] no streaming
- [x] no advanced audio editor
- [x] no plugin system

## Environment caveat
- [ ] native compilation verified in container
- [ ] `tauri dev` executed in container
- [ ] real end-to-end ingestion executed in container

The unchecked items above depend on Rust/Cargo and native Tauri prerequisites that were not installed in the delivery container. The repository is structured for local execution, but native compilation must be completed on a machine with the documented prerequisites installed.

```

## `drizzle/0000_soniva_init.sql`
```sql
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

```

## `drizzle/meta/0000_snapshot.json`
```json
{
  "version": "7",
  "dialect": "sqlite",
  "id": "soniva-initial-snapshot",
  "prevId": "",
  "tables": {}
}

```

## `drizzle/meta/_journal.json`
```json
{
  "version": "7",
  "dialect": "sqlite",
  "entries": [
    {
      "idx": 0,
      "version": "7",
      "when": 1775770800000,
      "tag": "0000_soniva_init",
      "breakpoints": true
    }
  ]
}

```

## `drizzle.config.ts`
```ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/drizzle/schema.ts",
  out: "./drizzle",
  strict: true,
  verbose: true
});

```

## `index.html`
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Soniva</title>
  </head>
  <body class="bg-ink-950">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>

```

## `package.json`
```json
{
  "name": "soniva",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "description": "A refined desktop application for authorized media ingestion, audio extraction, metadata preservation, and local library organization.",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build",
    "db:generate": "drizzle-kit generate:sqlite",
    "db:studio": "drizzle-kit studio",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-dialog": "^2.0.0",
    "clsx": "^2.1.1",
    "drizzle-orm": "^0.39.0",
    "lucide-react": "^0.469.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2.0.0",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.30.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.7.2",
    "vite": "^6.0.5"
  }
}

```

## `postcss.config.cjs`
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

```

## `src/App.tsx`
```tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { listJobs, readSettingsMap, countDashboardMetrics } from "./lib/repositories";
import { bootstrapApp, listLibraryItems } from "./lib/tauri";
import { usePolling } from "./hooks/usePolling";
import { IngestPage } from "./pages/IngestPage";
import { JobsPage } from "./pages/JobsPage";
import { LibraryPage } from "./pages/LibraryPage";
import { OverviewPage } from "./pages/OverviewPage";
import { SettingsPage } from "./pages/SettingsPage";
import type { AppPage, BootstrapResponse, DashboardMetrics, IngestionJobRecord, LibraryFilter, LibraryListItem, SettingsPayload } from "./types";

const defaultSettings: SettingsPayload = {
  libraryRoot: "",
  ytDlpPath: "",
  ffmpegPath: "",
  audioFormat: "mp3",
  overwritePolicy: "skip"
};

export default function App() {
  const [page, setPage] = useState<AppPage>("overview");
  const [bootstrap, setBootstrap] = useState<BootstrapResponse | null>(null);
  const [jobs, setJobs] = useState<IngestionJobRecord[]>([]);
  const [library, setLibrary] = useState<LibraryListItem[]>([]);
  const [settings, setSettings] = useState<SettingsPayload>(defaultSettings);
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("all");
  const [metrics, setMetrics] = useState<DashboardMetrics>({ totalItems: 0, totalJobs: 0, completedJobs: 0, failedJobs: 0 });

  const refreshBootstrap = useCallback(async () => {
    setBootstrap(await bootstrapApp());
  }, []);

  const refreshSettings = useCallback(async () => {
    const map = await readSettingsMap();
    setSettings({
      libraryRoot: map.library_root ?? "",
      ytDlpPath: map.yt_dlp_path ?? "",
      ffmpegPath: map.ffmpeg_path ?? "",
      audioFormat: (map.audio_format as "mp3") ?? "mp3",
      overwritePolicy: (map.overwrite_policy as "skip" | "replace") ?? "skip"
    });
  }, []);

  const refreshJobs = useCallback(async () => {
    setJobs((await listJobs()) as IngestionJobRecord[]);
  }, []);

  const refreshLibrary = useCallback(async () => {
    setLibrary(await listLibraryItems(libraryQuery, libraryFilter));
  }, [libraryFilter, libraryQuery]);

  const refreshMetrics = useCallback(async () => {
    setMetrics(await countDashboardMetrics());
  }, []);

  const fullRefresh = useCallback(async () => {
    await Promise.all([refreshBootstrap(), refreshSettings(), refreshJobs(), refreshLibrary(), refreshMetrics()]);
  }, [refreshBootstrap, refreshSettings, refreshJobs, refreshLibrary, refreshMetrics]);

  useEffect(() => {
    void fullRefresh();
  }, [fullRefresh]);

  usePolling(() => Promise.all([refreshJobs(), refreshLibrary(), refreshMetrics()]).then(() => undefined), 3500, true);

  const latestJob = useMemo(() => jobs[0] ?? null, [jobs]);

  return (
    <AppShell sidebar={<Sidebar page={page} onPageChange={setPage} bootstrap={bootstrap} />} topbar={<Topbar bootstrap={bootstrap} />}>
      {page === "overview" ? <OverviewPage bootstrap={bootstrap} metrics={metrics} jobs={jobs} library={library} /> : null}
      {page === "ingest" ? <IngestPage bootstrap={bootstrap} onSubmitted={fullRefresh} latestJob={latestJob} /> : null}
      {page === "library" ? <LibraryPage items={library} query={libraryQuery} setQuery={setLibraryQuery} filter={libraryFilter} setFilter={setLibraryFilter} /> : null}
      {page === "jobs" ? <JobsPage jobs={jobs} onRefresh={fullRefresh} /> : null}
      {page === "settings" ? <SettingsPage initial={settings} onSaved={fullRefresh} /> : null}
    </AppShell>
  );
}

```

## `src/components/Sidebar.tsx`
```tsx
import { AudioLines, House, LibraryBig, ListChecks, Settings } from "lucide-react";
import type { AppPage, BootstrapResponse } from "../types";
import { cn } from "../lib/utils";

const nav = [
  { id: "overview", label: "Overview", icon: House },
  { id: "ingest", label: "Authorized ingest", icon: AudioLines },
  { id: "library", label: "Library", icon: LibraryBig },
  { id: "jobs", label: "Jobs", icon: ListChecks },
  { id: "settings", label: "Settings", icon: Settings }
] as const;

export function Sidebar({
  page,
  onPageChange,
  bootstrap
}: {
  page: AppPage;
  onPageChange: (page: AppPage) => void;
  bootstrap: BootstrapResponse | null;
}) {
  return (
    <div className="flex h-full flex-col gap-8">
      <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-white/8 to-white/[0.02] p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-accent-500/20 text-accent-300">
            <AudioLines className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Soniva</h1>
            <p className="text-sm text-mist-400">Authorized media ingestion, locally.</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-mist-300">
          Designed for public-domain, licensed, or otherwise permitted sources. Every artifact
          stays on the machine you control.
        </p>
      </div>

      <nav className="space-y-2">
        {nav.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
              page === id
                ? "bg-white/[0.08] text-white"
                : "text-mist-300 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/8 bg-white/[0.03] p-4 text-sm text-mist-300">
        <p className="font-medium text-mist-100">Workspace</p>
        <p className="mt-2 break-all text-xs leading-5 text-mist-400">
          DB: {bootstrap?.databasePath ?? "Waiting for bootstrap…"}
        </p>
      </div>
    </div>
  );
}

```

## `src/components/Topbar.tsx`
```tsx
import { FolderRoot, ShieldCheck, Sparkles } from "lucide-react";
import type { BootstrapResponse } from "../types";
import { Badge } from "./ui/Badge";

export function Topbar({ bootstrap }: { bootstrap: BootstrapResponse | null }) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Badge tone="accent">Desktop-first</Badge>
          <Badge tone="success">Local-first</Badge>
          <Badge tone="neutral">Authorized use only</Badge>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-gradient">
          A composed ingestion workflow for local media libraries.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-mist-300">
          Configure a root directory, validate yt-dlp and ffmpeg, run ingestion jobs, and keep
          metadata, thumbnails, source traces, and extracted audio assets in one coherent local
          catalog.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-mist-400">
            <FolderRoot className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">Library root</span>
          </div>
          <p className="text-sm font-medium text-mist-50">
            {bootstrap?.libraryRoot || "Not configured yet"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-mist-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">yt-dlp</span>
          </div>
          <p className="text-sm font-medium text-mist-50">
            {bootstrap?.detectedYtDlpPath || "Resolve in settings"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-mist-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">ffmpeg</span>
          </div>
          <p className="text-sm font-medium text-mist-50">
            {bootstrap?.detectedFfmpegPath || "Resolve in settings"}
          </p>
        </div>
      </div>
    </div>
  );
}

```

## `src/components/layout/AppShell.tsx`
```tsx
import type { PropsWithChildren, ReactNode } from "react";

export function AppShell({
  sidebar,
  topbar,
  children
}: PropsWithChildren<{ sidebar: ReactNode; topbar: ReactNode }>) {
  return (
    <div className="min-h-screen bg-hero-glow text-mist-50">
      <div className="mx-auto grid min-h-screen max-w-[1680px] grid-cols-1 gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
        <aside className="panel hidden lg:block lg:p-4">{sidebar}</aside>
        <main className="flex min-h-[calc(100vh-2rem)] flex-col gap-6">
          <header className="panel px-6 py-5">{topbar}</header>
          <div className="grid flex-1 gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

```

## `src/components/ui/Badge.tsx`
```tsx
import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

export function Badge({
  children,
  tone = "neutral"
}: PropsWithChildren<{ tone?: "neutral" | "success" | "warning" | "danger" | "accent" }>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tone === "neutral" && "bg-white/8 text-mist-200",
        tone === "success" && "bg-mint-400/15 text-mint-400",
        tone === "warning" && "bg-amber-400/15 text-amber-300",
        tone === "danger" && "bg-rose-400/15 text-rose-300",
        tone === "accent" && "bg-accent-400/15 text-accent-300"
      )}
    >
      {children}
    </span>
  );
}

```

## `src/components/ui/Button.tsx`
```tsx
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
  }
>;

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-accent-400/50 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-accent-500 text-white shadow-soft hover:bg-accent-400",
        variant === "secondary" &&
          "border border-white/10 bg-white/6 text-mist-50 hover:bg-white/10",
        variant === "ghost" &&
          "text-mist-200 hover:bg-white/6",
        variant === "danger" &&
          "bg-rose-400/20 text-rose-200 hover:bg-rose-400/30",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

```

## `src/components/ui/Card.tsx`
```tsx
import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

export function Card({
  children,
  className
}: PropsWithChildren<{ className?: string }>) {
  return <section className={cn("panel p-6", className)}>{children}</section>;
}

```

## `src/components/ui/EmptyState.tsx`
```tsx
import type { PropsWithChildren } from "react";

export function EmptyState({
  eyebrow,
  title,
  description,
  children
}: PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>) {
  return (
    <div className="panel-muted flex min-h-56 flex-col items-start justify-center gap-4 p-8">
      <span className="rounded-full bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-mist-400">
        {eyebrow}
      </span>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-mist-50">{title}</h3>
        <p className="max-w-2xl text-sm leading-6 text-mist-300">{description}</p>
      </div>
      {children}
    </div>
  );
}

```

## `src/components/ui/Input.tsx`
```tsx
import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-mist-50 outline-none transition placeholder:text-mist-500 focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20",
        className
      )}
      {...props}
    />
  );
}

```

## `src/components/ui/ProgressBar.tsx`
```tsx
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-400 to-sky-400 transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

```

## `src/components/ui/Select.tsx`
```tsx
import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-2xl border border-white/10 bg-ink-800 px-4 py-3 text-sm text-mist-50 outline-none transition focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20",
        className
      )}
      {...props}
    />
  );
}

```

## `src/components/ui/StatCard.tsx`
```tsx
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  hint
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  hint: string;
}) {
  return (
    <div className="panel-muted flex min-h-36 flex-col justify-between p-5">
      <div className="flex items-center justify-between text-mist-300">
        <span className="text-sm">{label}</span>
        <span className="rounded-2xl border border-white/8 bg-white/[0.03] p-2 text-mist-200">
          {icon}
        </span>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-semibold tracking-tight text-mist-50">{value}</p>
        <p className="text-sm text-mist-400">{hint}</p>
      </div>
    </div>
  );
}

```

## `src/hooks/usePolling.ts`
```ts
import { useEffect, useRef } from "react";

export function usePolling(callback: () => void | Promise<void>, intervalMs: number, enabled = true) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;
      await saved.current();
    };

    void tick();
    const timer = window.setInterval(() => {
      void tick();
    }, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [enabled, intervalMs]);
}

```

## `src/lib/drizzle/client.ts`
```ts
import { drizzle } from "drizzle-orm/sqlite-proxy";
import { invoke } from "@tauri-apps/api/core";
import * as schema from "./schema";

type SqlMethod = "run" | "all" | "get" | "values";

type SqlResponse = {
  rows: unknown[] | unknown[][];
};

export const db = drizzle(
  async (sql: string, params: unknown[], method: SqlMethod) => {
    const response = await invoke<SqlResponse>("execute_sql", {
      payload: { sql, params, method }
    });
    return response;
  },
  { schema }
);

```

## `src/lib/drizzle/schema.ts`
```ts
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

```

## `src/lib/repositories.ts`
```ts
import { asc, desc } from "drizzle-orm";
import { db } from "./drizzle/client";
import { appSettings, ingestionJobs, mediaItems } from "./drizzle/schema";

export async function readSettingsMap() {
  const records = await db.select().from(appSettings).orderBy(asc(appSettings.key));
  return Object.fromEntries(records.map((record) => [record.key, record.value]));
}

export async function listJobs(limit = 24) {
  return db.select().from(ingestionJobs).orderBy(desc(ingestionJobs.createdAt)).limit(limit);
}

export async function countDashboardMetrics() {
  const items = await db.select().from(mediaItems);
  const jobs = await db.select().from(ingestionJobs);

  return {
    totalItems: items.length,
    totalJobs: jobs.length,
    completedJobs: jobs.filter((job) => job.status === "completed").length,
    failedJobs: jobs.filter((job) => job.status === "failed").length
  };
}

```

## `src/lib/tauri.ts`
```ts
import { invoke } from "@tauri-apps/api/core";
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

export async function bootstrapApp() {
  return invoke<BootstrapResponse>("bootstrap_app");
}

export async function detectBinary(binaryName: "yt-dlp" | "ffmpeg", preferredPath?: string) {
  return invoke<BinaryProbe>("detect_binary", { binaryName, preferredPath });
}

export async function saveSettings(payload: SettingsPayload) {
  return invoke<SaveSettingsResponse>("save_settings", { payload });
}

export async function startIngestionJob(payload: IngestionRequest) {
  return invoke<{ jobId: string }>("start_ingestion_job", { payload });
}

export async function listLibraryItems(query: string, filter: LibraryFilter) {
  return invoke<LibraryListItem[]>("list_library_items", { query, filter });
}

export async function getMediaItemDetail(mediaItemId: string) {
  return invoke<MediaItemDetail>("get_media_item_detail", { mediaItemId });
}

export async function getJobDetail(jobId: string) {
  return invoke<JobDetailResponse>("get_job_detail", { jobId });
}

```

## `src/lib/utils.ts`
```ts
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatBytes(value?: number | null) {
  if (!value || Number.isNaN(value)) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

export function formatDuration(value?: number | null) {
  if (!value && value !== 0) return "—";
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const seconds = value % 60;
  if (hours > 0) {
    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function relativeTime(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value).getTime();
  const diffMinutes = Math.round((date - Date.now()) / 60_000);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const hours = Math.round(diffMinutes / 60);
  const days = Math.round(hours / 24);
  if (Math.abs(diffMinutes) < 60) return formatter.format(diffMinutes, "minute");
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  return formatter.format(days, "day");
}

export function prettyJson(input?: string | null) {
  if (!input) return "No structured metadata stored yet.";
  try {
    return JSON.stringify(JSON.parse(input), null, 2);
  } catch {
    return input;
  }
}

```

## `src/main.tsx`
```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

## `src/pages/IngestPage.tsx`
```tsx
import { open } from "@tauri-apps/plugin-dialog";
import { AlertTriangle, CheckCircle2, FileAudio2, Link2, Loader2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import type { BootstrapResponse, IngestionRequest, IngestionJobRecord } from "../types";
import { startIngestionJob } from "../lib/tauri";

export function IngestPage({
  bootstrap,
  onSubmitted,
  latestJob
}: {
  bootstrap: BootstrapResponse | null;
  onSubmitted: () => Promise<void>;
  latestJob: IngestionJobRecord | null;
}) {
  const [sourceKind, setSourceKind] = useState<IngestionRequest["sourceKind"]>("url");
  const [inputValue, setInputValue] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const binariesReady = useMemo(
    () => Boolean(bootstrap?.libraryRoot && bootstrap?.detectedYtDlpPath && bootstrap?.detectedFfmpegPath),
    [bootstrap]
  );

  async function handleBrowseFile() {
    const selected = await open({
      directory: false,
      multiple: false,
      filters: [{ name: "Media", extensions: ["mp4", "mov", "mkv", "webm", "mp3", "wav", "m4a", "aac", "flac", "ogg"] }]
    });

    if (typeof selected === "string") {
      setInputValue(selected);
      setSourceKind("local_file");
    }
  }

  async function handleSubmit() {
    setFeedback(null);
    if (!inputValue.trim()) return setFeedback("Provide a URL or choose a local media file.");
    if (!authorized) return setFeedback("Confirm authorized usage before creating a job.");
    if (!binariesReady) return setFeedback("Resolve the library root, yt-dlp, and ffmpeg in Settings first.");

    try {
      setLoading(true);
      await startIngestionJob({ sourceKind, inputValue: inputValue.trim(), authorized });
      setInputValue("");
      setAuthorized(false);
      setFeedback("Job queued successfully. The Jobs and Library views will refresh automatically.");
      await onSubmitted();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to queue the job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-mist-400">Primary workflow</p>
            <h3 className="text-2xl font-semibold text-mist-50">Create an authorized ingestion job</h3>
          </div>
          <Badge tone={binariesReady ? "success" : "warning"}>{binariesReady ? "Environment ready" : "Setup required"}</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className={`rounded-3xl border p-4 text-left transition ${sourceKind === "url" ? "border-accent-400/40 bg-accent-500/10" : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"}`} onClick={() => setSourceKind("url")}>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]"><Link2 className="h-5 w-5" /></div>
            <h4 className="font-medium text-mist-100">Authorized URL</h4>
            <p className="mt-2 text-sm leading-6 text-mist-400">Collect metadata with yt-dlp, preserve sidecar files, and extract a local audio asset.</p>
          </button>
          <button className={`rounded-3xl border p-4 text-left transition ${sourceKind === "local_file" ? "border-accent-400/40 bg-accent-500/10" : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"}`} onClick={() => setSourceKind("local_file")}>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]"><FileAudio2 className="h-5 w-5" /></div>
            <h4 className="font-medium text-mist-100">Local source file</h4>
            <p className="mt-2 text-sm leading-6 text-mist-400">Copy an existing local asset into the managed library and extract audio in the same pipeline.</p>
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">{sourceKind === "url" ? "Source URL" : "Local media file"}</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input placeholder={sourceKind === "url" ? "https://example.com/authorized-source" : "/Users/you/media/example.mov"} value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            {sourceKind === "local_file" ? <Button variant="secondary" onClick={() => void handleBrowseFile()}>Browse file</Button> : null}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-white/8 bg-white/[0.02] p-4">
          <input className="mt-1 h-4 w-4 rounded border-white/10 bg-transparent accent-accent-500" type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-mist-100"><ShieldCheck className="h-4 w-4 text-mint-400" />I confirm that this source is authorized for local ingestion.</div>
            <p className="text-sm leading-6 text-mist-400">Use this project only with your own media, public-domain material, freely licensed work, or other sources you are permitted to preserve locally.</p>
          </div>
        </label>

        {feedback ? <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-mist-200">{feedback}</div> : null}

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-mist-400">Soniva creates a persisted job immediately and updates status as the local pipeline progresses.</p>
          <Button onClick={() => void handleSubmit()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Queue job
          </Button>
        </div>
      </Card>

      <div className="grid gap-6">
        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">What the pipeline does</p>
            <h3 className="text-xl font-semibold text-mist-50">Conservative local stages</h3>
          </div>
          <ol className="space-y-3 text-sm text-mist-300">
            <li>1. Validate required tools and the managed library root.</li>
            <li>2. Persist a job row before any long-running work begins.</li>
            <li>3. Collect structured metadata and sidecar files.</li>
            <li>4. Organize the source asset in a predictable item directory.</li>
            <li>5. Extract a local MP3 with ffmpeg and persist the resulting path.</li>
          </ol>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Most recent submission</p>
            <h3 className="text-xl font-semibold text-mist-50">Latest visible job</h3>
          </div>
          {!latestJob ? (
            <EmptyState eyebrow="No submission yet" title="Queue the first job to populate this panel." description="This view updates automatically once a job is queued and can be used during demos to show that the app persists execution history immediately." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-mist-100">{latestJob.inputValue}</p>
                  <Badge tone={latestJob.status === "completed" ? "success" : latestJob.status === "failed" ? "danger" : "accent"}>{latestJob.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-mist-300">Stage: {latestJob.stage}</p>
              </div>
              {latestJob.errorMessage ? (
                <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
                  <div className="mb-2 flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4" />Execution error</div>
                  <p className="leading-6">{latestJob.errorMessage}</p>
                </div>
              ) : (
                <div className="rounded-3xl border border-mint-400/20 bg-mint-400/10 p-4 text-sm text-mint-100">
                  <div className="mb-2 flex items-center gap-2 font-medium"><CheckCircle2 className="h-4 w-4" />Good demo behavior</div>
                  <p className="leading-6">Every new run writes a job row first, which makes the product feel responsive even when yt-dlp or ffmpeg still have work to do.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

```

## `src/pages/JobsPage.tsx`
```tsx
import { useMemo, useState } from "react";
import { FileWarning, RefreshCcw } from "lucide-react";
import type { IngestionJobRecord, JobDetailResponse } from "../types";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ProgressBar } from "../components/ui/ProgressBar";
import { formatDateTime, prettyJson } from "../lib/utils";
import { getJobDetail } from "../lib/tauri";

export function JobsPage({ jobs, onRefresh }: { jobs: IngestionJobRecord[]; onRefresh: () => Promise<void> }) {
  const [selected, setSelected] = useState<JobDetailResponse | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const latestFailed = useMemo(() => jobs.find((job) => job.status === "failed") ?? null, [jobs]);

  async function handleSelect(job: IngestionJobRecord) {
    setLoadingId(job.id);
    try {
      setSelected(await getJobDetail(job.id));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-mist-400">Persistent history</p>
            <h3 className="text-2xl font-semibold text-mist-50">Ingestion jobs</h3>
          </div>
          <Button variant="secondary" onClick={() => void onRefresh()}><RefreshCcw className="h-4 w-4" />Refresh</Button>
        </div>
        {jobs.length === 0 ? (
          <EmptyState eyebrow="No jobs" title="There is no execution history yet." description="Once a job is created, this view will show stage transitions, progress, errors, and any linked media item." />
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <button key={job.id} className="w-full rounded-3xl border border-white/8 bg-white/[0.02] p-4 text-left transition hover:bg-white/[0.04]" onClick={() => void handleSelect(job)}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-mist-100">{job.inputValue}</p>
                      <Badge tone={job.status === "completed" ? "success" : job.status === "failed" ? "danger" : "accent"}>{job.status}</Badge>
                    </div>
                    <p className="text-sm text-mist-400">{job.sourceKind === "url" ? "URL source" : "Local source"} · {formatDateTime(job.createdAt)}</p>
                  </div>
                  <span className="text-xs text-mist-500">{job.id}</span>
                </div>
                <div className="mt-3"><ProgressBar value={job.progress} /></div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-mist-300">
                  <span>Stage: {job.stage}</span>
                  <span>{loadingId === job.id ? "Loading details…" : formatDateTime(job.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6">
        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Selected detail</p>
            <h3 className="text-xl font-semibold text-mist-50">Job inspection</h3>
          </div>
          {!selected ? (
            <EmptyState eyebrow="Nothing selected" title="Choose a job to inspect the full detail payload." description="This panel shows output paths, linked media, error state, and the structured metadata saved for the related library item." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-mist-100">{selected.job.inputValue}</p>
                  <Badge tone={selected.job.status === "completed" ? "success" : selected.job.status === "failed" ? "danger" : "accent"}>{selected.job.status}</Badge>
                </div>
                <dl className="mt-4 space-y-2 text-sm text-mist-300">
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Stage</dt><dd>{selected.job.stage}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Progress</dt><dd>{selected.job.progress}%</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Output directory</dt><dd className="max-w-[18rem] break-all text-right">{selected.job.outputDirectory || "—"}</dd></div>
                </dl>
              </div>

              {selected.job.errorMessage ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200"><p className="font-medium">Error trace</p><p className="mt-2 whitespace-pre-wrap leading-6">{selected.job.errorMessage}</p></div> : null}

              <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
                <p className="text-sm font-medium text-mist-100">Log excerpt</p>
                <pre className="soniva-scrollbar mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{selected.job.logExcerpt || "No log excerpt persisted yet."}</pre>
              </div>

              {selected.detail ? <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4"><p className="text-sm font-medium text-mist-100">Linked media metadata</p><pre className="soniva-scrollbar mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{prettyJson(selected.detail.metadataJson)}</pre></div> : null}
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-2 text-rose-200"><FileWarning className="h-5 w-5" /><h3 className="text-lg font-semibold">Failure posture</h3></div>
          {latestFailed ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
              <p className="font-medium">{latestFailed.inputValue}</p>
              <p className="mt-2 leading-6">Soniva does not swallow subprocess failures. The most recent failed job remains queryable, its logs stay attached to the record, and the UI exposes the error clearly.</p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-mist-300">No failed job is visible right now. During demos, you can deliberately point ffmpeg or yt-dlp to an invalid path to show the error handling posture.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

```

## `src/pages/LibraryPage.tsx`
```tsx
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import type { LibraryFilter, LibraryListItem, MediaItemDetail } from "../types";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { formatBytes, formatDateTime, formatDuration, prettyJson } from "../lib/utils";
import { getMediaItemDetail } from "../lib/tauri";

export function LibraryPage({
  items,
  query,
  setQuery,
  filter,
  setFilter
}: {
  items: LibraryListItem[];
  query: string;
  setQuery: (value: string) => void;
  filter: LibraryFilter;
  setFilter: (value: LibraryFilter) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MediaItemDetail | null>(null);

  useEffect(() => {
    const nextId = items[0]?.id ?? null;
    setSelectedId((current) => current ?? nextId);
  }, [items]);

  useEffect(() => {
    if (!selectedId) return setDetail(null);
    void getMediaItemDetail(selectedId).then(setDetail);
  }, [selectedId]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-mist-400">Catalog</p>
            <h3 className="text-2xl font-semibold text-mist-50">Local library</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "ready", "failed"] as const).map((value) => (
              <Button key={value} variant={filter === value ? "primary" : "secondary"} onClick={() => setFilter(value)}>
                {value}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-white/8 bg-white/[0.02] px-4 py-3">
          <Search className="h-4 w-4 text-mist-400" />
          <Input className="border-0 bg-transparent px-0 py-0 focus:ring-0" placeholder="Search by title, source, or uploader" value={query} onChange={(event) => setQuery(event.target.value)} />
          <SlidersHorizontal className="h-4 w-4 text-mist-500" />
        </div>

        {items.length === 0 ? (
          <EmptyState eyebrow="No items match" title="The current library query returned no rows." description="Try clearing the search term, switching the filter back to “all,” or queueing a new authorized ingestion job." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full rounded-3xl border p-4 text-left transition ${item.id === selectedId ? "border-accent-400/40 bg-accent-500/10" : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-mist-100">{item.title}</h4>
                    <p className="text-sm text-mist-400">{item.sourceLabel || "Local source file"}</p>
                  </div>
                  <Badge tone={item.status === "ready" ? "success" : item.status === "failed" ? "danger" : "warning"}>{item.status}</Badge>
                </div>
                <dl className="mt-4 grid gap-2 text-sm text-mist-300 sm:grid-cols-3">
                  <div><dt className="text-mist-500">Duration</dt><dd>{formatDuration(item.durationSeconds)}</dd></div>
                  <div><dt className="text-mist-500">Source size</dt><dd>{formatBytes(item.fileSizeBytes)}</dd></div>
                  <div><dt className="text-mist-500">Created</dt><dd>{formatDateTime(item.createdAt)}</dd></div>
                </dl>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-5">
        <div>
          <p className="text-sm text-mist-400">Selected item</p>
          <h3 className="text-xl font-semibold text-mist-50">Detail inspector</h3>
        </div>
        {!detail ? (
          <EmptyState eyebrow="No item selected" title="Choose a catalog item." description="When a row is selected, this inspector shows thumbnail paths, extracted audio output, source trace, and structured metadata." />
        ) : (
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-mist-50">{detail.item.title}</h4>
                  <p className="mt-1 text-sm text-mist-400">{detail.item.sourceLabel || "Local source file"}</p>
                </div>
                <Badge tone={detail.item.status === "ready" ? "success" : "warning"}>{detail.item.status}</Badge>
              </div>
              <dl className="mt-4 space-y-3 text-sm text-mist-300">
                <div><dt className="text-mist-500">Library directory</dt><dd className="mt-1 break-all text-mist-50">{detail.item.libraryDir}</dd></div>
                <div><dt className="text-mist-500">Source media path</dt><dd className="mt-1 break-all text-mist-50">{detail.item.sourceMediaPath || "—"}</dd></div>
                <div><dt className="text-mist-500">Extracted audio</dt><dd className="mt-1 break-all text-mist-50">{detail.item.audioPath || "No audio asset persisted yet."}</dd></div>
                <div><dt className="text-mist-500">Thumbnail</dt><dd className="mt-1 break-all text-mist-50">{detail.item.thumbnailPath || "—"}</dd></div>
                <div><dt className="text-mist-500">Remote URL</dt><dd className="mt-1 break-all text-mist-50">{detail.remoteUrl || "—"}</dd></div>
              </dl>
            </div>

            <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-mist-100">Item metadata JSON</p>
              <pre className="soniva-scrollbar mt-3 max-h-60 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{prettyJson(detail.metadataJson)}</pre>
            </div>

            <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-mist-100">Source metadata JSON</p>
              <pre className="soniva-scrollbar mt-3 max-h-60 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{prettyJson(detail.sourceMetadataJson)}</pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

```

## `src/pages/OverviewPage.tsx`
```tsx
import { AlertTriangle, AudioLines, CheckCircle2, LibraryBig } from "lucide-react";
import type { BootstrapResponse, DashboardMetrics, IngestionJobRecord, LibraryListItem } from "../types";
import { formatDateTime, relativeTime } from "../lib/utils";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { StatCard } from "../components/ui/StatCard";

export function OverviewPage({
  bootstrap,
  metrics,
  jobs,
  library
}: {
  bootstrap: BootstrapResponse | null;
  metrics: DashboardMetrics;
  jobs: IngestionJobRecord[];
  library: LibraryListItem[];
}) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <StatCard label="Library items" value={metrics.totalItems} hint="Media catalogued locally" icon={<LibraryBig className="h-4 w-4" />} />
        <StatCard label="Jobs recorded" value={metrics.totalJobs} hint="Persistent execution history" icon={<AudioLines className="h-4 w-4" />} />
        <StatCard label="Completed" value={metrics.completedJobs} hint="Successful ingestion runs" icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Needs attention" value={metrics.failedJobs} hint="Failed jobs available for review" icon={<AlertTriangle className="h-4 w-4" />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mist-400">Recent jobs</p>
              <h3 className="text-xl font-semibold text-mist-50">Execution trace</h3>
            </div>
            <Badge tone="neutral">{jobs.length} visible</Badge>
          </div>
          {jobs.length === 0 ? (
            <EmptyState eyebrow="No jobs yet" title="The queue is empty." description="Configure settings first, then start with a short authorized URL or a local media file to generate your first persisted job history." />
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <article key={job.id} className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-mist-100">{job.inputValue}</h4>
                      <p className="mt-1 text-xs text-mist-400">Created {relativeTime(job.createdAt)} · Updated {formatDateTime(job.updatedAt)}</p>
                    </div>
                    <Badge tone={job.status === "completed" ? "success" : job.status === "failed" ? "danger" : "accent"}>{job.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-mist-300">
                    Stage: <span className="text-mist-50">{job.stage}</span>
                  </p>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Environment</p>
            <h3 className="text-xl font-semibold text-mist-50">Resolved workspace</h3>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-mist-400">Application data directory</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.appDataDir ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-mist-400">SQLite database</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.databasePath ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-mist-400">Configured library root</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.libraryRoot ?? "—"}</dd>
            </div>
          </dl>
          <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Portfolio note</p>
            <p className="mt-2 leading-6">
              Soniva intentionally favors predictable local workflows over feature inflation:
              SQLite for persistence, a compact Rust core for OS integrations, and a React surface
              optimized for clarity and screenshots.
            </p>
          </div>
        </Card>
      </section>

      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-mist-400">Library preview</p>
            <h3 className="text-xl font-semibold text-mist-50">Newest catalog entries</h3>
          </div>
          <Badge tone="neutral">{library.length} items loaded</Badge>
        </div>
        {library.length === 0 ? (
          <EmptyState eyebrow="Library is empty" title="Nothing has been ingested yet." description="After the first successful job, Soniva will show extracted audio, metadata footprint, library directory, and the most recent thumbnail when available." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {library.slice(0, 3).map((item) => (
              <article key={item.id} className="rounded-3xl border border-white/8 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-mist-100">{item.title}</h4>
                    <p className="mt-1 text-sm text-mist-400">{item.sourceLabel || "Local source"}</p>
                  </div>
                  <Badge tone={item.status === "ready" ? "success" : "warning"}>{item.status}</Badge>
                </div>
                <p className="mt-3 break-all text-xs leading-5 text-mist-400">{item.libraryDir}</p>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

```

## `src/pages/SettingsPage.tsx`
```tsx
import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen, Loader2, SearchCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { detectBinary, saveSettings } from "../lib/tauri";
import type { BinaryProbe, SettingsPayload } from "../types";

export function SettingsPage({ initial, onSaved }: { initial: SettingsPayload; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [ytProbe, setYtProbe] = useState<BinaryProbe | null>(null);
  const [ffmpegProbe, setFfmpegProbe] = useState<BinaryProbe | null>(null);
  const ready = useMemo(() => Boolean(form.libraryRoot && form.ytDlpPath && form.ffmpegPath), [form]);

  async function pickDirectory() {
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected === "string") {
      setForm((current) => ({ ...current, libraryRoot: selected }));
    }
  }

  async function probe(binaryName: "yt-dlp" | "ffmpeg") {
    setMessage(null);
    const result = await detectBinary(binaryName, binaryName === "yt-dlp" ? form.ytDlpPath : form.ffmpegPath);
    if (binaryName === "yt-dlp") {
      setYtProbe(result);
      if (result.found && result.resolvedPath) setForm((current) => ({ ...current, ytDlpPath: result.resolvedPath! }));
    } else {
      setFfmpegProbe(result);
      if (result.found && result.resolvedPath) setForm((current) => ({ ...current, ffmpegPath: result.resolvedPath! }));
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const result = await saveSettings(form);
      setMessage(result.message);
      await onSaved();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-mist-400">Configuration</p>
            <h3 className="text-2xl font-semibold text-mist-50">Local environment settings</h3>
          </div>
          <Badge tone={ready ? "success" : "warning"}>{ready ? "Ready to ingest" : "Needs completion"}</Badge>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">Library root directory</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input value={form.libraryRoot} onChange={(event) => setForm((current) => ({ ...current, libraryRoot: event.target.value }))} placeholder="/Users/you/Media/Soniva Library" />
            <Button variant="secondary" onClick={() => void pickDirectory()}><FolderOpen className="h-4 w-4" />Browse</Button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">yt-dlp path</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input value={form.ytDlpPath} onChange={(event) => setForm((current) => ({ ...current, ytDlpPath: event.target.value }))} placeholder="/usr/local/bin/yt-dlp" />
            <Button variant="secondary" onClick={() => void probe("yt-dlp")}><SearchCheck className="h-4 w-4" />Detect</Button>
          </div>
          {ytProbe ? <p className="text-sm text-mist-400">{ytProbe.message}{ytProbe.version ? ` · ${ytProbe.version}` : ""}</p> : null}
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">ffmpeg path</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input value={form.ffmpegPath} onChange={(event) => setForm((current) => ({ ...current, ffmpegPath: event.target.value }))} placeholder="/usr/local/bin/ffmpeg" />
            <Button variant="secondary" onClick={() => void probe("ffmpeg")}><SearchCheck className="h-4 w-4" />Detect</Button>
          </div>
          {ffmpegProbe ? <p className="text-sm text-mist-400">{ffmpegProbe.message}{ffmpegProbe.version ? ` · ${ffmpegProbe.version}` : ""}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm text-mist-400">Extracted audio format</label>
            <Select value={form.audioFormat} onChange={(event) => setForm((current) => ({ ...current, audioFormat: event.target.value as "mp3" }))}>
              <option value="mp3">MP3 (V1 default)</option>
            </Select>
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-mist-400">Overwrite policy</label>
            <Select value={form.overwritePolicy} onChange={(event) => setForm((current) => ({ ...current, overwritePolicy: event.target.value as "skip" | "replace" }))}>
              <option value="skip">Skip if output already exists</option>
              <option value="replace">Replace existing output</option>
            </Select>
          </div>
        </div>

        {message ? <div className="rounded-2xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-mist-200">{message}</div> : null}

        <div className="flex items-center justify-end">
          <Button onClick={() => void handleSave()} disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Save settings</Button>
        </div>
      </Card>

      <div className="grid gap-6">
        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Path policy</p>
            <h3 className="text-xl font-semibold text-mist-50">Why the app asks for explicit paths</h3>
          </div>
          <p className="text-sm leading-6 text-mist-300">
            The product favors transparent local dependencies over hidden installers. You can rely on
            PATH-based auto-detection, but explicit paths make demo environments more predictable and
            reduce ambiguity when multiple versions of the same tool are installed.
          </p>
          <ul className="space-y-2 text-sm text-mist-300">
            <li>• The library root is the only managed storage location.</li>
            <li>• yt-dlp is used only for authorized URL ingestion.</li>
            <li>• ffmpeg is required for extraction and conservative conversion.</li>
          </ul>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Operational defaults</p>
            <h3 className="text-xl font-semibold text-mist-50">V1 choices</h3>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Extracted format</p>
            <p className="mt-2 leading-6">MP3 is the single V1 output to keep setup stable and simplify demo validation. The schema is already ready for additional formats in a future round.</p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Overwrite posture</p>
            <p className="mt-2 leading-6">Skipping by default is safer for local archives. Replace mode is still available when you want deterministic reruns during development.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

```

## `src/styles/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #f7f8fc;
  background: #060816;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  color-scheme: dark;
}

html,
body,
#root {
  min-height: 100%;
  margin: 0;
}

body {
  background:
    radial-gradient(circle at top, rgba(139, 92, 246, 0.16), transparent 24%),
    radial-gradient(circle at 80% 0%, rgba(96, 165, 250, 0.08), transparent 18%),
    #060816;
}

* {
  box-sizing: border-box;
}

button,
input,
select,
textarea {
  font: inherit;
}

::selection {
  background: rgba(167, 139, 250, 0.35);
}

.soniva-scrollbar::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.soniva-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(145, 165, 195, 0.28);
  border-radius: 999px;
  border: 2px solid rgba(6, 8, 22, 0.7);
}

.soniva-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.panel {
  @apply rounded-3xl border border-white/8 bg-white/[0.03] shadow-panel backdrop-blur-xl;
}

.panel-muted {
  @apply rounded-3xl border border-white/8 bg-white/[0.02] shadow-soft backdrop-blur-md;
}

.subtle-grid {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 26px 26px;
  mask-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), transparent 80%);
}

.text-gradient {
  background: linear-gradient(135deg, #f7f8fc 0%, #b7c5dd 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

```

## `src/types.ts`
```ts
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

```

## `src-tauri/Cargo.toml`
```toml
[package]
name = "soniva"
version = "0.1.0"
description = "Soniva desktop application"
authors = ["OpenAI"]
edition = "2021"

[lib]
name = "soniva_lib"
crate-type = ["staticlib", "cdylib", "rlib"]

[build-dependencies]
tauri-build = { version = "2.0.0", features = [] }

[dependencies]
anyhow = "1.0"
chrono = { version = "0.4", features = ["serde"] }
rusqlite = { version = "0.32", features = ["bundled"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tauri = { version = "2.0.0", features = [] }
tauri-plugin-dialog = "2.0.0"
uuid = { version = "1.11", features = ["v4", "serde"] }

```

## `src-tauri/build.rs`
```rust
fn main() {
    tauri_build::build()
}

```

## `src-tauri/capabilities/default.json`
```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Default Soniva desktop capability set.",
  "windows": ["main"],
  "permissions": ["core:default", "dialog:default"]
}

```

## `src-tauri/src/db.rs`
```rust
use anyhow::{anyhow, Context, Result};
use chrono::Utc;
use rusqlite::{params, params_from_iter, types::Value as SqlValue, Connection, OptionalExtension};
use serde_json::{json, Value};
use std::fs;
use std::path::{Path, PathBuf};

use crate::models::{JobDetailResponse, LibraryListItem, MediaItemDetail, ResolvedPaths, SettingsPayload, SqlPayload, SqlResponse};

const MIGRATION_SQL: &str = include_str!("../../drizzle/0000_soniva_init.sql");

pub fn open_connection(db_path: &Path) -> Result<Connection> {
    if let Some(parent) = db_path.parent() {
        fs::create_dir_all(parent).with_context(|| format!("failed to create database directory {}", parent.display()))?;
    }

    let connection = Connection::open(db_path).with_context(|| format!("failed to open database at {}", db_path.display()))?;
    connection.pragma_update(None, "foreign_keys", "ON")?;
    connection.pragma_update(None, "journal_mode", "WAL")?;
    Ok(connection)
}

pub fn initialize_database(db_path: &Path) -> Result<()> {
    let connection = open_connection(db_path)?;
    connection.execute_batch(
        r#"
        CREATE TABLE IF NOT EXISTS __soniva_migrations (
          version TEXT PRIMARY KEY NOT NULL,
          applied_at TEXT NOT NULL
        );
        "#,
    )?;

    let already_applied: Option<String> = connection
        .query_row(
            "SELECT version FROM __soniva_migrations WHERE version = ?1 LIMIT 1",
            ["0000_soniva_init"],
            |row| row.get(0),
        )
        .optional()?;

    if already_applied.is_none() {
        connection.execute_batch(MIGRATION_SQL)?;
        connection.execute(
            "INSERT INTO __soniva_migrations (version, applied_at) VALUES (?1, ?2)",
            params!["0000_soniva_init", now()],
        )?;
    }

    ensure_default_setting(&connection, "library_root", "")?;
    ensure_default_setting(&connection, "yt_dlp_path", "")?;
    ensure_default_setting(&connection, "ffmpeg_path", "")?;
    ensure_default_setting(&connection, "audio_format", "mp3")?;
    ensure_default_setting(&connection, "overwrite_policy", "skip")?;

    Ok(())
}

fn ensure_default_setting(connection: &Connection, key: &str, value: &str) -> Result<()> {
    connection.execute(
        "INSERT INTO app_settings (key, value, updated_at)
         VALUES (?1, ?2, ?3)
         ON CONFLICT(key) DO NOTHING",
        params![key, value, now()],
    )?;
    Ok(())
}

pub fn save_settings(db_path: &Path, payload: &SettingsPayload) -> Result<()> {
    let connection = open_connection(db_path)?;
    let tx = connection.unchecked_transaction()?;

    upsert_setting(&tx, "library_root", &payload.library_root)?;
    upsert_setting(&tx, "yt_dlp_path", &payload.yt_dlp_path)?;
    upsert_setting(&tx, "ffmpeg_path", &payload.ffmpeg_path)?;
    upsert_setting(&tx, "audio_format", &payload.audio_format)?;
    upsert_setting(&tx, "overwrite_policy", &payload.overwrite_policy)?;

    tx.commit()?;
    Ok(())
}

fn upsert_setting(connection: &Connection, key: &str, value: &str) -> Result<()> {
    connection.execute(
        r#"
        INSERT INTO app_settings (key, value, updated_at)
        VALUES (?1, ?2, ?3)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          updated_at = excluded.updated_at
        "#,
        params![key, value, now()],
    )?;
    Ok(())
}

pub fn read_setting(connection: &Connection, key: &str) -> Result<Option<String>> {
    Ok(connection
        .query_row("SELECT value FROM app_settings WHERE key = ?1 LIMIT 1", [key], |row| row.get(0))
        .optional()?)
}

pub fn resolve_paths(db_path: &Path) -> Result<ResolvedPaths> {
    let connection = open_connection(db_path)?;
    Ok(ResolvedPaths {
        library_root: read_setting(&connection, "library_root")?.filter(|value| !value.trim().is_empty()),
        yt_dlp_path: read_setting(&connection, "yt_dlp_path")?.filter(|value| !value.trim().is_empty()),
        ffmpeg_path: read_setting(&connection, "ffmpeg_path")?.filter(|value| !value.trim().is_empty()),
        audio_format: read_setting(&connection, "audio_format")?.unwrap_or_else(|| "mp3".to_string()),
        overwrite_policy: read_setting(&connection, "overwrite_policy")?.unwrap_or_else(|| "skip".to_string()),
    })
}

pub fn ensure_directory(path: &Path) -> Result<()> {
    fs::create_dir_all(path).with_context(|| format!("failed to create directory {}", path.display()))?;
    Ok(())
}

pub fn execute_sql_proxy(db_path: &Path, payload: SqlPayload) -> Result<SqlResponse> {
    let connection = open_connection(db_path)?;
    let mut statement = connection.prepare(&payload.sql)?;
    let params = payload.params.iter().map(json_to_sql_value).collect::<Vec<_>>();

    match payload.method.as_str() {
        "run" => {
            statement.execute(params_from_iter(params))?;
            Ok(SqlResponse { rows: json!([]) })
        }
        "get" => {
            let col_count = statement.column_count();
            let mut rows = statement.query(params_from_iter(params))?;
            if let Some(row) = rows.next()? {
                let value = row_to_value_with_count(row, col_count)?;
                Ok(SqlResponse {
                    rows: json!([value]),
                })
            } else {
                Ok(SqlResponse { rows: json!([]) })
            }
        }
        "values" => {
            let col_count = statement.column_count();
            let mut rows = statement.query(params_from_iter(params))?;
            let mut out = Vec::new();
            while let Some(row) = rows.next()? {
                let mut cells = Vec::new();
                for index in 0..col_count {
                    let raw: rusqlite::types::Value = row.get(index)?;
                    cells.push(sql_value_to_json(raw));
                }
                out.push(Value::Array(cells));
            }
            Ok(SqlResponse {
                rows: Value::Array(out),
            })
        }
        "all" => {
            let col_count = statement.column_count();
            let mut rows = statement.query(params_from_iter(params))?;
            let mut out = Vec::new();
            while let Some(row) = rows.next()? {
                out.push(row_to_value_with_count(row, col_count)?);
            }
            Ok(SqlResponse {
                rows: Value::Array(out),
            })
        }
        other => Err(anyhow!("unsupported SQL proxy method: {}", other)),
    }
}

fn json_to_sql_value(value: &Value) -> SqlValue {
    match value {
        Value::Null => SqlValue::Null,
        Value::Bool(flag) => SqlValue::Integer(if *flag { 1 } else { 0 }),
        Value::Number(number) => {
            if let Some(integer) = number.as_i64() {
                SqlValue::Integer(integer)
            } else if let Some(float) = number.as_f64() {
                SqlValue::Real(float)
            } else {
                SqlValue::Null
            }
        }
        Value::String(text) => SqlValue::Text(text.clone()),
        Value::Array(_) | Value::Object(_) => SqlValue::Text(value.to_string()),
    }
}

fn sql_value_to_json(value: rusqlite::types::Value) -> Value {
    match value {
        rusqlite::types::Value::Null => Value::Null,
        rusqlite::types::Value::Integer(number) => json!(number),
        rusqlite::types::Value::Real(number) => json!(number),
        rusqlite::types::Value::Text(text) => json!(text),
        rusqlite::types::Value::Blob(blob) => json!(blob),
    }
}

fn row_to_value_with_count(row: &rusqlite::Row<'_>, col_count: usize) -> Result<Value> {
    let mut cells = Vec::new();
    for index in 0..col_count {
        let raw: rusqlite::types::Value = row.get(index)?;
        cells.push(sql_value_to_json(raw));
    }
    Ok(Value::Array(cells))
}

pub fn list_library_items(db_path: &Path, query: Option<String>, filter: Option<String>) -> Result<Vec<LibraryListItem>> {
    let connection = open_connection(db_path)?;
    let mut sql = String::from(
        r#"
        SELECT
          mi.id,
          mi.title,
          mi.slug,
          mi.status,
          mi.origin_kind,
          mi.duration_seconds,
          mi.file_size_bytes,
          mi.source_media_path,
          mi.library_dir,
          ea.audio_path,
          ea.format,
          ms.canonical_url,
          ms.uploader,
          th.local_path,
          mi.created_at,
          mi.updated_at
        FROM media_items mi
        LEFT JOIN media_sources ms ON ms.id = mi.source_id
        LEFT JOIN extracted_audio_assets ea ON ea.media_item_id = mi.id
        LEFT JOIN thumbnails th ON th.media_item_id = mi.id
        WHERE 1 = 1
        "#,
    );

    let mut args: Vec<String> = Vec::new();

    if let Some(query) = query.filter(|value| !value.trim().is_empty()) {
        sql.push_str(
            " AND (LOWER(mi.title) LIKE LOWER(?)
                   OR LOWER(COALESCE(ms.canonical_url, '')) LIKE LOWER(?)
                   OR LOWER(COALESCE(ms.uploader, '')) LIKE LOWER(?)) ",
        );
        let pattern = format!("%{}%", query.trim());
        args.push(pattern.clone());
        args.push(pattern.clone());
        args.push(pattern);
    }

    if let Some(filter) = filter.filter(|value| value != "all") {
        sql.push_str(" AND mi.status = ? ");
        args.push(filter);
    }

    sql.push_str(" ORDER BY mi.created_at DESC");

    let mut statement = connection.prepare(&sql)?;
    let params = args.iter().map(|value| value as &dyn rusqlite::ToSql).collect::<Vec<_>>();

    let rows = statement.query_map(params.as_slice(), |row| {
        Ok(LibraryListItem {
            id: row.get(0)?,
            title: row.get(1)?,
            slug: row.get(2)?,
            status: row.get(3)?,
            origin_kind: row.get(4)?,
            duration_seconds: row.get(5)?,
            file_size_bytes: row.get(6)?,
            source_media_path: row.get(7)?,
            library_dir: row.get(8)?,
            audio_path: row.get(9)?,
            audio_format: row.get(10)?,
            source_label: row.get(11)?,
            uploader: row.get(12)?,
            thumbnail_path: row.get(13)?,
            created_at: row.get(14)?,
            updated_at: row.get(15)?,
        })
    })?;

    let mut items = Vec::new();
    for row in rows {
        items.push(row?);
    }

    Ok(items)
}

pub fn get_media_item_detail(db_path: &Path, media_item_id: &str) -> Result<Option<MediaItemDetail>> {
    let connection = open_connection(db_path)?;
    let row = connection
        .query_row(
            r#"
            SELECT
              mi.id,
              mi.title,
              mi.slug,
              mi.status,
              mi.origin_kind,
              mi.duration_seconds,
              mi.file_size_bytes,
              mi.source_media_path,
              mi.library_dir,
              ea.audio_path,
              ea.format,
              ms.canonical_url,
              ms.uploader,
              th.local_path,
              mi.created_at,
              mi.updated_at,
              mi.metadata_json,
              ms.metadata_json,
              ms.canonical_url
            FROM media_items mi
            LEFT JOIN media_sources ms ON ms.id = mi.source_id
            LEFT JOIN extracted_audio_assets ea ON ea.media_item_id = mi.id
            LEFT JOIN thumbnails th ON th.media_item_id = mi.id
            WHERE mi.id = ?1
            LIMIT 1
            "#,
            [media_item_id],
            |row| {
                let item = LibraryListItem {
                    id: row.get(0)?,
                    title: row.get(1)?,
                    slug: row.get(2)?,
                    status: row.get(3)?,
                    origin_kind: row.get(4)?,
                    duration_seconds: row.get(5)?,
                    file_size_bytes: row.get(6)?,
                    source_media_path: row.get(7)?,
                    library_dir: row.get(8)?,
                    audio_path: row.get(9)?,
                    audio_format: row.get(10)?,
                    source_label: row.get(11)?,
                    uploader: row.get(12)?,
                    thumbnail_path: row.get(13)?,
                    created_at: row.get(14)?,
                    updated_at: row.get(15)?,
                };

                Ok(MediaItemDetail {
                    item,
                    metadata_json: row.get(16)?,
                    source_metadata_json: row.get(17)?,
                    remote_url: row.get(18)?,
                })
            },
        )
        .optional()?;

    Ok(row)
}

pub fn get_job_detail(db_path: &Path, job_id: &str) -> Result<Option<JobDetailResponse>> {
    let connection = open_connection(db_path)?;
    let job = connection
        .query_row(
            r#"
            SELECT
              id,
              source_kind,
              input_value,
              status,
              stage,
              progress,
              media_item_id,
              output_directory,
              log_excerpt,
              error_message,
              created_at,
              started_at,
              finished_at,
              updated_at
            FROM ingestion_jobs
            WHERE id = ?1
            LIMIT 1
            "#,
            [job_id],
            |row| {
                Ok(json!({
                    "id": row.get::<_, String>(0)?,
                    "sourceKind": row.get::<_, String>(1)?,
                    "inputValue": row.get::<_, String>(2)?,
                    "status": row.get::<_, String>(3)?,
                    "stage": row.get::<_, String>(4)?,
                    "progress": row.get::<_, i64>(5)?,
                    "mediaItemId": row.get::<_, Option<String>>(6)?,
                    "outputDirectory": row.get::<_, Option<String>>(7)?,
                    "logExcerpt": row.get::<_, Option<String>>(8)?,
                    "errorMessage": row.get::<_, Option<String>>(9)?,
                    "createdAt": row.get::<_, String>(10)?,
                    "startedAt": row.get::<_, Option<String>>(11)?,
                    "finishedAt": row.get::<_, Option<String>>(12)?,
                    "updatedAt": row.get::<_, String>(13)?,
                }))
            },
        )
        .optional()?;

    if let Some(job) = job {
        let detail = job
            .get("mediaItemId")
            .and_then(|value| value.as_str())
            .map(|media_item_id| get_media_item_detail(db_path, media_item_id))
            .transpose()?
            .flatten();

        Ok(Some(JobDetailResponse { job, detail }))
    } else {
        Ok(None)
    }
}

pub fn now() -> String {
    Utc::now().to_rfc3339()
}

pub fn domain_from_url(url: &str) -> Option<String> {
    let trimmed = url.trim();
    let without_scheme = trimmed
        .strip_prefix("https://")
        .or_else(|| trimmed.strip_prefix("http://"))
        .unwrap_or(trimmed);

    let host = without_scheme.split('/').next()?.trim();
    if host.is_empty() {
        None
    } else {
        Some(host.to_string())
    }
}

pub fn read_sidecar_json(path: &Path) -> Option<String> {
    fs::read_to_string(path).ok()
}

pub fn file_size(path: &Path) -> Option<i64> {
    fs::metadata(path).ok().map(|metadata| metadata.len() as i64)
}

pub fn canonicalize_lossy(path: &Path) -> String {
    path.canonicalize()
        .unwrap_or_else(|_| PathBuf::from(path))
        .display()
        .to_string()
}

```

## `src-tauri/src/lib.rs`
```rust
pub mod db;
pub mod models;
pub mod pipeline;

```

## `src-tauri/src/main.rs`
```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod models;
mod pipeline;

use anyhow::{anyhow, Result};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, State};

use crate::db::{get_job_detail as db_get_job_detail, get_media_item_detail as db_get_media_item_detail, initialize_database, list_library_items as db_list_library_items, resolve_paths, save_settings as db_save_settings};
use crate::models::{BootstrapResponse, IngestionRequest, SaveSettingsResponse, SettingsPayload, SqlPayload, SqlResponse, StartJobResponse};

#[derive(Clone)]
struct AppState {
    db_path: PathBuf,
    app_data_dir: PathBuf,
}

#[tauri::command]
fn bootstrap_app(app: AppHandle, state: State<AppState>) -> Result<BootstrapResponse, String> {
    initialize_database(&state.db_path).map_err(stringify_error)?;
    let resolved = resolve_paths(&state.db_path).map_err(stringify_error)?;
    let detected_yt_dlp = pipeline::detect_binary("yt-dlp", resolved.yt_dlp_path.as_deref());
    let detected_ffmpeg = pipeline::detect_binary("ffmpeg", resolved.ffmpeg_path.as_deref());

    Ok(BootstrapResponse {
        app_data_dir: state.app_data_dir.display().to_string(),
        database_path: state.db_path.display().to_string(),
        library_root: resolved.library_root,
        detected_yt_dlp_path: detected_yt_dlp.resolved_path,
        detected_ffmpeg_path: detected_ffmpeg.resolved_path,
        app_version: app.package_info().version.to_string(),
    })
}

#[allow(non_snake_case)]
#[tauri::command]
fn detect_binary(binaryName: String, preferredPath: Option<String>) -> crate::models::BinaryProbe {
    pipeline::detect_binary(&binaryName, preferredPath.as_deref())
}

#[tauri::command]
fn execute_sql(state: State<AppState>, payload: SqlPayload) -> Result<SqlResponse, String> {
    db::execute_sql_proxy(&state.db_path, payload).map_err(stringify_error)
}

#[tauri::command]
fn save_settings(state: State<AppState>, payload: SettingsPayload) -> Result<SaveSettingsResponse, String> {
    if payload.library_root.trim().is_empty() {
        return Err("Library root is required.".to_string());
    }

    let library_root = PathBuf::from(payload.library_root.trim());
    std::fs::create_dir_all(&library_root).map_err(|error| format!("Failed to create library root: {}", error))?;

    db_save_settings(&state.db_path, &payload).map_err(stringify_error)?;
    Ok(SaveSettingsResponse {
        saved: true,
        message: "Settings saved successfully.".to_string(),
    })
}

#[tauri::command]
fn start_ingestion_job(state: State<AppState>, payload: IngestionRequest) -> Result<StartJobResponse, String> {
    let job_id = pipeline::queue_ingestion_job(state.db_path.clone(), payload).map_err(stringify_error)?;
    Ok(StartJobResponse { job_id })
}

#[tauri::command]
fn list_library_items(state: State<AppState>, query: Option<String>, filter: Option<String>) -> Result<Vec<crate::models::LibraryListItem>, String> {
    db_list_library_items(&state.db_path, query, filter).map_err(stringify_error)
}

#[allow(non_snake_case)]
#[tauri::command]
fn get_media_item_detail(state: State<AppState>, mediaItemId: String) -> Result<crate::models::MediaItemDetail, String> {
    db_get_media_item_detail(&state.db_path, &mediaItemId)
        .map_err(stringify_error)?
        .ok_or_else(|| "Media item not found.".to_string())
}

#[allow(non_snake_case)]
#[tauri::command]
fn get_job_detail(state: State<AppState>, jobId: String) -> Result<crate::models::JobDetailResponse, String> {
    db_get_job_detail(&state.db_path, &jobId)
        .map_err(stringify_error)?
        .ok_or_else(|| "Job not found.".to_string())
}

fn build_state(app_handle: &AppHandle) -> Result<AppState> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|error| anyhow!("failed to resolve app data dir: {}", error))?;

    std::fs::create_dir_all(&app_data_dir)?;
    let db_path = app_data_dir.join("soniva.sqlite");
    initialize_database(&db_path)?;

    Ok(AppState { db_path, app_data_dir })
}

fn stringify_error(error: impl ToString) -> String {
    error.to_string()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let state = build_state(app.handle())?;
            app.manage(state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            bootstrap_app,
            detect_binary,
            execute_sql,
            save_settings,
            start_ingestion_job,
            list_library_items,
            get_media_item_detail,
            get_job_detail
        ])
        .run(tauri::generate_context!())
        .expect("failed to run Soniva");
}

```

## `src-tauri/src/models.rs`
```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BootstrapResponse {
    pub app_data_dir: String,
    pub database_path: String,
    pub library_root: Option<String>,
    pub detected_yt_dlp_path: Option<String>,
    pub detected_ffmpeg_path: Option<String>,
    pub app_version: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BinaryProbe {
    pub found: bool,
    pub binary_name: String,
    pub resolved_path: Option<String>,
    pub version: Option<String>,
    pub message: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SettingsPayload {
    pub library_root: String,
    pub yt_dlp_path: String,
    pub ffmpeg_path: String,
    pub audio_format: String,
    pub overwrite_policy: String,
}

#[derive(Debug, Serialize)]
pub struct SaveSettingsResponse {
    pub saved: bool,
    pub message: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IngestionRequest {
    pub source_kind: String,
    pub input_value: String,
    pub authorized: bool,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StartJobResponse {
    pub job_id: String,
}

#[derive(Debug, Deserialize)]
pub struct SqlPayload {
    pub sql: String,
    pub params: Vec<serde_json::Value>,
    pub method: String,
}

#[derive(Debug, Serialize)]
pub struct SqlResponse {
    pub rows: serde_json::Value,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LibraryListItem {
    pub id: String,
    pub title: String,
    pub slug: String,
    pub status: String,
    pub origin_kind: String,
    pub duration_seconds: Option<i64>,
    pub file_size_bytes: Option<i64>,
    pub source_media_path: Option<String>,
    pub library_dir: String,
    pub audio_path: Option<String>,
    pub audio_format: Option<String>,
    pub source_label: Option<String>,
    pub uploader: Option<String>,
    pub thumbnail_path: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaItemDetail {
    pub item: LibraryListItem,
    pub metadata_json: Option<String>,
    pub source_metadata_json: Option<String>,
    pub remote_url: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct JobDetailResponse {
    pub job: serde_json::Value,
    pub detail: Option<MediaItemDetail>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ResolvedPaths {
    pub library_root: Option<String>,
    pub yt_dlp_path: Option<String>,
    pub ffmpeg_path: Option<String>,
    pub audio_format: String,
    pub overwrite_policy: String,
}

```

## `src-tauri/src/pipeline.rs`
```rust
use anyhow::{anyhow, bail, Context, Result};
use rusqlite::{params, Connection, OptionalExtension};
use serde_json::{json, Value};
use std::ffi::OsStr;
use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;
use uuid::Uuid;

use crate::db::{canonicalize_lossy, domain_from_url, ensure_directory, file_size, now, open_connection, read_setting, read_sidecar_json, resolve_paths};
use crate::models::{BinaryProbe, IngestionRequest};

pub fn detect_binary(binary_name: &str, preferred_path: Option<&str>) -> BinaryProbe {
    let preferred = preferred_path
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty());

    let resolved_path = preferred
        .as_ref()
        .and_then(|value| {
            let candidate = PathBuf::from(value);
            if candidate.exists() {
                Some(candidate)
            } else {
                None
            }
        })
        .or_else(|| find_in_path(binary_name));

    if let Some(resolved_path) = resolved_path {
        let version = Command::new(&resolved_path)
            .arg("--version")
            .output()
            .ok()
            .map(|output| {
                let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
                let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();
                if stdout.is_empty() { stderr } else { stdout }
            })
            .filter(|text| !text.is_empty());

        BinaryProbe {
            found: true,
            binary_name: binary_name.to_string(),
            resolved_path: Some(resolved_path.display().to_string()),
            version,
            message: format!("Resolved {} successfully.", binary_name),
        }
    } else {
        BinaryProbe {
            found: false,
            binary_name: binary_name.to_string(),
            resolved_path: None,
            version: None,
            message: format!(
                "Could not resolve {}. Install it system-wide or save an explicit path in Settings.",
                binary_name
            ),
        }
    }
}

fn find_in_path(binary_name: &str) -> Option<PathBuf> {
    let locator = if cfg!(target_os = "windows") { "where" } else { "which" };
    let output = Command::new(locator).arg(binary_name).output().ok()?;
    if !output.status.success() {
        return None;
    }
    let candidate = String::from_utf8_lossy(&output.stdout)
        .lines()
        .find(|line| !line.trim().is_empty())?
        .trim()
        .to_string();

    Some(PathBuf::from(candidate))
}

pub fn queue_ingestion_job(db_path: PathBuf, payload: IngestionRequest) -> Result<String> {
    if !payload.authorized {
        bail!("Soniva only processes authorized local media and explicitly permitted source URLs.");
    }

    if payload.input_value.trim().is_empty() {
        bail!("Input value is required.");
    }

    let job_id = Uuid::new_v4().to_string();
    let connection = open_connection(&db_path)?;
    let created_at = now();

    connection.execute(
        r#"
        INSERT INTO ingestion_jobs (
          id, source_kind, input_value, status, stage, progress, media_item_id, output_directory, log_excerpt,
          error_message, created_at, started_at, finished_at, updated_at
        ) VALUES (?1, ?2, ?3, 'queued', 'Queued', 0, NULL, NULL, ?4, NULL, ?5, NULL, NULL, ?5)
        "#,
        params![
            job_id,
            payload.source_kind,
            payload.input_value,
            "Job accepted and waiting for local pipeline execution.",
            created_at
        ],
    )?;

    std::thread::spawn(move || {
        if let Err(error) = run_ingestion_job(&db_path, &job_id, &payload) {
            let _ = persist_failure(&db_path, &job_id, &error.to_string());
        }
    });

    Ok(job_id)
}

fn run_ingestion_job(db_path: &Path, job_id: &str, payload: &IngestionRequest) -> Result<()> {
    let connection = open_connection(db_path)?;
    update_job_stage(&connection, job_id, "processing", "Initializing", 5, None, None)?;

    match payload.source_kind.as_str() {
        "url" => process_url_ingestion(&connection, db_path, job_id, payload),
        "local_file" => process_local_file_ingestion(&connection, db_path, job_id, payload),
        other => bail!("Unsupported source kind: {}", other),
    }
}

fn process_url_ingestion(connection: &Connection, db_path: &Path, job_id: &str, payload: &IngestionRequest) -> Result<()> {
    let resolved = resolve_paths(db_path)?;
    let library_root = PathBuf::from(
        resolved
            .library_root
            .clone()
            .ok_or_else(|| anyhow!("Configure a library root directory before starting ingestion jobs."))?,
    );

    let yt_dlp = resolved
        .yt_dlp_path
        .clone()
        .or_else(|| detect_binary("yt-dlp", None).resolved_path)
        .ok_or_else(|| anyhow!("yt-dlp was not found. Save a valid yt-dlp path in Settings."))?;

    let ffmpeg = resolved
        .ffmpeg_path
        .clone()
        .or_else(|| detect_binary("ffmpeg", None).resolved_path)
        .ok_or_else(|| anyhow!("ffmpeg was not found. Save a valid ffmpeg path in Settings."))?;

    ensure_directory(&library_root)?;
    ensure_directory(&library_root.join("items"))?;

    append_job_log(connection, job_id, &format!("Using library root: {}", library_root.display()))?;
    append_job_log(connection, job_id, &format!("Using yt-dlp binary: {}", yt_dlp))?;
    append_job_log(connection, job_id, &format!("Using ffmpeg binary: {}", ffmpeg))?;

    update_job_stage(connection, job_id, "processing", "Resolving source metadata", 15, None, None)?;
    let metadata_output = run_command(
        Command::new(&yt_dlp)
            .arg("--dump-single-json")
            .arg("--no-warnings")
            .arg(&payload.input_value),
        "yt-dlp metadata probe",
    )?;

    let metadata_json: Value = serde_json::from_str(&metadata_output)
        .context("yt-dlp returned metadata that could not be parsed as JSON")?;

    let title = metadata_json
        .get("title")
        .and_then(|value| value.as_str())
        .unwrap_or("Untitled media");
    let slug = slugify(title);
    let short_id = &job_id[..8];
    let item_dir = library_root.join("items").join(format!("{}--{}", slug, short_id));
    let source_dir = item_dir.join("source");
    let audio_dir = item_dir.join("audio");
    let thumbnails_dir = item_dir.join("thumbnails");

    ensure_directory(&source_dir)?;
    ensure_directory(&audio_dir)?;
    ensure_directory(&thumbnails_dir)?;

    let source_metadata_path = item_dir.join("source-metadata.json");
    fs::write(&source_metadata_path, serde_json::to_string_pretty(&metadata_json)?)
        .with_context(|| format!("failed to write {}", source_metadata_path.display()))?;

    update_job_stage(
        connection,
        job_id,
        "processing",
        "Downloading authorized source media",
        38,
        Some(canonicalize_lossy(&item_dir)),
        None,
    )?;

    let output_template = source_dir.join("source.%(ext)s");
    let download_output = run_command(
        Command::new(&yt_dlp)
            .arg("--no-warnings")
            .arg("--write-info-json")
            .arg("--write-thumbnail")
            .arg("--convert-thumbnails")
            .arg("jpg")
            .arg("-o")
            .arg(output_template.display().to_string())
            .arg("--paths")
            .arg(format!("thumbnail:{}", thumbnails_dir.display()))
            .arg(&payload.input_value),
        "yt-dlp download",
    )?;
    append_job_log(connection, job_id, &download_output)?;

    let source_media_path = find_primary_source_file(&source_dir)
        .ok_or_else(|| anyhow!("yt-dlp completed without leaving a source media file in {}", source_dir.display()))?;

    update_job_stage(connection, job_id, "processing", "Extracting audio asset", 72, Some(canonicalize_lossy(&item_dir)), None)?;

    let audio_path = audio_dir.join(format!("track.{}", resolved.audio_format));
    run_command(
        Command::new(&ffmpeg)
            .arg("-y")
            .arg("-i")
            .arg(&source_media_path)
            .arg("-vn")
            .arg("-acodec")
            .arg("libmp3lame")
            .arg("-q:a")
            .arg("2")
            .arg(&audio_path),
        "ffmpeg audio extraction",
    )?;

    let media_source_id = Uuid::new_v4().to_string();
    let media_item_id = Uuid::new_v4().to_string();
    let audio_asset_id = Uuid::new_v4().to_string();
    let thumbnail_id = Uuid::new_v4().to_string();
    let extractor_key = metadata_json.get("extractor_key").and_then(|value| value.as_str()).unwrap_or("yt-dlp");
    let canonical_url = metadata_json
        .get("webpage_url")
        .and_then(|value| value.as_str())
        .unwrap_or(payload.input_value.as_str());
    let uploader = metadata_json.get("uploader").and_then(|value| value.as_str());
    let uploaded_at = metadata_json
        .get("upload_date")
        .and_then(|value| value.as_str())
        .map(|value| value.to_string());
    let thumbnail_path = find_first_thumbnail(&thumbnails_dir);
    let duration_seconds = metadata_json.get("duration").and_then(|value| value.as_i64());

    connection.execute(
        r#"
        INSERT INTO media_sources (
          id, kind, original_value, canonical_url, extractor_key, source_domain, uploader, uploaded_at,
          metadata_json, created_at, updated_at
        ) VALUES (?1, 'url', ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?9)
        "#,
        params![
            media_source_id,
            payload.input_value,
            canonical_url,
            extractor_key,
            domain_from_url(canonical_url),
            uploader,
            uploaded_at,
            serde_json::to_string_pretty(&metadata_json)?,
            now()
        ],
    )?;

    connection.execute(
        r#"
        INSERT INTO media_items (
          id, source_id, title, slug, library_dir, source_media_path, origin_kind, status,
          duration_seconds, file_size_bytes, metadata_json, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'url', 'ready', ?7, ?8, ?9, ?10, ?10)
        "#,
        params![
            media_item_id,
            media_source_id,
            title,
            slug,
            canonicalize_lossy(&item_dir),
            canonicalize_lossy(&source_media_path),
            duration_seconds,
            file_size(&source_media_path),
            serde_json::to_string_pretty(&json!({
                "title": title,
                "sourceKind": "url",
                "jobId": job_id,
                "authorizedIngestion": true,
                "extractorKey": extractor_key,
                "sourceMetadataPath": canonicalize_lossy(&source_metadata_path),
            }))?,
            now()
        ],
    )?;

    connection.execute(
        r#"
        INSERT INTO extracted_audio_assets (
          id, media_item_id, audio_path, format, codec, duration_seconds, bitrate_kbps, file_size_bytes, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, 'libmp3lame', ?5, NULL, ?6, ?7, ?7)
        "#,
        params![
            audio_asset_id,
            media_item_id,
            canonicalize_lossy(&audio_path),
            resolved.audio_format,
            duration_seconds,
            file_size(&audio_path),
            now()
        ],
    )?;

    if let Some(thumbnail_path) = thumbnail_path {
        connection.execute(
            r#"
            INSERT INTO thumbnails (
              id, media_item_id, local_path, remote_url, width, height, created_at, updated_at
            ) VALUES (?1, ?2, ?3, NULL, NULL, NULL, ?4, ?4)
            "#,
            params![thumbnail_id, media_item_id, canonicalize_lossy(&thumbnail_path), now()],
        )?;
    }

    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = 'completed',
            stage = 'Completed',
            progress = 100,
            media_item_id = ?2,
            output_directory = ?3,
            error_message = NULL,
            finished_at = ?4,
            updated_at = ?4
        WHERE id = ?1
        "#,
        params![job_id, media_item_id, canonicalize_lossy(&item_dir), now()],
    )?;

    append_job_log(connection, job_id, "Ingestion finished successfully.")?;
    Ok(())
}

fn process_local_file_ingestion(connection: &Connection, db_path: &Path, job_id: &str, payload: &IngestionRequest) -> Result<()> {
    let resolved = resolve_paths(db_path)?;
    let library_root = PathBuf::from(
        resolved
            .library_root
            .clone()
            .ok_or_else(|| anyhow!("Configure a library root directory before starting ingestion jobs."))?,
    );
    let ffmpeg = resolved
        .ffmpeg_path
        .clone()
        .or_else(|| detect_binary("ffmpeg", None).resolved_path)
        .ok_or_else(|| anyhow!("ffmpeg was not found. Save a valid ffmpeg path in Settings."))?;

    let source_path = PathBuf::from(payload.input_value.trim());
    if !source_path.exists() {
        bail!("The selected local file does not exist: {}", source_path.display());
    }

    ensure_directory(&library_root)?;
    ensure_directory(&library_root.join("items"))?;

    let title = source_path
        .file_stem()
        .and_then(OsStr::to_str)
        .unwrap_or("local-media");
    let slug = slugify(title);
    let short_id = &job_id[..8];
    let item_dir = library_root.join("items").join(format!("{}--{}", slug, short_id));
    let source_dir = item_dir.join("source");
    let audio_dir = item_dir.join("audio");
    ensure_directory(&source_dir)?;
    ensure_directory(&audio_dir)?;

    let extension = source_path.extension().and_then(OsStr::to_str).unwrap_or("bin");
    let managed_source_path = source_dir.join(format!("source.{}", extension));
    update_job_stage(connection, job_id, "processing", "Copying local source into managed library", 30, Some(canonicalize_lossy(&item_dir)), None)?;

    fs::copy(&source_path, &managed_source_path)
        .with_context(|| format!("failed to copy {} to {}", source_path.display(), managed_source_path.display()))?;

    let source_metadata = json!({
        "sourceKind": "local_file",
        "originalPath": source_path.display().to_string(),
        "managedSourcePath": managed_source_path.display().to_string(),
        "jobId": job_id,
        "authorizedIngestion": true,
    });
    let source_metadata_path = item_dir.join("source-metadata.json");
    fs::write(&source_metadata_path, serde_json::to_string_pretty(&source_metadata)?)?;

    update_job_stage(connection, job_id, "processing", "Extracting audio asset", 68, Some(canonicalize_lossy(&item_dir)), None)?;
    let audio_path = audio_dir.join(format!("track.{}", resolved.audio_format));
    run_command(
        Command::new(&ffmpeg)
            .arg("-y")
            .arg("-i")
            .arg(&managed_source_path)
            .arg("-vn")
            .arg("-acodec")
            .arg("libmp3lame")
            .arg("-q:a")
            .arg("2")
            .arg(&audio_path),
        "ffmpeg audio extraction",
    )?;

    let media_source_id = Uuid::new_v4().to_string();
    let media_item_id = Uuid::new_v4().to_string();
    let audio_asset_id = Uuid::new_v4().to_string();

    connection.execute(
        r#"
        INSERT INTO media_sources (
          id, kind, original_value, canonical_url, extractor_key, source_domain, uploader, uploaded_at,
          metadata_json, created_at, updated_at
        ) VALUES (?1, 'local_file', ?2, NULL, 'local', NULL, NULL, NULL, ?3, ?4, ?4)
        "#,
        params![
            media_source_id,
            payload.input_value,
            serde_json::to_string_pretty(&source_metadata)?,
            now()
        ],
    )?;

    connection.execute(
        r#"
        INSERT INTO media_items (
          id, source_id, title, slug, library_dir, source_media_path, origin_kind, status,
          duration_seconds, file_size_bytes, metadata_json, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'local_file', 'ready', NULL, ?7, ?8, ?9, ?9)
        "#,
        params![
            media_item_id,
            media_source_id,
            title,
            slug,
            canonicalize_lossy(&item_dir),
            canonicalize_lossy(&managed_source_path),
            file_size(&managed_source_path),
            serde_json::to_string_pretty(&json!({
                "title": title,
                "sourceKind": "local_file",
                "jobId": job_id,
                "sourceMetadataPath": canonicalize_lossy(&source_metadata_path),
            }))?,
            now()
        ],
    )?;

    connection.execute(
        r#"
        INSERT INTO extracted_audio_assets (
          id, media_item_id, audio_path, format, codec, duration_seconds, bitrate_kbps, file_size_bytes, created_at, updated_at
        ) VALUES (?1, ?2, ?3, ?4, 'libmp3lame', NULL, NULL, ?5, ?6, ?6)
        "#,
        params![
            audio_asset_id,
            media_item_id,
            canonicalize_lossy(&audio_path),
            resolved.audio_format,
            file_size(&audio_path),
            now()
        ],
    )?;

    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = 'completed',
            stage = 'Completed',
            progress = 100,
            media_item_id = ?2,
            output_directory = ?3,
            error_message = NULL,
            finished_at = ?4,
            updated_at = ?4
        WHERE id = ?1
        "#,
        params![job_id, media_item_id, canonicalize_lossy(&item_dir), now()],
    )?;

    append_job_log(connection, job_id, "Local file ingestion finished successfully.")?;
    Ok(())
}

fn run_command(command: &mut Command, label: &str) -> Result<String> {
    let output = command
        .output()
        .with_context(|| format!("failed to execute {}", label))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

    if output.status.success() {
        if !stdout.is_empty() {
            Ok(stdout)
        } else {
            Ok(stderr)
        }
    } else {
        Err(anyhow!(
            "{} failed with exit code {:?}: {}",
            label,
            output.status.code(),
            if stderr.is_empty() { stdout } else { stderr }
        ))
    }
}

fn update_job_stage(
    connection: &Connection,
    job_id: &str,
    status: &str,
    stage: &str,
    progress: i64,
    output_directory: Option<String>,
    error_message: Option<String>,
) -> Result<()> {
    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = ?2,
            stage = ?3,
            progress = ?4,
            output_directory = COALESCE(?5, output_directory),
            error_message = ?6,
            started_at = COALESCE(started_at, ?7),
            updated_at = ?7
        WHERE id = ?1
        "#,
        params![job_id, status, stage, progress, output_directory, error_message, now()],
    )?;
    Ok(())
}

fn append_job_log(connection: &Connection, job_id: &str, message: &str) -> Result<()> {
    let existing: Option<String> = connection
        .query_row("SELECT log_excerpt FROM ingestion_jobs WHERE id = ?1", [job_id], |row| row.get(0))
        .optional()?;

    let mut next = existing.unwrap_or_default();
    if !next.is_empty() {
        next.push_str("\n\n");
    }
    next.push_str(message);

    if next.len() > 20000 {
        next = next[next.len().saturating_sub(20000)..].to_string();
    }

    connection.execute(
        "UPDATE ingestion_jobs SET log_excerpt = ?2, updated_at = ?3 WHERE id = ?1",
        params![job_id, next, now()],
    )?;
    Ok(())
}

fn persist_failure(db_path: &Path, job_id: &str, error_message: &str) -> Result<()> {
    let connection = open_connection(db_path)?;
    connection.execute(
        r#"
        UPDATE ingestion_jobs
        SET status = 'failed',
            stage = 'Failed',
            error_message = ?2,
            finished_at = ?3,
            updated_at = ?3
        WHERE id = ?1
        "#,
        params![job_id, error_message, now()],
    )?;
    append_job_log(&connection, job_id, error_message)?;
    Ok(())
}

fn slugify(input: &str) -> String {
    let mut slug = String::with_capacity(input.len());
    let mut previous_dash = false;

    for character in input.chars() {
        let lower = character.to_ascii_lowercase();
        if lower.is_ascii_alphanumeric() {
            slug.push(lower);
            previous_dash = false;
        } else if !previous_dash {
            slug.push('-');
            previous_dash = true;
        }
    }

    let slug = slug.trim_matches('-').to_string();
    if slug.is_empty() {
        "media-item".to_string()
    } else {
        slug
    }
}

fn find_primary_source_file(directory: &Path) -> Option<PathBuf> {
    let mut candidates = fs::read_dir(directory)
        .ok()?
        .filter_map(|entry| entry.ok().map(|entry| entry.path()))
        .filter(|path| path.is_file())
        .filter(|path| {
            let ext = path
                .extension()
                .and_then(OsStr::to_str)
                .unwrap_or_default()
                .to_ascii_lowercase();
            !matches!(ext.as_str(), "json" | "jpg" | "jpeg" | "png" | "webp" | "part")
        })
        .collect::<Vec<_>>();

    candidates.sort();
    candidates.into_iter().next()
}

fn find_first_thumbnail(directory: &Path) -> Option<PathBuf> {
    let mut candidates = fs::read_dir(directory)
        .ok()?
        .filter_map(|entry| entry.ok().map(|entry| entry.path()))
        .filter(|path| path.is_file())
        .filter(|path| {
            let ext = path
                .extension()
                .and_then(OsStr::to_str)
                .unwrap_or_default()
                .to_ascii_lowercase();
            matches!(ext.as_str(), "jpg" | "jpeg" | "png" | "webp")
        })
        .collect::<Vec<_>>();

    candidates.sort();
    candidates.into_iter().next()
}

```

## `src-tauri/tauri.conf.json`
```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Soniva",
  "version": "0.1.0",
  "identifier": "com.soniva.app",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist",
    "devUrl": "http://localhost:1420"
  },
  "app": {
    "windows": [
      {
        "title": "Soniva",
        "width": 1440,
        "height": 940,
        "resizable": true,
        "fullscreen": false
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": []
  }
}

```

## `tailwind.config.ts`
```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060816",
          900: "#0b1020",
          800: "#11182b",
          700: "#18233b"
        },
        mist: {
          50: "#f7f8fc",
          100: "#eef2fb",
          200: "#d8e0f2",
          300: "#b7c5dd",
          400: "#91a5c3",
          500: "#6d83a5"
        },
        accent: {
          500: "#8b5cf6",
          400: "#a78bfa",
          300: "#c4b5fd"
        },
        mint: {
          400: "#4ade80"
        },
        amber: {
          400: "#fbbf24"
        },
        rose: {
          400: "#fb7185"
        }
      },
      boxShadow: {
        panel: "0 24px 60px rgba(10, 14, 29, 0.35)",
        soft: "0 12px 30px rgba(9, 13, 28, 0.22)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(167,139,250,0.22), transparent 36%), radial-gradient(circle at 70% 20%, rgba(96,165,250,0.18), transparent 26%)"
      }
    }
  },
  plugins: []
};

export default config;

```

## `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "useDefineForClassFields": true,
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "baseUrl": ".",
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

```

## `tsconfig.node.json`
```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts", "drizzle.config.ts"]
}

```

## `vite.config.ts`
```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    target: process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG
  }
});

```
