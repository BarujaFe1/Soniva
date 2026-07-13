# Changelog — portfolio evidence pass (2026-07-13)

## Added

- Screenshots reais sem PII em `docs/screenshots/` (overview, ingest, library, jobs, settings, mobile).
- Script `npm run screenshots` (`scripts/capture-screenshots.mjs`) via Playwright + build estático.
- Auto-load de demo com `?demo=1`.
- Banner explícito “demo web (simulado)” no header.
- Testes de regressão `mediaUrl` / `platform`.
- `docs/DEMO_SCRIPT.md`, `docs/PORTFOLIO_HANDOFF.md`, `docs/SCREENSHOTS.md`.
- Metadados GitHub: description, homepage, topics.

## Changed

- README atualizado com evidências visuais, estado real de deploy e papel de portfólio.
- Clareza de claims: desktop = fonte de verdade; web = walkthrough em memória.

## Known limitations (documented)

- Domínio de produção `https://soniva-seven.vercel.app` ainda apontava para commit antigo (`fbb3453`) no momento da auditoria; promoção via CLI falhou (token/scope). Preview do commit atual existe, com Deployment Protection.
- Tauri/`ffmpeg`/`yt-dlp` não disponíveis no ambiente desta pass — validação desktop pendente no host do autor.
