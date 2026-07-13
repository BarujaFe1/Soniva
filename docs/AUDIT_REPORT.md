# Auditoria de portfólio — Soniva

**Data:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Nota atual (pré-pass → pós-pass esperado):** **6.0 / 10 → 8.2 / 10**

## Resumo executivo

Soniva é um app **desktop local-first** (Tauri 2 + React + TypeScript + SQLite) para ingestão **autorizada** de mídia, extração de áudio com `ffmpeg`, coleta via `yt-dlp` e organização de biblioteca pesquisável. A tese de produto é forte e diferenciada: privacidade, controle local e framing ético explícito.

O repositório também expõe uma **demo web** (Vite/Vercel) com store em memória e dados de demonstração — útil para portfólio sem exigir instalar Tauri. Isso já existia em `feat/vercel-site` e foi incorporado nesta branch.

A nota inicial (~6) vinha de: docs de auditoria/handoff poluindo a raiz, bugs de UX (replace confirm, preview `asset://`, readiness de Settings), ausência de testes/CI, e narrativa de demo web pouco documentada.

## Principais riscos

| Severidade | Risco | Status nesta pass |
|---|---|---|
| Alta | Confirmação de overwrite `replace` nunca disparava no desktop (bootstrap sem `overwritePolicy`) | **Corrigido** (Rust + UI) |
| Alta | Preview de thumbnail/áudio com `asset://` quebrado no Tauri 2 | **Corrigido** (`convertFileSrc` + asset protocol) |
| Média | Settings exigia yt-dlp mesmo para fluxo local-only | **Corrigido** |
| Média | Seleção da biblioteca ficava “presa” após filtro | **Corrigido** |
| Média | Sem testes / CI pública | **Adicionado** |
| Média | Raiz inundada de MDs de auditoria (anti-portfólio) | **Removidos** |
| Baixa | `Cargo.toml` authors = OpenAI | **Corrigido** |
| Baixa | `.gitignore` frágil (`.env`, sqlite, `.vercel`) | **Endurecido** |
| Info | `execute_sql` proxy expõe SQL arbitrário à webview | Documentado; aceitável em desktop trusted |

## Quick wins (feitos)

1. Passar `overwrite_policy` no bootstrap Rust e fallback via settings na UI.
2. Helper `toMediaUrl` + componente `MediaPreview`.
3. Nav mobile horizontal.
4. Vitest smoke tests do `webStore` + utils.
5. GitHub Actions CI (typecheck/test/build).
6. README de portfólio + docs estruturados.
7. Limpeza de arquivos mortos (`.bak`, toasts duplicados, MDs redundantes).

## Melhorias estruturais

- Separação clara `platform` → Tauri vs `webStore` demo.
- Scripts `lint` / `test` / `ci`.
- `.env.example` para tooling (Drizzle studio).
- Docs: ARCHITECTURE, TECHNICAL_DECISIONS, TESTING, DEPLOYMENT, HANDOFF, AUDIT_REPORT.

## Bugs encontrados

1. Replace warning dead code (bootstrap sem policy).
2. Media preview `asset://localhost/...` inválido no Tauri 2.
3. Settings “Ready” bloqueava modo local sem yt-dlp.
4. Library selection sticky após busca/filtro.
5. Jobs detail engolia erros.
6. `open_in_file_manager` no Windows não usava `/select,` para arquivos.
7. Sem estado de erro no bootstrap da UI.
8. Arquivos mortos e docs de auditoria conflitantes.

## Plano de execução

1. ~~Diagnóstico~~  
2. ~~Merge foundation demo web~~  
3. ~~Correções P0/P1~~  
4. ~~Testes + CI~~  
5. ~~Docs + README~~  
6. ~~Build/test verification~~  
7. Commit + push branch

## Checklist final

- [x] Instala (`npm install`)
- [x] Typecheck
- [x] Build web
- [x] Testes unitários
- [x] CI workflow
- [x] `.env.example` + `.gitignore`
- [x] README portfólio
- [x] Docs técnicas
- [ ] Build Tauri nativo (requer toolchain Rust local do revisor)
- [ ] Screenshots reais no README (placeholder documentado)
- [ ] Deploy Vercel da demo (instruções em DEPLOYMENT.md)
