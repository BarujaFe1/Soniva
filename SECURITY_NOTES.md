# Security notes — Soniva

## Segredos

Nenhum segredo de API, token ou credencial cloud foi encontrado no código-fonte nesta revisão (2026-07-13).

## Itens conscientes (não são vazamentos)

| Item | Notas |
|---|---|
| `execute_sql` Tauri command | Proxy SQL para Drizzle no desktop. Aceitável em app local trusted; **não** expor em backend multi-tenant. |
| Asset protocol `scope: ["**"]` | Necessário para preview de arquivos da biblioteca do usuário. Preferir restringir ao `libraryRoot` numa iteração futura. |
| CSP `null` | Facilita assets locais; endurecer em versões futuras. |
| `.vercel/` | Mantido fora do git via `.gitignore`. |

## Política

- Nunca commitar `.env`, bancos SQLite locais com dados reais, ou exports pessoais.
- Usar apenas fontes autorizadas na ingestão.
