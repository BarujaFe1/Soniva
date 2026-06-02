<div align="center">
  <img src="./icon.png" alt="Soniva Logo" width="120" height="120" />

  <h1>Soniva</h1>

  <p><strong>Aplicativo desktop local-first para ingestão autorizada de mídia, preservação de metadados e gerenciamento de biblioteca pesquisável</strong></p>
  <p><strong>Local-first desktop app for authorized media ingestion, metadata preservation and searchable library management</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> •
    <a href="#en">English</a> •
    <a href="#stack--tecnologias">Stack</a> •
    <a href="#quick-start--início-rápido">Quick Start</a> •
    <a href="#arquitetura--architecture">Arquitetura</a> •
    <a href="#autor--author">Autor</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Soniva-0.1.0-8b5cf6.svg?style=for-the-badge" alt="Soniva 0.1.0" />
    <img src="https://img.shields.io/badge/Tauri-2.0-24c8db.svg?style=for-the-badge&logo=tauri" alt="Tauri 2.0" />
    <img src="https://img.shields.io/badge/React-18-61dafb.svg?style=for-the-badge&logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?style=for-the-badge&logo=typescript" alt="TypeScript 5.7" />
    <img src="https://img.shields.io/badge/Rust-1.94-ce422b.svg?style=for-the-badge&logo=rust" alt="Rust 1.94" />
    <img src="https://img.shields.io/badge/SQLite-local--first-003B57.svg?style=for-the-badge&logo=sqlite" alt="SQLite Local First" />
  </p>
</div>

---

<a id="pt-br"></a>

## 🇧🇷 PT-BR

## 🎯 Visão geral

**Soniva** é um aplicativo desktop polido, **local-first**, criado para ingestão autorizada de mídia, preservação de metadados e gerenciamento de uma biblioteca pesquisável.

Ele combina uma interface moderna em React com a camada nativa do Tauri/Rust, armazenamento local em SQLite e integração com ferramentas externas como `ffmpeg` e `yt-dlp`, sempre com foco em **conteúdo permitido/autorizado**.

A proposta é oferecer controle total sobre arquivos, metadados, histórico de jobs e organização da biblioteca — sem depender de nuvem, telemetria ou backend externo.

> **Objetivo:** transformar ingestão autorizada de mídia em um fluxo local, organizado, auditável e visualmente elegante.

---

## ✅ Para que o Soniva serve

O Soniva foi pensado para:

- criadores de conteúdo organizando mídia própria ou licenciada;
- profissionais que trabalham com fontes permitidas;
- arquivistas pessoais que valorizam controle local;
- usuários que desejam preservar metadados e histórico de processamento;
- fluxos em que a mídia precisa ser importada, catalogada, convertida e encontrada com facilidade.

## ❌ Para que o Soniva não serve

O Soniva **não** foi criado para:

- downloads não autorizados;
- burla de copyright;
- scraping massivo de mídia;
- contornar restrições de plataformas;
- redistribuição indevida de conteúdo.

A experiência do aplicativo reforça o uso autorizado, inclusive com confirmação explícita antes da ingestão.

---

## ✨ Funcionalidades principais

### 🎬 Dois modos de ingestão

#### Ingestão por URL autorizada

- Consulta de metadados com `yt-dlp`.
- Download de mídia de fontes permitidas.
- Extração de thumbnails.
- Geração de áudio MP3.
- Preservação completa de metadados em sidecars JSON.
- Histórico de execução com logs.

#### Ingestão de arquivo local

- Importação de arquivos existentes.
- Cópia para uma biblioteca gerenciada.
- Extração de áudio com `ffmpeg`.
- Catalogação de coleções locais.
- Funcionamento sem `yt-dlp`.

---

### 🎨 Experiência desktop premium

- Interface dark moderna com sistema visual próprio.
- Preview de thumbnails no inspetor da biblioteca.
- Player de áudio integrado para MP3 extraído.
- Atualizações de progresso em tempo real.
- Toast notifications para feedback não intrusivo.
- Empty states orientativos para o primeiro uso.
- Botões de “abrir no gerenciador de arquivos”.
- Navegação rápida para diretórios e outputs de jobs.

