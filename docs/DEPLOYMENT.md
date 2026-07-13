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

### Estado conhecido (2026-07-13)

| URL | Notas |
|---|---|
| `https://soniva-seven.vercel.app` | Domínio de produção — **pode servir commit antigo**; promote via CLI falhou (auth/scope) nesta auditoria |
| Preview do `chore/portfolio-quality-pass` | READY, mas com **Deployment Protection** (login Vercel) |
| Local | Caminho preferido: `npm run dev` + `?demo=1` |

Para atualizar produção (ação humana):

1. Abrir o deployment recente no dashboard Vercel.
2. **Promote to Production**.
3. Opcional: desativar Deployment Protection na demo pública de portfólio.

### Checklist pós-deploy

1. Abrir a URL → header “Demo web (simulado)” visível.
2. Usar `?demo=1` ou clicar **Carregar dados de demonstração**.
3. Navegar Overview → Library → Jobs → Ingest → Settings.
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
