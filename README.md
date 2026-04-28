# Soniva

<div align="center">

![Soniva](https://img.shields.io/badge/Soniva-0.1.0-8b5cf6?style=for-the-badge)
![Tauri](https://img.shields.io/badge/Tauri-2.0-24c8db?style=for-the-badge&logo=tauri)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript)
![Rust](https://img.shields.io/badge/Rust-1.94-ce422b?style=for-the-badge&logo=rust)

**A desktop-first, local-first application for authorized media ingestion, metadata preservation, and searchable library management.**

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Documentation](#documentation)

</div>

---

## 🎯 What is Soniva?

Soniva is a **polished desktop application** for managing authorized media with complete local control. It combines the power of `yt-dlp` and `ffmpeg` with an elegant React interface to provide:

- **Authorized URL ingestion** - Download media from permitted sources with full metadata preservation
- **Local file ingestion** - Import existing media files into your managed library
- **Audio extraction** - Automatic MP3 extraction with configurable quality
- **Metadata preservation** - Complete metadata capture and searchable catalog
- **Overwrite policies** - Smart duplicate handling (skip or replace)
- **Job tracking** - Persistent execution history with detailed logs
- **Local-first** - All data stored locally in SQLite, no cloud dependencies

## ✨ Features

### 🎬 Dual Ingestion Modes

**URL Ingestion:**
- Probe metadata with yt-dlp
- Download source media
- Extract thumbnails
- Generate MP3 audio
- Preserve all metadata in JSON sidecars

**Local File Ingestion:**
- Copy files into managed library
- Extract audio without requiring yt-dlp
- Catalog local media collections

### 🎨 Rich User Experience

**Visual Media Preview:**
- Thumbnail preview in library inspector
- Built-in audio player for extracted MP3s
- Inline media playback without leaving the app

**Smart Notifications:**
- Toast notifications for all actions
- Success/error feedback with auto-dismiss
- Non-intrusive status updates

**File System Integration:**
- "Open in File Manager" buttons
- Quick access to library directories
- Direct navigation to job outputs

### 📊 Library Management

**Search & Filter:**
- Full-text search across titles and metadata
- Filter by status (all/ready/failed)
- Real-time query updates

**Detail Inspector:**
- Complete metadata JSON viewer
- File paths and sizes
- Duration and format information
- Thumbnail and audio asset preview

### 🔄 Job Tracking

**Persistent History:**
- All jobs saved to SQLite
- Detailed progress tracking
- Stage-by-stage execution logs
- Error messages with context

**Smart Overwrite:**
- Skip: Reuse existing items
- Replace: Fresh run with cleanup of old artifacts

### 🎯 Local-First Architecture

- SQLite database in app data directory
- No cloud dependencies
- Complete offline functionality
- Full data ownership

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Rust** stable toolchain
- **Cargo** (comes with Rust)
- **ffmpeg** (required for all ingestion)
- **yt-dlp** (required for URL ingestion only)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/soniva.git
cd soniva

# Install dependencies
npm install

# Run in development mode
npm run tauri:dev
```

### First Run Setup

1. Launch Soniva
2. Navigate to **Settings**
3. Choose a **Library Root** directory
4. Verify **ffmpeg** detection (or provide explicit path)
5. Verify **yt-dlp** detection (or provide explicit path for URL ingestion)
6. Select **Overwrite Policy** (skip or replace)
7. Click **Save Settings**

### Your First Ingestion

**For URL:**
1. Go to **Authorized Ingest**
2. Select "Authorized URL" mode
3. Paste a permitted URL
4. Check "I confirm this is authorized content"
5. Click **Queue Job**

**For Local File:**
1. Go to **Authorized Ingest**
2. Select "Local media file" mode
3. Click **Browse** and choose a file
4. Check authorization
5. Click **Queue Job**

## 🏗️ Architecture

### Stack

- **Frontend:** React 18 + TypeScript 5.7 + Tailwind CSS 3.4
- **Desktop Shell:** Tauri 2.0
- **Backend:** Rust (edition 2021)
- **Database:** SQLite with Drizzle ORM
- **External Tools:** yt-dlp, ffmpeg

### Data Flow

```
User Action → React UI → Tauri Command → Rust Handler → SQLite
                                      ↓
                              External Process (yt-dlp/ffmpeg)
                                      ↓
                              Filesystem (library_root)
```

### Library Structure

```
library_root/
  items/
    <slug>--<short-id>/
      source/
        source.<ext>
      audio/
        track.mp3
      thumbnails/
        <thumbnail>.jpg
      source-metadata.json
```

## 📚 Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical architecture and design decisions
- [RUNBOOK.md](docs/RUNBOOK.md) - Step-by-step operational guide
- [PORTFOLIO_NOTES.md](docs/PORTFOLIO_NOTES.md) - Positioning for portfolio/interviews
- [DELIVERY_REPORT.md](docs/DELIVERY_REPORT.md) - Implementation summary

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build frontend
npm run typecheck    # Run TypeScript type checking
npm run tauri:dev    # Run Tauri in development mode
npm run tauri:build  # Build production executable
npm run db:generate  # Generate Drizzle migrations
npm run db:studio    # Open Drizzle Studio (requires SONIVA_DB_PATH)
```

### Type Safety

All TypeScript code is strictly typed. Run `npm run typecheck` before committing.

### Database Inspection

To inspect the runtime database with Drizzle Studio:

```bash
# First, run the app and note the database path shown in Settings
# Then set the environment variable and run studio
$env:SONIVA_DB_PATH="C:\Users\YourUser\AppData\Roaming\com.soniva.app\soniva.sqlite"
npm run db:studio
```

## 🎨 Design System

Soniva uses a custom Tailwind theme with:

- **ink** - Deep background tones (950-700)
- **mist** - Foreground and text (50-500)
- **accent** - Primary actions (purple, 300-500)
- **mint** - Success states (400)
- **amber** - Warning states (400)
- **rose** - Error states (400)

## 🤝 Contributing

This is a portfolio project demonstrating:
- Desktop application development with Tauri
- Local-first architecture
- Process orchestration and filesystem management
- Type-safe full-stack TypeScript/Rust integration
- Polished UI/UX with modern design patterns

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🙏 Acknowledgments

- Built with [Tauri](https://tauri.app/)
- Powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp) and [ffmpeg](https://ffmpeg.org/)
- UI components inspired by modern design systems

---

<div align="center">

**Soniva** - Authorized media ingestion, locally.

Made with ❤️ for local-first workflows

</div>brary
- Extract audio with ffmpeg
- Catalog with searchable metadata
- No yt-dlp required

### 🎨 Elegant Desktop UI

- **Modern design system** - Dark theme with custom Tailwind palette
- **Real-time updates** - Live job progress and library refresh
- **Detailed inspection** - Full metadata and file path visibility
- **Toast notifications** - Non-intrusive feedback for all actions
- **Empty states** - Helpful guidance when getting started

### 🔧 Smart Configuration

- **Binary detection** - Auto-detect yt-dlp and ffmpeg from PATH
- **Flexible paths** - Override with explicit binary locations
- **Overwrite policies** - Choose between skip (reuse) or replace (refresh)
- **Library organization** - Predictable directory structure with slugs

### 📊 Job Management

- **Persistent history** - All jobs saved to SQLite
- **Progress tracking** - Stage-by-stage execution visibility
- **Error handling** - Detailed error messages and log excerpts
- **Status badges** - Visual indicators for queued/processing/completed/failed

## 🚀 Quick Start

### Prerequisites

**Required:**
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (stable toolchain)
- [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) for your OS
- [ffmpeg](https://ffmpeg.org/download.html) (for audio extraction)

**Optional:**
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (for URL ingestion only)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/soniva.git
cd soniva

# Run setup script (validates prerequisites and installs dependencies)
# Windows:
.\setup.ps1

# Or manually:
npm install
```

### Running the App

```bash
# Development mode
npm run tauri:dev

# Build for production
npm run tauri:build
```

### First-Time Setup

1. **Launch Soniva** - The app will open to the Overview page
2. **Open Settings** - Click Settings in the sidebar
3. **Configure library root** - Choose a directory for your managed library
4. **Detect binaries** - Click "Detect" for yt-dlp and ffmpeg (or provide explicit paths)
5. **Choose overwrite policy** - Select "skip" or "replace"
6. **Save settings** - You're ready to ingest!

## 🏗️ Architecture

### Stack

**Frontend:**
- React 18 + TypeScript 5.7
- Vite 6 (build tool)
- Tailwind CSS 3.4 (styling)
- Drizzle ORM (SQLite queries)

**Backend:**
- Tauri 2.0 (desktop shell)
- Rust 1.94 (native layer)
- SQLite (local persistence)

**External Tools:**
- yt-dlp (metadata probe & download)
- ffmpeg (audio extraction)

### Project Structure

```
soniva/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Main pages (Overview, Ingest, Library, Jobs, Settings)
│   ├── lib/               # Utilities, Tauri bridge, Drizzle client
│   └── hooks/             # React hooks (polling, toast)
├── src-tauri/             # Rust backend
│   └── src/
│       ├── main.rs        # Tauri commands
│       ├── pipeline.rs    # Ingestion pipeline (862 lines)
│       ├── db.rs          # SQLite operations
│       └── models.rs      # Rust types
├── drizzle/               # SQL migrations
└── docs/                  # Architecture, runbook, portfolio notes
```

### Database Schema

5 tables with foreign keys:
- `app_settings` - Configuration key-value store
- `media_sources` - Source URLs or file paths
- `media_items` - Cataloged media with metadata
- `extracted_audio_assets` - Generated MP3 files
- `thumbnails` - Downloaded thumbnail images
- `ingestion_jobs` - Execution history with logs

## 📖 Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Detailed architecture and design decisions
- **[RUNBOOK.md](docs/RUNBOOK.md)** - Step-by-step execution guide
- **[PORTFOLIO_NOTES.md](docs/PORTFOLIO_NOTES.md)** - Professional framing for interviews

## 🎓 Why Soniva?

Soniva demonstrates:

✅ **Product discipline** - Clear scope, no feature creep  
✅ **Desktop systems integration** - Real process execution, filesystem management  
✅ **Elegant UX** - Polished interface with attention to detail  
✅ **Local-first architecture** - SQLite, no backend infrastructure  
✅ **Professional code quality** - Clean separation, consistent naming, proper error handling  
✅ **Metadata modeling** - Structured data with foreign keys and indexes  

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start Vite dev server
npm run build        # Build frontend (TypeScript + Vite)
npm run typecheck    # Validate TypeScript
npm run tauri:dev    # Run Tauri in development mode
npm run tauri:build  # Build production executable
npm run db:studio    # Open Drizzle Studio (requires SONIVA_DB_PATH)
```

### Validation Script

Run `.\setup.ps1` (Windows) to validate all prerequisites:
- Node.js, npm, Rust, Cargo
- yt-dlp, ffmpeg
- WebView2 (Windows)

## 🔒 Security & Privacy

- **Local-first** - All data stored on your machine
- **No telemetry** - No tracking or analytics
- **Authorized only** - Explicit checkbox required for all ingestion
- **Transparent** - Full source code visibility

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

## 🤝 Contributing

This is a portfolio project, but suggestions and feedback are welcome! Please open an issue to discuss proposed changes.

## 💡 Positioning

Soniva is designed for:
- Content creators managing authorized media
- Personal archivists organizing licensed content
- Professionals working with permitted sources
- Anyone who values local control over their media library

**Not intended for:**
- Unauthorized downloads
- Copyright circumvention
- Mass media scraping

## 🎯 Roadmap

**Current:** MVP with core ingestion, library, and job tracking

**Future considerations:**
- Batch ingestion
- Advanced search and filters
- Export/backup utilities
- Keyboard shortcuts
- Drag & drop support
- Audio player integration

---

<div align="center">

**Built with** [Tauri](https://tauri.app/) • [React](https://react.dev/) • [Rust](https://www.rust-lang.org/)

Made with ❤️ for local-first media management

</div>