---

### 📚 Gerenciamento de biblioteca

- Busca textual por títulos e metadados.
- Filtros por status: todos, prontos e com falha.
- Atualização em tempo real.
- Inspetor com metadados completos em JSON.
- Caminhos de arquivos, tamanhos, duração e formato.
- Preview de thumbnail e assets de áudio.

---

### 🔄 Histórico e jobs

- Jobs persistidos em SQLite.
- Progresso por etapa.
- Logs detalhados de execução.
- Mensagens de erro com contexto.
- Status visuais para queued, processing, completed e failed.
- Políticas inteligentes de sobrescrita:
  - **skip:** reutiliza itens existentes;
  - **replace:** executa novamente e limpa artefatos antigos.

---

### ⚙️ Configuração inteligente

- Detecção automática de `ffmpeg` e `yt-dlp` no PATH.
- Possibilidade de informar caminhos explícitos dos binários.
- Escolha de diretório raiz da biblioteca.
- Política de sobrescrita configurável.
- Estrutura previsível de arquivos com slugs e IDs curtos.

---

## 🔒 Segurança, privacidade e controle local

- Dados armazenados localmente na máquina do usuário.
- Sem dependência de nuvem.
- Sem telemetria.
- Sem analytics.
- Código transparente.
- Ingestão condicionada à confirmação de autorização.
- Biblioteca organizada em diretório local escolhido pelo usuário.

---

<a id="en"></a>

## 🇺🇸 English

## 🎯 Overview

**Soniva** is a polished, **local-first** desktop application for authorized media ingestion, metadata preservation and searchable library management.

It combines a modern React interface with a native Tauri/Rust layer, local SQLite storage and integrations with external tools such as `ffmpeg` and `yt-dlp`, always focused on **permitted/authorized content**.

The goal is to provide full control over files, metadata, job history and library organization — without relying on cloud infrastructure, telemetry or external backends.

> **Goal:** turn authorized media ingestion into a local, organized, auditable and visually polished workflow.

---

## ✅ What Soniva is for

Soniva is designed for:

- content creators managing owned or licensed media;
- professionals working with permitted sources;
- personal archivists who value local control;
- users who need to preserve metadata and processing history;
- workflows where media must be imported, cataloged, converted and easily searchable.

## ❌ What Soniva is not for

Soniva is **not** intended for:

- unauthorized downloads;
- copyright circumvention;
- mass media scraping;
- bypassing platform restrictions;
- improper redistribution of content.

The application experience reinforces authorized usage, including explicit confirmation before ingestion.

---

## ✨ Key features

### 🎬 Dual ingestion modes

#### Authorized URL ingestion

- Metadata probing with `yt-dlp`.
- Media download from permitted sources.
- Thumbnail extraction.
- MP3 audio generation.
- Complete metadata preservation through JSON sidecars.
- Execution history with logs.

#### Local file ingestion

- Import existing media files.
- Copy files into a managed library.
- Extract audio with `ffmpeg`.
- Catalog local media collections.
- Works without `yt-dlp`.

---

### 🎨 Premium desktop experience

- Modern dark interface with a custom visual system.
- Thumbnail preview in the library inspector.
- Built-in audio player for extracted MP3s.
- Real-time progress updates.
- Toast notifications for non-intrusive feedback.
- Helpful empty states for first-time users.
- “Open in file manager” actions.
- Quick navigation to library directories and job outputs.

---

### 📚 Library management

- Full-text search across titles and metadata.
- Filters by status: all, ready and failed.
- Real-time query updates.
- Inspector with complete JSON metadata.
- File paths, sizes, duration and format information.
- Thumbnail and audio asset previews.

---

### 🔄 Jobs and history

- Jobs persisted in SQLite.
- Stage-by-stage progress.
- Detailed execution logs.
- Contextual error messages.
- Visual statuses for queued, processing, completed and failed.
- Smart overwrite policies:
  - **skip:** reuse existing items;
  - **replace:** run fresh and clean old artifacts.

