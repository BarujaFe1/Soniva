# Demo guiada (3–5 min) — Soniva

Roteiro para entrevista ou gravação. Público: recruiter/hiring manager de analytics engineering, data engineering ou full-stack analítico.

## Antes de começar

- Preferir **demo web** (rápido, sem toolchain):
  - Local: `npm run dev` → `http://localhost:1420/?demo=1`
  - Preview branch (pode exigir login Vercel se Deployment Protection estiver ativo)
- Deixar claro em 10s: **produto real = desktop Tauri**; **esta tela = demo em memória**.

## Minuto 0:00–0:40 — Problema e tese

> “Ferramentas CLI resolvem download/encode, mas não dão biblioteca auditável nem framing de uso autorizado. Soniva é local-first: SQLite + filesystem + jobs observáveis.”

Mostrar o banner amarelo da demo web.

## Minuto 0:40–1:30 — Overview

1. Abrir **Visão geral** com dados carregados.
2. Apontar métricas (itens, jobs, completed, failed).
3. Mostrar paths de library / yt-dlp / ffmpeg (no desktop seriam reais; na web são demo).

## Minuto 1:30–2:30 — Library + Jobs

1. **Biblioteca** → filtro `prontos` / busca.
2. Abrir inspetor: metadados JSON, paths, aviso de preview indisponível na web.
3. **Jobs** → selecionar um completed e o failed; mostrar logs/erro explícito.

## Minuto 2:30–3:30 — Ingestão e autorização

1. **Ingestão autorizada** → modo URL vs arquivo local.
2. Mostrar checkbox de autorização (obrigatório).
3. Na web: enfileirar um job simulado e voltar em Jobs/Library.

## Minuto 3:30–4:30 — Settings e trade-offs

1. **Configurações** → readiness “apenas local” vs “URL + local”.
2. Overwrite policy skip/replace.
3. Trade-off: “Por isso a demo web existe — recrutador não precisa instalar Rust/ffmpeg.”

## Minuto 4:30–5:00 — Fechamento de entrevista

Pontos a deixar:

- Dual runtime (`tauri.ts` façade → invoke vs `webStore`).
- CI: typecheck + Vitest + build.
- Papel no portfólio: **selecionado / breadth**, não peça central de dados.
- Limitação honesta: pipeline nativo não validado neste ambiente sem Rust/ffmpeg.

## Não diga

- “Em produção com milhares de usuários”
- “Enterprise media platform”
- “IA”
- “A demo web baixa mídia de verdade”
