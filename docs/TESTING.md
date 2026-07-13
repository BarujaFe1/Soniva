# Testes — Soniva

## Estratégia

| Camada | Ferramenta | O que cobre |
|---|---|---|
| Unit (JS/TS) | Vitest | Utils + `webStore` (demo mode) |
| Type safety | `tsc --noEmit` | Contratos TS |
| Build smoke | `vite build` | Bundle web / Vercel |
| Desktop E2E | Manual / futuro | `tauri:dev` + ffmpeg/yt-dlp reais |

Não há (ainda) suite Rust automatizada; o pipeline depende de binários externos e filesystem.

## Comandos

```bash
npm run test          # vitest run
npm run test:watch    # modo watch
npm run typecheck     # tsc
npm run ci            # typecheck + test + build
```

## Casos cobertos hoje

- Formatação de bytes/duração e validação JSON.
- Load/clear de dados de demonstração.
- Persistência de `overwritePolicy` no bootstrap web.
- Bloqueio de job sem autorização + criação simulada com autorização.

## Como adicionar um teste

1. Crie `src/**/*.test.ts`.
2. Prefira testar lógica pura (`utils`, `webStore`) sem montar React, salvo necessidade.
3. Rode `npm run test` antes do PR.

## Limitações honestas

- Preview de mídia desktop (`convertFileSrc`) precisa validação manual no app Tauri.
- Pipeline real (download/extract) não é mockado em CI (sem binários).
