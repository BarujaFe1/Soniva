# Screenshots — Soniva

Capturas geradas automaticamente a partir do **build web** com dados de demonstração (sem PII real).

## Como regenerar

```bash
npm run build
npm run screenshots
```

Saída: `docs/screenshots/`.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `01-overview.png` | Dashboard com métricas e jobs demo |
| `02-ingest.png` | Fluxo de ingestão + autorização |
| `03-library.png` | Catálogo + inspetor |
| `04-jobs.png` | Histórico de jobs |
| `05-settings.png` | Paths e overwrite policy |
| `06-mobile-overview.png` | Viewport mobile (~390×844) |

## Notas

- Paths exibidos (`C:/Users/Demo/...`) são **dados fictícios** de `demoData.ts`.
- Preview de áudio/thumbnail aparece como indisponível na web (esperado).
- Toasts de “dados carregados” podem aparecer nas capturas.