---

### ⚙️ Smart configuration

- Auto-detection of `ffmpeg` and `yt-dlp` from PATH.
- Optional explicit binary paths.
- Configurable library root directory.
- Configurable overwrite policy.
- Predictable file organization with slugs and short IDs.

---

## 🔒 Security, privacy and local control

- Data stored locally on the user's machine.
- No cloud dependency.
- No telemetry.
- No analytics.
- Transparent source code.
- Ingestion requires explicit authorization confirmation.
- Library organized inside a user-selected local directory.

---

<a id="stack--tecnologias"></a>

## 🛠️ Stack / Tecnologias

### Frontend

- **React 18**
- **TypeScript 5.7**
- **Vite 6**
- **Tailwind CSS 3.4**
- Custom hooks for polling, toast and Tauri bridge

### Desktop / Native layer

- **Tauri 2.0**
- **Rust 1.94**
- Native command handlers
- External process orchestration
- Filesystem management

### Persistence

- **SQLite**
- **Drizzle ORM**
- Local app data directory
- Foreign keys and indexed metadata

### External tools

- **ffmpeg** — audio extraction
- **yt-dlp** — metadata probe and URL ingestion for authorized sources

---

<a id="arquitetura--architecture"></a>

## 🏗️ Arquitetura / Architecture

```txt
User Action
   ↓
React UI
   ↓
Tauri Command
   ↓
Rust Handler
   ↓
SQLite + Filesystem
   ↓
External Process
   ├── yt-dlp
   └── ffmpeg
```

### Data flow

```txt
User Action → React UI → Tauri Command → Rust Handler → SQLite
                                      ↓
                              External Process
                                      ↓
                              Filesystem library_root
```

### Estrutura da biblioteca / Library structure

```txt
library_root/
└── items/
    └── <slug>--<short-id>/
        ├── source/
        │   └── source.<ext>
        ├── audio/
        │   └── track.mp3
        ├── thumbnails/
        │   └── <thumbnail>.jpg
        └── source-metadata.json
```

### Schema resumido / Database schema

```txt
app_settings             # Configuration key-value store
media_sources            # Source URLs or local file paths
media_items              # Cataloged media with metadata
extracted_audio_assets   # Generated MP3 files
thumbnails               # Downloaded or extracted thumbnail images
ingestion_jobs           # Execution history and logs
```

---

## 📁 Estrutura do projeto / Project structure

```txt
soniva/
├── src/                         # React frontend
│   ├── components/              # UI components
│   ├── pages/                   # Overview, Ingest, Library, Jobs, Settings
│   ├── lib/                     # Utilities, Tauri bridge, Drizzle client
│   └── hooks/                   # Polling, toast and UI hooks
├── src-tauri/                   # Rust backend
│   └── src/
│       ├── main.rs              # Tauri commands
│       ├── pipeline.rs          # Ingestion pipeline
│       ├── db.rs                # SQLite operations
│       └── models.rs            # Rust types
├── drizzle/                     # SQL migrations
├── docs/                        # Architecture, runbook and portfolio notes
├── README.md
└── package.json
```

---

<a id="quick-start--início-rápido"></a>

## 🚀 Quick Start / Início rápido

### Pré-requisitos / Prerequisites

Required:

- Node.js 18+
- npm
- Rust stable toolchain
- Cargo
- Tauri prerequisites for your operating system
- `ffmpeg` for audio extraction

Optional:

- `yt-dlp` for authorized URL ingestion

---

### Instalação / Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/soniva.git

# Enter the project
cd soniva

