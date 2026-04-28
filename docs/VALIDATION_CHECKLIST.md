# Soniva Validation Checklist

## Architecture
- [x] desktop-first/local-first architecture preserved
- [x] Tauri + Rust + React + TypeScript + Tailwind preserved
- [x] SQLite + Drizzle preserved
- [x] no remote backend introduced

## Runtime alignment
- [x] Settings readiness now reflects effective binary detection instead of requiring explicit saved paths only
- [x] Ingest readiness now differs by source kind
- [x] local-file ingestion no longer pretends `yt-dlp` is required
- [x] overwrite policy now affects runtime behavior for recognized duplicate sources

## Database / query layer
- [x] SQLite proxy path remains the query bridge used by the frontend
- [x] runtime SQLite file remains owned by the Tauri layer
- [x] `db:studio` no longer silently implies a repository-local live database
- [x] Drizzle config now requires `SONIVA_DB_PATH` for Studio-style commands that need the real runtime DB

## Encoding / UX copy
- [x] mojibake removed from touched Settings strings
- [x] overwrite copy updated to describe real behavior
- [x] readiness copy updated to describe real prerequisites

## Validation executed in this delivery environment
- [ ] native Tauri compilation executed
- [ ] end-to-end ingestion executed against real binaries
- [x] code audit completed for overwrite, readiness, and db-studio alignment
- [x] frontend dependency install executed
- [x] TypeScript typecheck attempted
- [x] frontend build attempted

## Known environment limitation

Native Tauri validation is still pending on a real local machine with Rust and platform-specific Tauri prerequisites installed.
