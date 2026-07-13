# Arquitetura — Soniva

## Visão em uma frase

Soniva é um **shell React** que orquestra um **pipeline local** (Rust/Tauri + SQLite + ffmpeg/yt-dlp), com um **modo demo web** que simula o mesmo contrato de API em memória para portfólio.

## Diagrama lógico

```text
┌─────────────────────────────────────────────────────────────┐
│ React UI (Vite)                                             │
│  Overview · Ingest · Library · Jobs · Settings              │
└───────────────────────────┬─────────────────────────────────┘
                            │  src/lib/tauri.ts (façade)
              ┌─────────────┴──────────────┐
              │                            │
     isTauriRuntime()               browser / Vercel
              │                            │
              ▼                            ▼
     @tauri-apps invoke              webStore (memória)
              │                      + demoData
              ▼
     Rust commands (main.rs)
       bootstrap · settings · jobs · library · sql proxy
              │
              ▼
     SQLite (rusqlite) + filesystem library root
              │
              ▼
     pipeline.rs → yt-dlp / ffmpeg subprocesses
```

## Camadas

| Camada | Responsabilidade | Onde |
|---|---|---|
| UI | Páginas, estados de loading/empty/error, toasts | `src/pages`, `src/components` |
| Façade | Escolhe desktop vs demo web | `src/lib/tauri.ts`, `platform.ts` |
| Reads tipados (desktop) | Drizzle sqlite-proxy → `execute_sql` | `src/lib/repositories.ts`, `drizzle/*` |
| Writes / pipeline | Persistência e subprocessos | `src-tauri/src/{db,pipeline,main}.rs` |
| Demo | Catálogo e jobs fictícios | `src/lib/webStore.ts`, `demoData.ts` |

## Contratos importantes

- **Bootstrap** devolve paths detectados, raiz da biblioteca, versão e **overwrite policy**.
- **Ingestão** só avança com checkbox de autorização.
- **Overwrite**: `skip` reutiliza item reconhecido; `replace` reprocessa e limpa artefato anterior após sucesso (com confirmação na UI).
- **Demo web** não chama binários reais — jobs completam de forma simulada.

## Persistência

- Desktop: SQLite no app data dir (`soniva.sqlite` / path configurado).
- Biblioteca de mídia: diretório escolhido pelo usuário (`libraryRoot`).
- Sidecars JSON ao lado dos assets quando o pipeline desktop roda.
- Web: estado volátil em memória (recarregar a página zera, salvo “Carregar demo”).

## Segurança (modelo de ameaça resumido)

- Sem telemetria / backend cloud no produto desktop.
- Confirmação explícita de fonte autorizada.
- `execute_sql` é um proxy confiável apenas porque a webview é local e controlada; não deve ser exposto a uma superfície web autenticada sem hardening.
- Asset protocol habilitado com scope amplo para preview local — aceitável no desktop do usuário.
