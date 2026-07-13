# Portfolio handoff — Soniva

**Data:** 2026-07-13  
**Branch:** `chore/portfolio-quality-pass`  
**Recomendação de papel:** **selecionado (breadth)** — não destaque, não arquivo.

## Resumo

Soniva foi elevado de “repo TypeScript sem descrição” para um case **honesto e demonstrável** de engenharia desktop local-first + demo web, com evidências visuais, CI, documentação de entrevista e metadados públicos no GitHub.

## Before → After

| Dimensão | Antes | Depois |
|---|---|---|
| Nota | ~8.2 (quality pass) / descrição GitHub vazia | Evidências fechadas; descrição/topics/homepage setados |
| Demo | Funcional em branch, claims frágeis | Banner “simulado”, `?demo=1`, roteiro 3–5 min |
| Screenshots | Placeholder | 6 PNGs reais sem PII |
| Deploy | Produção em commit antigo | Documentado como risco P1; preview atual existe (auth) |
| Testes | 5 | 7 (+ mediaUrl/platform) |
| Tauri neste host | Não validado | Confirmado: sem rustc/ffmpeg/yt-dlp — pendência explícita |
| Papel | Indefinido | **Selecionado / breadth** |

## Achados priorizados (esta pass)

### P0
- Nenhum vazamento de segredo / claim falso de download real na web (claim foi endurecido no UI).

### P1
- **Deploy produção desatualizado** (`soniva-seven.vercel.app` → sha `fbb3453`). Promote via CLI: não autorizado. Precisa ação humana no Vercel.
- Preview do commit atual READY, mas com Deployment Protection (login).

### P2
- Screenshots e roteiro de demo (resolvidos).
- Clareza mobile nav (já existia; evidência capturada).

### P3
- ESLint dedicado; agregações SQL; CSP.

## Arquivos relevantes desta pass

- `src/App.tsx` (`?demo=1`)
- `src/components/PortfolioHeader.tsx` (banner honesto)
- `src/lib/mediaUrl.test.ts`
- `scripts/capture-screenshots.mjs`
- `docs/screenshots/*`
- `docs/DEMO_SCRIPT.md`, `docs/SCREENSHOTS.md`, `docs/PORTFOLIO_HANDOFF.md`
- `README.md`, `CHANGELOG.md`
- Supermegaprompt externo: `C:\dev\prompts_para_port\soniva-supermegaprompt-portfolio.md`

## Comandos executados

```bash
npm run ci                 # ✅ typecheck + 7 tests + build
npm run screenshots        # ✅ 6 PNGs
gh repo edit ...           # ✅ description, topics, homepage
npx vercel --prod          # ❌ Could not retrieve Project Settings / Not authorized
rustc / ffmpeg / yt-dlp    # ❌ não instalados neste ambiente
```

## Evidências

- Locais: `docs/screenshots/01-overview.png` … `06-mobile-overview.png`
- Preview Vercel (commit `0f2549c`): `https://soniva-gj0ff7pwr-barujafe1s-projects.vercel.app` (protegido)
- Branch alias: `https://soniva-git-chore-portfolio-quality-pass-barujafe1s-projects.vercel.app`
- Produção: `https://soniva-seven.vercel.app` (**não confiar até promote**)

## Limitações remanescentes

1. Produção Vercel não promoveu automaticamente.
2. Desktop Tauri não validado neste host.
3. `main` ainda atrás desta branch (precisa PR/merge).
4. Lint = typecheck (sem ESLint).

## Próximos passos (humano)

1. Abrir PR `chore/portfolio-quality-pass` → `main`.
2. No Vercel: Promote deployment `dpl_7SVf3DnTUusGtb4kT7j5LtXBgoJM` → Production **ou** desligar Protection e redeploy.
3. Instalar Rust + ffmpeg + yt-dlp e rodar `npm run tauri:dev` uma vez.
4. No site de portfólio: card **selecionado** com screenshot Overview + link GitHub + nota “demo web simulada”.

## Integração sem sobreposição

- **Não** apresentar como case principal de analytics/stats.
- **Sim** como breadth: desktop, local data ops, product framing, DX.
- Evitar competir com StatLab / VerboHino / NewsWeave em narrativa de dados.