# Install dependencies
npm install
```

On Windows, you may also run the setup script:

```powershell
.\setup.ps1
```

The setup script validates:

- Node.js and npm
- Rust and Cargo
- Tauri prerequisites
- `ffmpeg`
- `yt-dlp`
- WebView2 on Windows

---

### Rodar em desenvolvimento / Run in development

```bash
npm run tauri:dev
```

### Build de produção / Production build

```bash
npm run tauri:build
```

---

## 🧭 First-time setup / Configuração inicial

1. Launch Soniva.
2. Open **Settings**.
3. Choose a **Library Root** directory.
4. Verify `ffmpeg` detection or provide an explicit path.
5. Verify `yt-dlp` detection or provide an explicit path for authorized URL ingestion.
6. Select overwrite policy: **skip** or **replace**.
7. Save settings.
8. Go to **Authorized Ingest** and queue your first job.

---

## 🎬 First ingestion / Primeira ingestão

### Authorized URL

1. Open **Authorized Ingest**.
2. Select **Authorized URL** mode.
3. Paste a permitted URL.
4. Confirm that the content is authorized.
5. Click **Queue Job**.

### Local media file

1. Open **Authorized Ingest**.
2. Select **Local media file** mode.
3. Browse and choose a file.
4. Confirm that the content is authorized.
5. Click **Queue Job**.

---

## 🛠️ Development / Desenvolvimento

### Available scripts / Scripts disponíveis

```bash
npm run dev          # Start Vite dev server
npm run build        # Build frontend
npm run typecheck    # Run TypeScript type checking
npm run tauri:dev    # Run Tauri in development mode
npm run tauri:build  # Build production executable
npm run db:generate  # Generate Drizzle migrations
npm run db:studio    # Open Drizzle Studio
```

### Database inspection / Inspeção do banco

To inspect the runtime database with Drizzle Studio:

```powershell
$env:SONIVA_DB_PATH="C:\Users\YourUser\AppData\Roaming\com.soniva.app\soniva.sqlite"
npm run db:studio
```

---

## 🎨 Design System

Soniva uses a custom Tailwind theme:

- **ink** — deep background tones
- **mist** — foreground and text
- **accent** — primary purple actions
- **mint** — success states
- **amber** — warning states
- **rose** — error states

The visual direction is premium, dark, focused and desktop-first.

---

## 📚 Documentation / Documentação

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — technical architecture and design decisions
- [RUNBOOK.md](docs/RUNBOOK.md) — step-by-step operational guide
- [PORTFOLIO_NOTES.md](docs/PORTFOLIO_NOTES.md) — professional positioning for portfolio/interviews
- [DELIVERY_REPORT.md](docs/DELIVERY_REPORT.md) — implementation summary

---

## 🎓 Why Soniva? / Por que Soniva?

Soniva demonstrates:

- desktop application development with Tauri;
- local-first architecture;
- real process orchestration;
- filesystem management;
- type-safe TypeScript/Rust integration;
- metadata modeling with relational structure;
- polished UI/UX with modern desktop patterns;
- disciplined product scope.

---

## 🗺️ Roadmap

Current:

- MVP with core ingestion, library management and job tracking.

Future considerations:

- Batch ingestion.
- Advanced search and filters.
- Export and backup utilities.
- Keyboard shortcuts.
- Drag and drop support.
- Deeper audio player integration.
- Better media preview options.
- More robust ingestion validation.

---

<a id="autor--author"></a>

## 👤 Autor / Author

Developed by **BarujaFe1**.

- **Portfolio:** [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- **GitHub:** [github.com/BarujaFe1](https://github.com/BarujaFe1/)
- **LinkedIn:** [linkedin.com/in/barujafe](https://www.linkedin.com/in/barujafe/)

---

## 🤝 Contributing / Contribuição

This is a portfolio project, but suggestions and feedback are welcome.

Please open an issue before proposing larger changes.

---

## 📄 License / Licença

MIT License.

See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments / Agradecimentos

- Built with [Tauri](https://tauri.app/)
- Powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp) and [ffmpeg](https://ffmpeg.org/)
- Built with [React](https://react.dev/) and [Rust](https://www.rust-lang.org/)

---

<div align="center">
  <p><strong>Soniva</strong></p>
  <p>Authorized media ingestion, locally.</p>
  <p><em>Ingestão autorizada de mídia, com controle local.</em></p>
</div>
