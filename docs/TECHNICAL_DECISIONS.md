# Decisões técnicas — Soniva

## Por que Tauri 2 (e não Electron)?

- Binário menor e consumo de memória tipicamente menor.
- Integração natural com Rust para subprocessos e SQLite.
- Adequado a um produto local-first onde a “mágica” está no filesystem + CLI tools.

**Trade-off:** DX e packaging exigem toolchain Rust; a demo pública no browser precisa de um fallback separado.

## Por que SQLite + Drizzle (reads) / rusqlite (writes)?

- SQLite casa com local-first e zero ops.
- Drizzle no frontend tipa leituras via proxy SQL.
- Escritas e pipeline ficam no Rust para controle transacional e I/O de arquivos.

**Trade-off:** dois caminhos de acesso ao banco exigem disciplina de schema (migrations em `drizzle/` aplicadas no boot Rust).

## Por que modo demo web?

Recrutadores e revisores raramente instalam Tauri + ffmpeg + yt-dlp só para clicar. A demo web:

- preserva a mesma navegação e contratos;
- carrega dados fictícios realistas;
- deixa claro no header que é demonstração.

**Trade-off:** preview real de mídia e pipeline real só no desktop.

## Por que MP3 como único formato V1?

Reduz superfície de bugs e setup de demo. O schema já prevê extensão futura.

## Por que confirmação de autorização?

O framing ético é parte do produto. Sem isso, o app seria facilmente mal interpretado como downloader genérico.

## Alternativas rejeitadas

| Ideia | Por que não |
|---|---|
| Backend cloud / sync | Contradiz a tese local-first |
| Electron | Overhead desnecessário para o escopo |
| Demo web fingindo downloads reais | Desonesto e frágil |
| ESLint completo nesta pass | Typecheck + testes cobrem o risco imediato; ESLint pode entrar depois |

## Evolução sugerida

1. Contagens SQL agregadas (em vez de carregar tabelas inteiras para métricas).
2. CSP não-nula e scopes de asset mais estreitos.
3. Testes de integração Rust no pipeline com fixtures.
4. Screenshots reais e recording de demo no README.
