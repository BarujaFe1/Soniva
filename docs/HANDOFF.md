# Handoff — portfolio quality pass (Soniva)

**Branch:** `chore/portfolio-quality-pass`  
**Data:** 2026-07-13  
**Autor da pass:** Cursor agent (revisão profunda de portfólio)

## O que foi encontrado

- Produto desktop sólido (Tauri/React/SQLite) com tese ética clara.
- Demo web já existia em `feat/vercel-site`, mas `main` estava atrás.
- Bugs reais: overwrite confirm morto, preview `asset://` quebrado, readiness de Settings incorreto, seleção sticky na biblioteca.
- Raiz poluída com ~19 MDs de auditoria/handoff anteriores.
- Sem testes, sem CI, `.gitignore` frágil, `Cargo.toml` com author OpenAI.

## O que foi corrigido

- `BootstrapResponse.overwrite_policy` no Rust + confirmação UI com fallback de settings.
- Preview de mídia via `convertFileSrc` (`MediaPreview` + asset protocol).
- Settings: pronto para local (library+ffmpeg) vs URL (+yt-dlp).
- Library: revalida seleção quando filtro/busca remove o item; erros de detail com toast.
- Jobs: erros de `getJobDetail` com toast.
- `open_in_file_manager` melhorado (Windows `/select,`, macOS `-R`, Linux parent dir).
- Bootstrap UI: loading + erro recuperável.
- Nav mobile horizontal.
- Remoção de dead code (`.bak`, Toast duplicado, scanner vazio, MDs redundantes).

## O que foi melhorado

- README de portfólio (problema, solução, demo, entrevista).
- Docs: AUDIT, ARCHITECTURE, TECHNICAL_DECISIONS, TESTING, DEPLOYMENT, HANDOFF.
- Vitest + scripts `test`/`lint`/`ci`.
- GitHub Actions CI.
- `.env.example` + `.gitignore` endurecido.
- `SECURITY_NOTES.md`.

## Comandos rodados

```bash
git checkout -b chore/portfolio-quality-pass
git merge feat/vercel-site
npm install
npm install -D vitest @vitest/coverage-v8 jsdom
npm run typecheck
npm run build
npm run test
npm run ci
```

## Testes executados

- Vitest: utils + webStore (autorização, demo load, overwrite policy).
- `tsc --noEmit`
- `vite build` (web)

**Não executado nesta máquina:** `tauri:build` / pipeline real com ffmpeg (depende do ambiente do autor).

## O que ainda falta

- Screenshots reais e vídeo curto.
- Deploy Vercel da branch (manual no dashboard / CLI do autor).
- Validação visual manual do preview de mídia no app Tauri.
- ESLint/Prettier dedicados (hoje `lint` = typecheck).
- Hardening CSP / asset scope / SQL proxy.

## Riscos restantes

- Demo web pode ser confundida com app completo se o visitante não ler o header — mitigado por copy explícita.
- CI não compila Rust (custo/tempo); regressões no pipeline nativo ainda são manuais.
- Dependências npm com avisos de audit (não bloqueantes do build).

## Próximos passos sugeridos

1. Push da branch e abrir PR para `main`.
2. Validar `npm run tauri:dev` no Windows do autor.
3. Publicar demo Vercel e linkar no README/portfólio.
4. Capturar 3 screenshots e substituir o placeholder.
5. Atualizar descrição do repo no GitHub (hoje vazia).

## Sugestões para o portfólio

- Card: “Soniva — local-first authorized media ops”.
- Link demo web + GitHub + 1 GIF do fluxo Ingest→Jobs→Library.
- Em entrevista: enfatizar framing ético + dual runtime (Tauri vs webStore).

## Mensagem de commit sugerida

```text
chore: improve portfolio quality, docs, tests and stability
```
