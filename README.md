<div align="center">
  <img src="./icon.png" alt="Soniva Logo" width="120" height="120" />

  <h1>Soniva</h1>

  <p><strong>Desktop local-first (Tauri/React/SQLite) para ingestão autorizada de mídia, metadados e biblioteca pesquisável.</strong></p>
  <p><strong>Local-first desktop app (Tauri/React/SQLite) for authorized media ingestion, metadata and a searchable library.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a>
     · 
    <a href="#english">English</a>
     · 
    <a href="#stack">Stack</a>
     · 
    <a href="#architecture">Architecture</a>
     · 
    <a href="#quick-start">Quick Start</a>
     · 
    <a href="#author">Author</a>
  </p>

  <p>
    <img alt="Tauri-2" src="https://img.shields.io/badge/Tauri-2-24C8DB?style=for-the-badge&logo=tauri&logoColor=white" />
    <img alt="React-18" src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
    <img alt="Rust" src="https://img.shields.io/badge/Rust-CE422B?style=for-the-badge&logo=rust&logoColor=white" />
    <img alt="SQLite" src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
    <img alt="License-MIT" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
  </p>

  <p>
    <a href="https://github.com/BarujaFe1/Soniva"><strong>Repo</strong></a>
     · 
    <a href="https://barujafe.vercel.app/"><strong>Portfolio</strong></a>
     · 
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>


> **Local-first / legal notice:** Soniva is for **authorized** media you have rights to process. It is not a pirate downloader. GitHub homepage points at README quick-start (no separate public SaaS demo). Vite UI can run for UI review; full capabilities need the Tauri desktop shell + tools like ffmpeg/yt-dlp when configured.

---

## PT-BR

### Visão geral
O **Soniva** é um app desktop local-first para ingestão autorizada, preservação de metadados, jobs/histórico e biblioteca pesquisável — com UI React/Vite e camada nativa Tauri/Rust + SQLite (Drizzle).

### Problema
Acervos pessoais de mídia ficam espalhados, sem metadados consistentes nem histórico de jobs — e ferramentas inadequadas empurram fluxos juridicamente duvidosos.

### Para quem
Usuários que precisam organizar mídia **com autorização** em um fluxo desktop local, com busca e trilha de jobs.

### Funcionalidades
- Modos de ingestão documentados no app (autorizados)
- Biblioteca pesquisável e preservação de metadados
- Jobs / histórico e configuração local
- Stack Tauri 2 + React + Drizzle/SQLite
- Ferramentas externas opcionais (ffmpeg / yt-dlp) quando instaladas e permitidas

### Escopo e limites (honestos)
- **Não** é serviço cloud de streaming nem facilitador de pirataria
- Demo web in-memory/UI ≠ parity completa com desktop
- Depende de permissões do SO e binários externos quando usados

---

## English

### Overview
**Soniva** is a local-first desktop app for authorized ingestion, metadata preservation, jobs/history and a searchable library — React/Vite UI plus Tauri/Rust + SQLite (Drizzle).

### Problem
Personal media libraries sprawl without consistent metadata or job history — and the wrong tools encourage legally dubious workflows.

### Who it is for
Users who need to organize **authorized** media in a local desktop flow with search and job trails.

### Features
- Documented authorized ingestion modes
- Searchable library and metadata preservation
- Jobs / history and local configuration
- Tauri 2 + React + Drizzle/SQLite
- Optional external tools (ffmpeg / yt-dlp) when installed and permitted

### Scope and honest limits
- **Not** a cloud streaming service or piracy helper
- In-memory/UI web review ≠ full desktop parity
- Depends on OS permissions and external binaries when used

---

## Stack

| Layer | Technology |
|---|---|
| UI | React 18, TypeScript, Vite, Tailwind |
| Desktop | Tauri 2, Rust |
| Data | SQLite + Drizzle ORM |

---

## Architecture

```txt
src/           React UI
src-tauri/     Rust/Tauri commands
drizzle/       SQL schema
```

---

## Quick Start

```bash
npm install
npm run dev          # Vite UI
# Tauri desktop: use the package scripts for tauri dev (Rust toolchain required)
```

See `COMECE_AQUI.md` / `INICIO_RAPIDO.md` for longer runbooks.

---

## Technical decisions

- **Local-first SQLite** to keep libraries on-device
- **Tauri** for a thin native shell vs a heavy Electron default
- Explicit **authorization** framing in product docs

---

## Roadmap

- UX polish for large libraries
- Stronger metadata validators
- Clearer first-run checks for external tools

---

## Author

**Felipe Alirio Baruja** — data / product / full-stack portfolio.

- Portfolio: [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- GitHub: [https://github.com/BarujaFe1](https://github.com/BarujaFe1)
- LinkedIn: [https://www.linkedin.com/in/barujafe/](https://www.linkedin.com/in/barujafe/)


## License

MIT — see [`LICENSE`](./LICENSE).
