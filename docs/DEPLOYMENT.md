# Deploy — Soniva

## Dois artefatos

| Artefato | Uso | Como |
|---|---|---|
| **Demo web** | Portfólio / walkthrough | Vercel (Vite static) |
| **Desktop app** | Produto real | `npm run tauri:build` |

## Demo web (Vercel)

Pré-requisitos: conta Vercel + repo conectado (já existe vínculo `.vercel` local — **não commitar**).

```bash
npm ci
npm run build
# output: dist/
```

Configuração: `vercel.json` (SPA rewrite + `outputDirectory: dist`).

### Checklist pós-deploy

1. Abrir a URL → header “Demo web” visível.
2. Clicar **Carregar dados de demonstração**.
3. Navegar Overview → Library → Jobs → Ingest (job simulado) → Settings.
4. Confirmar que não há erros de `invoke` no console.

### Variáveis

Nenhuma obrigatória. Ver `.env.example` para `SONIVA_DB_PATH` (apenas tooling Drizzle local).

## Desktop (Tauri)

Pré-requisitos:

- Node 20+
- Rust stable
- ffmpeg e yt-dlp no PATH (ou paths em Settings)

```bash
npm install
npm run tauri:dev      # desenvolvimento
npm run tauri:build    # instaladores em src-tauri/target/release/bundle
```

## Limitações

- A demo Vercel **não** executa yt-dlp/ffmpeg.
- Build Tauri não roda no CI gratuito atual (sem cache Rust + binários externos).
- Screenshots: adicione em `docs/screenshots/` e referencie no README quando tiver capturas reais.
