# Soniva

> A refined desktop application for authorized media ingestion, audio extraction, metadata preservation, and local library organization.

<p align="left">
  <img alt="Status" src="https://img.shields.io/badge/status-in%20development-111111?style=flat-square">
  <img alt="Version" src="https://img.shields.io/badge/version-v0.1.0--alpha-1f2937?style=flat-square">
  <img alt="Platform" src="https://img.shields.io/badge/platform-desktop-0f766e?style=flat-square">
  <img alt="Stack" src="https://img.shields.io/badge/stack-Tauri%20%2B%20React%20%2B%20TypeScript-2563eb?style=flat-square">
  <img alt="Database" src="https://img.shields.io/badge/database-SQLite-6b7280?style=flat-square">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-e5e7eb?style=flat-square&color=374151">
</p>

---

## Table of contents

- [Overview](#overview)
- [Why Soniva exists](#why-soniva-exists)
- [The problem](#the-problem)
- [The solution](#the-solution)
- [Product positioning](#product-positioning)
- [Who this is for](#who-this-is-for)
- [What the MVP includes](#what-the-mvp-includes)
- [What is intentionally out of scope](#what-is-intentionally-out-of-scope)
- [Architecture at a glance](#architecture-at-a-glance)
- [Planned stack](#planned-stack)
- [Repository structure](#repository-structure)
- [Current project status](#current-project-status)
- [Getting started](#getting-started)
- [Development principles](#development-principles)
- [Roadmap](#roadmap)
- [Documentation](#documentation)
- [Demo direction](#demo-direction)
- [What this project is meant to prove](#what-this-project-is-meant-to-prove)
- [Responsible use](#responsible-use)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**Soniva** is a desktop-first application designed to turn fragmented media handling into a structured, reliable, and elegant local workflow.

At its core, Soniva helps users ingest authorized media, extract audio when appropriate, preserve useful metadata, store thumbnails, and organize everything into a searchable local library. Instead of depending on scattered scripts, one-off commands, and inconsistent folders, the user interacts with a product that treats media organization as a first-class workflow.

This project is being built as a **real software product**, not as a loose utility. That distinction is central to both its technical design and its value as a portfolio project.

---

## Why Soniva exists

There is a familiar pattern in many media workflows: one tool fetches content, another converts it, another renames files, another moves folders around, and none of them provide a coherent user experience. The process technically works, but it is often fragile, repetitive, and unpleasant.

Soniva exists to solve that gap.

The goal is to provide a calm, well-structured interface for handling **authorized, owned, free, or licensed content** in a way that is operationally useful and professionally presentable. The emphasis is not on “downloading the internet.” The emphasis is on transforming a messy technical workflow into a polished local media pipeline.

For that reason, Soniva is as much about **product quality** as it is about functionality.

---

## The problem

People who regularly manage audio or media files often run into the same issues:

- files are saved in random places;
- folder structures become inconsistent over time;
- thumbnails are lost;
- filenames are messy or duplicated;
- metadata is incomplete or not normalized;
- playlist imports create disorder instead of structure;
- command-line tools are powerful, but not cohesive or user-friendly.

This becomes even more painful when the workflow is repeated often. A technically capable user can piece tools together, but the resulting process still lacks clarity, durability, and a proper interface.

That gap is exactly where Soniva lives.

---

## The solution

Soniva proposes a simple but strong local workflow:

1. The user submits a valid media URL.
2. The application validates the input and prepares a processing job.
3. The user selects an output mode, with emphasis on audio extraction.
4. The application runs the job locally.
5. The result is stored with:
   - predictable file organization,
   - preserved metadata,
   - associated thumbnail,
   - job history,
   - searchable library entry.
6. The user can later browse, inspect, and access imported content through a clean local interface.

This is intentionally not a bloated vision. The promise is narrow and useful:  
**take authorized media input and turn it into a structured local library with a refined user experience.**

---

## Product positioning

Soniva is positioned as a **desktop media organizer for legitimate, authorized workflows**.

That means the project should be understood as:

- a local-first productivity tool;
- a structured ingestion and organization system;
- a metadata-aware media utility;
- a portfolio-grade example of software and product thinking.

It should **not** be understood as:

- a piracy-oriented utility;
- a generic “download anything” app;
- a growth-hacked media scraper;
- a flashy interface masking weak fundamentals.

The quality of the positioning matters. It affects how the project is perceived publicly, how responsibly it can be presented, and how credible it feels in a professional portfolio.

---

## Who this is for

### Primary users

Soniva is primarily intended for people who need to organize authorized media inputs repeatedly and want a cleaner local workflow.

Examples include:

- students organizing educational material they are permitted to keep;
- researchers archiving media for legitimate study workflows;
- creators handling their own published content;
- technical users who prefer a proper product over a set of manual scripts;
- people maintaining a curated local audio library from authorized sources.

### Secondary users

There is also an important secondary audience:

- recruiters evaluating software maturity;
- hiring managers reviewing product judgment;
- peers looking at repository quality;
- collaborators interested in architecture, UX, and developer discipline.

This matters because Soniva is not only a tool. It is also a public demonstration of how a workflow can be framed, scoped, designed, and documented responsibly.

---

## What the MVP includes

The first version should be strong, not broad.

### Core V1 capabilities

- URL input for a supported media source
- input validation
- media processing job creation
- audio-first output workflow
- local job execution
- progress and state feedback
- local file organization
- metadata persistence
- thumbnail storage
- job history
- searchable local library
- open file / open folder actions

### Why this is enough

This scope is narrow enough to finish, but rich enough to demonstrate:

- product design;
- local architecture;
- persistence and file handling;
- integration with external tools;
- thoughtful UX;
- responsible project framing.

That is exactly the right balance for a strong MVP.

---

## What is intentionally out of scope

The following ideas are explicitly **not part of V1**:

- cloud sync
- user accounts
- remote backend infrastructure
- browser extension
- mobile app
- social sharing
- recommendation features
- large plugin system
- multi-device sync
- advanced analytics dashboards
- team collaboration
- AI-assisted media enrichment
- enterprise-style permissions or roles

These ideas are not “bad,” but they are bad **now**. They inflate scope, delay a usable release, and weaken the project’s chances of becoming a finished, polished artifact.

---

## Architecture at a glance

Soniva is planned as a local-first desktop application with clear boundaries between interface, orchestration, persistence, and media processing.

### Frontend
A React-based UI will handle:

- user input;
- navigation;
- queue display;
- library browsing;
- state communication;
- settings management.

### Desktop shell
Tauri will provide:

- native desktop packaging;
- safe local integration points;
- process invocation;
- app-level file system interaction.

### Persistence
SQLite will store structured information such as:

- imported media records;
- job history;
- source references;
- normalized paths;
- metadata snapshots;
- local settings.

### Processing layer
A lean orchestration layer will:

- validate requests;
- invoke local processing tools;
- capture relevant metadata;
- update job state;
- persist the final result.

### Scope decision
A standalone web backend is **not necessary** for the MVP. If a backend-like layer is needed, it should stay local and minimal.

---

## Planned stack

The planned stack is deliberately pragmatic.

### Application
- **Tauri**
- **React**
- **TypeScript**

### UI
- **Tailwind CSS**
- **Lucide Icons**
- lightweight custom component patterns

### Persistence
- **SQLite**
- **Drizzle ORM**

### Processing tools
- **yt-dlp**
- **ffmpeg**

### Supporting philosophy
- local-first
- simple architecture
- no unnecessary infra
- no artificial service split

This is the kind of stack that keeps the project strong without making it fragile.

---

## Repository structure

```text
soniva/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── package.json
├── docs/
│   ├── product-requirements.md
│   ├── architecture.md
│   ├── roadmap.md
│   ├── data-model.md
│   ├── api-contract.md
│   ├── demo-script.md
│   └── case-study-draft.md
├── apps/
│   └── desktop/
│       ├── src/
│       ├── src-tauri/
│       └── package.json
├── packages/
│   ├── ui/
│   ├── core/
│   └── config/
├── data/
│   ├── samples/
│   └── seeds/
├── scripts/
├── tests/
└── .github/
    ├── workflows/
    ├── ISSUE_TEMPLATE/
    └── pull_request_template.md
```

This structure reflects an important project philosophy:  
documentation, code, and project operations should be legible from the beginning.

---

## Current project status

**Current stage:** planning and repository foundation

At this moment, the project is focused on:

- defining a strong product boundary;
- documenting architecture decisions;
- organizing repository structure;
- preparing implementation-ready project materials;
- protecting the scope of the MVP before heavy coding begins.

This is intentional. A clean first build starts long before the first “real feature” is implemented.

---

## Getting started

> The setup instructions below are intentionally honest: they describe the expected direction of the project, not a fake promise of complete readiness before the implementation exists.

### Expected prerequisites

- Node.js
- pnpm or npm
- Rust toolchain
- SQLite
- `ffmpeg` installed locally
- `yt-dlp` installed locally

### Clone the repository

```bash
git clone https://github.com/your-username/soniva.git
cd soniva
```

### Install dependencies

```bash
pnpm install
```

### Start development

```bash
pnpm dev
```

### Environment setup

```bash
cp .env.example .env
```

As the project evolves, this section will be updated with concrete platform-specific setup instructions and tool path configuration details.

---

## Development principles

Soniva follows a few explicit development rules:

- prioritize a finishable MVP over a grand platform;
- prefer clarity over cleverness;
- avoid premature architecture complexity;
- document decisions early;
- treat repository quality as part of the product;
- design for demonstration, not only implementation;
- keep product positioning responsible and professional.

These principles are not decorative. They are part of how the project is kept credible.

---

## Roadmap

### Phase 0 — Foundation
- project naming
- positioning
- README
- PRD
- architecture notes
- issue planning
- repository setup

### Phase 1 — Technical baseline
- bootstrap desktop app
- configure UI stack
- define initial schema
- create navigation shell
- configure persistence foundation

### Phase 2 — Core import workflow
- URL input
- validation
- job creation
- local processing orchestration
- file organization
- metadata capture
- history persistence

### Phase 3 — Library MVP
- local collection listing
- search
- thumbnail display
- item inspection
- open file / folder actions

### Phase 4 — Product polish
- loading, empty, and error states
- UX refinement
- design polish
- screenshots
- demo flow

### Phase 5 — Public release preparation
- documentation cleanup
- stable screenshots
- short demo video
- portfolio narrative
- LinkedIn-ready launch material

---

## Documentation

The repository is intended to include supporting documents such as:

- `docs/product-requirements.md`
- `docs/architecture.md`
- `docs/roadmap.md`
- `docs/data-model.md`
- `docs/api-contract.md`
- `docs/demo-script.md`
- `docs/case-study-draft.md`

The purpose of this documentation is simple:  
make the project understandable as a product, not only as a codebase.

---

## Demo direction

A good public demo of Soniva should show a complete and believable workflow.

### Screens that matter most

- import screen
- active queue
- completed job state
- library view
- item detail / metadata view
- settings screen

### Screenshots the project will eventually need

- polished landing screenshot of the main interface
- queue screen with active and completed jobs
- library screen with thumbnails and search
- settings screen with output organization rules
- dark mode screenshot, if included

### Short demo video concept

A 30–60 second demo should show:

1. paste URL  
2. choose output mode  
3. run job  
4. observe processing state  
5. inspect imported item  
6. open organized output locally

That is enough to tell a clear story.

---

## What this project is meant to prove

Soniva is a portfolio project, but it should not feel like a fake one.

It is meant to demonstrate that I can:

- turn a messy workflow into a coherent product;
- make disciplined scope decisions;
- design a local-first architecture;
- implement a clean desktop interface;
- model metadata and data flow thoughtfully;
- build with maintainability in mind;
- document software professionally;
- present technical work with clarity and restraint.

It also reflects adjacent strengths relevant to **Statistics and Data Science**, especially in:

- information modeling;
- metadata structure;
- data quality thinking;
- local pipeline reliability;
- systematized handling of content records.

---

## Responsible use

Soniva is intended for **authorized** workflows.

That includes content that is:

- owned by the user;
- explicitly permitted for processing;
- freely licensed;
- otherwise legitimately usable within the user’s context.

The project should be documented and presented in a way that reinforces this positioning consistently. This is not only a legal or ethical consideration; it is also a product-quality and portfolio-quality decision.

---

## Contributing

This repository is currently structured as a personal, portfolio-driven project under active development.

If contribution workflows become relevant, they will be documented through:

- `CONTRIBUTING.md`
- issue templates
- pull request template
- architecture notes
- release notes

For now, the primary goal is to build a strong, coherent first version.

---

## License

This project is expected to be released under the **MIT License**, unless future constraints require a different choice.

See `LICENSE` for details.

---

## Links

- Repository: `https://github.com/your-username/soniva`
- Issues: `https://github.com/your-username/soniva/issues`
- Projects: `https://github.com/your-username/soniva/projects`
- Portfolio page: `[coming soon]`
- Demo video: `[coming soon]`

---

## Closing note

Soniva is being built with a very specific ambition:

not to become the biggest possible project,  
but to become a **finished, elegant, technically coherent, publicly credible** one.

That is the standard that matters here.
