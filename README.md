<div align="center">
  <img src="./icon.png" alt="Soniva" width="96" height="96" />

  <h1>Soniva</h1>
  <p><strong>Ingestão autorizada de mídia, local-first — metadados preservados, biblioteca pesquisável, zero nuvem.</strong></p>
  <p><em>Local-first desktop app for authorized media ingestion, metadata preservation, and a searchable library.</em></p>

  <p>
    <img src="https://img.shields.io/badge/version-0.1.0-0f766e?style=flat-square" alt="0.1.0" />
    <img src="https://img.shields.io/badge/Tauri-2-24c8db?style=flat-square&logo=tauri" alt="Tauri" />
    <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/SQLite-local--first-003B57?style=flat-square&logo=sqlite" alt="SQLite" />
  </p>
</div>

---

## Screenshot / demo

> **Placeholder:** adicione capturas reais em `docs/screenshots/` (Overview, Ingest, Library).
>
> Enquanto isso, rode a **demo web** (`npm run dev`) e use **Carregar dados de demonstração**, ou o app desktop (`npm run tauri:dev`).

```text
┌──────────────────────────────────────────────────────────┐
│  Soniva · Demo web · [Carregar dados de demonstração]    │
├────────────┬─────────────────────────────────────────────┤
│ Visão geral│  Métricas · jobs recentes · ambiente        │
│ Ingestão   │  URL autorizada | arquivo local             │
│ Biblioteca │  busca · filtros · inspetor · preview       │
│ Jobs       │  progresso · logs · falhas explícitas       │
│ Ajustes    │  library root · ffmpeg · yt-dlp · policy    │
└────────────┴─────────────────────────────────────────────┘
```

---

## Problema real

Criadores e arquivistas pessoais precisam **importar mídia que têm direito de usar**, extrair áudio, preservar metadados e encontrar tudo depois — sem mandar arquivos para a nuvem e sem misturar isso com downloaders abusivos.

Ferramentas CLI (`yt-dlp`, `ffmpeg`) resolvem o processamento, mas não oferecem:

- biblioteca pesquisável com histórico;
- jobs auditáveis;
- UI que reforça uso autorizado;
- organização previsível de pastas e sidecars.

## Solução

**Soniva** empacota esse fluxo em um app desktop polido (Tauri + React) com:

1. ingestão por URL autorizada ou arquivo local;
2. pipeline local com progresso e logs;
3. catálogo SQLite + filesystem;
4. settings com detecção de binários;
5. demo web para walkthrough de portfólio sem instalar a toolchain completa.

## Principais funcionalidades

- Dois modos de ingestão (URL / arquivo local) com requisitos distintos.
- Confirmação explícita de autorização antes de enfileirar.
- Jobs persistidos: queued → processing → completed / failed.
- Biblioteca com busca, filtros e inspetor de metadados JSON.
- Preview de thumbnail/áudio no desktop via `convertFileSrc`.
- Políticas `skip` / `replace` com confirmação na UI.
- Modo demo web com dados fictícios realistas.

## Arquitetura

Ver detalhe em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

```text
React UI  →  tauri.ts façade  →  Rust commands + SQLite + ffmpeg/yt-dlp
                 └─ browser → webStore (demo)
```

## Stack

| Camada | Tecnologia |
|---|---|
| UI | React 18, TypeScript, Vite 6, Tailwind |
| Desktop | Tauri 2, Rust, rusqlite |
| Dados | SQLite, Drizzle (leituras tipadas) |
| Externos | ffmpeg, yt-dlp |
| Demo / CI | Vitest, GitHub Actions, Vercel-ready |

## Demo local

### Opção A — Demo web (mais rápida para recrutadores)

```bash
git clone https://github.com/BarujaFe1/Soniva.git
cd Soniva
npm install
npm run dev
```

Abra `http://localhost:1420` → **Carregar dados de demonstração**.

### Opção B — App desktop (produto real)

```bash
npm install
npm run tauri:dev
```

Requer Rust + ffmpeg + yt-dlp.

## Comandos

| Comando | Descrição |
|---|---|
| `npm run dev` | Vite (demo web) |
| `npm run build` | Build produção web |
| `npm run typecheck` / `npm run lint` | TypeScript |
| `npm run test` | Vitest |
| `npm run ci` | typecheck + test + build |
| `npm run tauri:dev` | Desktop dev |
| `npm run tauri:build` | Instaladores desktop |

## Variáveis de ambiente

Arquivo modelo: [`.env.example`](.env.example).

| Variável | Obrigatória? | Uso |
|---|---|---|
| `SONIVA_DB_PATH` | Não | Path SQLite para `drizzle-kit studio` |

O app desktop **não** depende de secrets cloud.

## Testes

```bash
npm run test
```

Cobertura atual: utils + store da demo web (autorização, overwrite policy, métricas). Detalhes em [`docs/TESTING.md`](docs/TESTING.md).

## Decisões técnicas e trade-offs

- **Tauri vs Electron:** footprint e Rust para pipeline local.
- **Demo web vs só desktop:** honestidade de portfólio sem fingir downloads reais.
- **MP3-only no V1:** menos superfície, schema pronto para crescer.

Mais em [`docs/TECHNICAL_DECISIONS.md`](docs/TECHNICAL_DECISIONS.md).

## Roadmap

- [ ] Screenshots e short demo video no README
- [ ] Contagens SQL agregadas para métricas
- [ ] CSP / asset scopes mais estreitos
- [ ] Testes de integração Rust com fixtures
- [ ] Mais formatos de áudio além de MP3

## Status atual

**v0.1.0 — portfolio-ready MVP**

- Desktop: pipeline local funcional (com binários instalados).
- Web: demo interativa com dados de demonstração.
- CI: typecheck + test + build na GitHub Actions.
- Documentação consolidada em `docs/`.

## O que este projeto demonstra

- Produto local-first com framing ético claro.
- Full-stack desktop: React + Rust + SQLite + subprocessos.
- DX e portfólio: demo web, CI, README e handoff profissionais.
- Atenção a estados reais (loading, empty, error, confirmações destrutivas).
- Capacidade de auditar, corrigir bugs e elevar qualidade pública.

## Como eu apresentaria em entrevista

1. **Problema:** “CLI tools resolvem encode/download, mas não dão biblioteca auditável e UX responsável.”
2. **Tese:** “Local-first + autorização explícita + jobs observáveis.”
3. **Demo (2 min):** carregar dados web → Overview → Library → Jobs (incl. falha) → Settings → Ingest simulado.
4. **Desktop (se houver tempo):** mostrar detecção de binários e um job real curto.
5. **Trade-offs:** por que Tauri, por que demo web separada, o que falta no roadmap.
6. **Prova de engenharia:** apontar CI, testes do `webStore`, e o fix de `overwritePolicy` no bootstrap.

## Documentação

| Doc | Conteúdo |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Camadas e contratos |
| [`docs/TECHNICAL_DECISIONS.md`](docs/TECHNICAL_DECISIONS.md) | ADRs / trade-offs |
| [`docs/TESTING.md`](docs/TESTING.md) | Estratégia de testes |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Vercel + Tauri |
| [`docs/AUDIT_REPORT.md`](docs/AUDIT_REPORT.md) | Auditoria desta pass |
| [`docs/HANDOFF.md`](docs/HANDOFF.md) | Entrega / próximos passos |
| [`docs/RUNBOOK.md`](docs/RUNBOOK.md) | Operação local |

## Autor

**Felipe Alirio Baruja** · [GitHub](https://github.com/BarujaFe1) · [Portfólio](https://barujafe1.vercel.app)

## Licença

Ver [`LICENSE`](LICENSE).

---

**Uso responsável:** o Soniva é para mídia própria, domínio público, licenças permissivas ou outras fontes que você tenha permissão de preservar localmente. Não use para burlar direitos autorais ou termos de plataformas.
