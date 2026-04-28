# PROMPT PARA IA IMPLEMENTADORA - SONIVA

## CONTEXTO

Você está trabalhando no **Soniva**, uma aplicação desktop Tauri para ingestão autorizada de mídia, extração de áudio, e organização de biblioteca local.

**Localização:** C:\dev\soniva

**Stack:**
- Tauri 2.0 + Rust
- React 18 + TypeScript 5.7
- Tailwind 3.4
- SQLite + Drizzle
- yt-dlp + ffmpeg (binários externos)

---

## ESTADO ATUAL (27/04/2026)

### ✅ O que já foi feito

**Auditoria técnica completa executada:**
- Código duplicado em `src/lib/utils.ts` foi removido
- Erro de sintaxe em `src/pages/LibraryPage.tsx` foi corrigido
- Build TypeScript validado: **PASSA SEM ERROS**
- Arquitetura auditada: **SÓLIDA E PROFISSIONAL**
- Documentação revisada: **COMPLETA E CLARA**

**Status de compilação:**
- ✅ TypeScript: COMPILA SEM ERROS
- ⏳ Rust/Tauri: NÃO TESTADO (requer prerequisites do Windows)
- ⏳ Execução end-to-end: NÃO TESTADA
- ⏳ Screenshots: AUSENTES

### ⚠️ Problemas conhecidos

1. **Build Rust nunca foi executado** - `target/` não existe
2. **App nunca foi executado** - nenhum fluxo foi testado
3. **Binários externos não validados** - yt-dlp e ffmpeg podem não estar instalados
4. **Faltam screenshots** - README não tem evidência visual
5. **Falta confirmação antes de replace** - ação destrutiva sem proteção
6. **Falta validação de JSON** - metadata malformado pode quebrar UI
7. **Empty states sem CTAs** - usuário não sabe próxima ação

---

## SUA MISSÃO

Sua missão é **DESTRAVAR O PROJETO** e **CONSOLIDAR O MVP**.

Você deve:
1. ✅ Validar que projeto compila (TypeScript ✅ + Rust ⏳)
2. ✅ Executar app pela primeira vez
3. ✅ Testar fluxos end-to-end (URL ingestion + local file ingestion)
4. ✅ Adicionar melhorias essenciais para MVP
5. ✅ Capturar screenshots e atualizar README
6. ✅ Deixar projeto executável e apresentável

---

## PRINCÍPIOS OBRIGATÓRIOS

### ✅ FAÇA

- Use os arquivos locais como fonte de verdade
- Faça correções cirúrgicas e incrementais
- Preserve a arquitetura existente (ela é boa)
- Mantenha foco em MVP forte
- Teste cada mudança antes de prosseguir
- Atualize docs quando código mudar
- Documente problemas encontrados

### ❌ NÃO FAÇA

- Não reimagine o produto
- Não refatore sem necessidade
- Não adicione features fora do MVP
- Não mude stack ou arquitetura
- Não adicione dependências desnecessárias
- Não crie documentação extra além do necessário
- Não pule etapas de validação

---

## PLANO DE EXECUÇÃO

### FASE 1: DESTRAVAR BUILD (CRÍTICO - 2-3 horas)

#### 1.1 Validar prerequisites do sistema

```powershell
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Rust
rustc --version
cargo --version

# Verificar yt-dlp
yt-dlp --version

# Verificar ffmpeg
ffmpeg -version
```

**Se algum estiver faltando:**
- Node.js: https://nodejs.org/
- Rust: https://rustup.rs/
- yt-dlp: `winget install yt-dlp` ou https://github.com/yt-dlp/yt-dlp/releases
- ffmpeg: `winget install ffmpeg` ou https://ffmpeg.org/download.html

#### 1.2 Validar Tauri prerequisites

Seguir: https://tauri.app/v1/guides/getting-started/prerequisites#windows

**Necessário no Windows:**
- Microsoft Visual Studio C++ Build Tools
- WebView2 (geralmente já instalado no Windows 10/11)

#### 1.3 Primeira compilação Rust

```bash
cd C:\dev\soniva
npm run tauri:dev
```

**Resolver erros que aparecerem:**
- Ler mensagem de erro cuidadosamente
- Buscar solução específica
- Documentar problema e solução
- Tentar novamente

**Critério de sucesso:** App abre sem crash

---

### FASE 2: VALIDAR MVP (ESSENCIAL - 2-3 horas)

#### 2.1 Configurar app

1. Abrir Settings
2. Clicar em "Browse" e escolher pasta para library root (ex: `C:\Users\[user]\Music\Soniva`)
3. Clicar em "Detect" para yt-dlp (deve encontrar automaticamente se estiver no PATH)
4. Clicar em "Detect" para ffmpeg (deve encontrar automaticamente se estiver no PATH)
5. Escolher overwrite policy: "skip"
6. Clicar em "Save settings"
7. Validar que badge muda para "Ready to ingest"

#### 2.2 Testar URL ingestion

**Usar URL de teste autorizada:**
- Vídeo Creative Commons do YouTube
- Exemplo: https://www.youtube.com/watch?v=aqz-KE-bpKQ (Big Buck Bunny)

**Passos:**
1. Ir para página "Ingest"
2. Selecionar modo "Authorized URL"
3. Colar URL de teste
4. Marcar checkbox "I confirm that this source is authorized"
5. Clicar em "Queue job"
6. Ir para página "Jobs"
7. Acompanhar progresso até "completed"
8. Ir para página "Library"
9. Validar que item aparece
10. Clicar no item e inspecionar detalhes
11. Abrir pasta física no library root
12. Validar estrutura:
   ```
   items/
     big-buck-bunny--[id]/
       source/
         source.[ext]
       audio/
         track.mp3
       thumbnails/
         [thumbnail].jpg
       source-metadata.json
   ```

**Critério de sucesso:** Item aparece em Library com audio path válido

#### 2.3 Testar local file ingestion

**Preparar arquivo de teste:**
- Qualquer arquivo de vídeo ou áudio local (MP4, MOV, MP3, etc)
- Exemplo: `C:\Users\[user]\Videos\test.mp4`

**Passos:**
1. Ir para página "Ingest"
2. Selecionar modo "Local source file"
3. Clicar em "Browse file" e escolher arquivo
4. Marcar checkbox de autorização
5. Clicar em "Queue job"
6. Acompanhar em Jobs até completion
7. Validar em Library
8. Validar pasta física

**Critério de sucesso:** Item aparece em Library com audio extraído

#### 2.4 Testar overwrite policy

**Testar SKIP:**
1. Ir para Settings
2. Mudar overwrite policy para "skip"
3. Salvar
4. Ir para Ingest
5. Re-ingerir MESMA URL do teste 2.2
6. Marcar autorização e criar job
7. Acompanhar em Jobs
8. Validar que job completa rapidamente com stage "Skipped existing item"
9. Validar que NÃO foi criado novo diretório na biblioteca

**Testar REPLACE:**
1. Ir para Settings
2. Mudar overwrite policy para "replace"
3. Salvar
4. Ir para Ingest
5. Re-ingerir MESMA URL novamente
6. Marcar autorização e criar job
7. Acompanhar em Jobs até completion
8. Validar que novo diretório foi criado
9. Validar que diretório anterior foi removido

**Critério de sucesso:** Ambas policies funcionam conforme esperado

#### 2.5 Testar edge cases básicos

**Teste 1: Job sem autorização**
- Criar job sem marcar checkbox
- Validar que mostra erro: "Confirm authorized usage before creating a job"

**Teste 2: Settings incompletos**
- Limpar library root em Settings
- Tentar criar job
- Validar que mostra erro sobre settings incompletos

**Teste 3: Path com espaços**
- Usar arquivo local com path contendo espaços
- Validar que funciona normalmente

**Critério de sucesso:** Erros são tratados gracefully

---

### FASE 3: MELHORIAS ESSENCIAIS DO MVP (IMPORTANTE - 2-3 horas)

#### 3.1 Adicionar confirmação antes de replace

**Arquivo:** `src/pages/IngestPage.tsx`

**Implementação:**
```typescript
// Adicionar state para modal
const [showReplaceWarning, setShowReplaceWarning] = useState(false);
const [pendingSubmit, setPendingSubmit] = useState(false);

// Modificar handleSubmit para checar overwrite policy
async function handleSubmit() {
  setFeedback(null);
  if (!inputValue.trim()) return setFeedback("Provide a URL or choose a local media file.");
  if (!authorized) return setFeedback("Confirm authorized usage before creating a job.");
  if (!requirements.ready) return setFeedback(requirements.message);

  // Se overwrite policy é "replace", mostrar warning
  if (settings.overwritePolicy === "replace") {
    setShowReplaceWarning(true);
    return;
  }

  await executeSubmit();
}

async function executeSubmit() {
  try {
    setLoading(true);
    await startIngestionJob({ sourceKind, inputValue: inputValue.trim(), authorized });
    setInputValue("");
    setAuthorized(false);
    setFeedback("Job queued successfully.");
    await onSubmitted();
  } catch (error) {
    setFeedback(error instanceof Error ? error.message : "Unable to queue the job.");
  } finally {
    setLoading(false);
    setShowReplaceWarning(false);
  }
}

// Adicionar modal de confirmação no JSX
{showReplaceWarning && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <Card className="max-w-md space-y-4">
      <h3 className="text-xl font-semibold text-mist-50">Replace existing item?</h3>
      <p className="text-sm text-mist-300">
        Your overwrite policy is set to "replace". If this source already exists, 
        the previous catalog entry and library directory will be removed after the new run succeeds.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setShowReplaceWarning(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={() => void executeSubmit()}>
          Confirm Replace
        </Button>
      </div>
    </Card>
  </div>
)}
```

**Critério de sucesso:** Modal aparece antes de replace, usuário pode cancelar

#### 3.2 Melhorar empty states com CTAs

**Arquivo:** `src/components/ui/EmptyState.tsx`

**Modificação:** Componente já aceita `children`, usar isso para adicionar botões

**Exemplo de uso em OverviewPage:**
```typescript
<EmptyState 
  eyebrow="No jobs yet" 
  title="The queue is empty." 
  description="Configure settings first, then start with a short authorized URL."
>
  <Button onClick={() => onPageChange("settings")}>
    Configure Settings
  </Button>
</EmptyState>
```

**Aplicar em:**
- OverviewPage (quando library root não configurado)
- JobsPage (quando sem jobs)
- LibraryPage (quando biblioteca vazia)

**Critério de sucesso:** Empty states têm botões que levam para ação relevante

#### 3.3 Adicionar validação de schema JSON

**Arquivo:** `src-tauri/src/pipeline.rs`

**Modificação:** Adicionar validação antes de persistir metadata

```rust
// Função helper para validar JSON
fn validate_json(json_str: &str) -> Result<()> {
    serde_json::from_str::<Value>(json_str)
        .context("Invalid JSON format")?;
    Ok(())
}

// Usar antes de persistir
let metadata_str = serde_json::to_string_pretty(&metadata_json)?;
validate_json(&metadata_str)?;
```

**Critério de sucesso:** JSON malformado causa erro claro em vez de crash

#### 3.4 Melhorar error messages

**Arquivo:** `src-tauri/src/pipeline.rs`

**Modificações:**
- Tornar mensagens mais específicas e acionáveis
- Incluir sugestões de solução

**Exemplos:**
```rust
// Antes
.ok_or_else(|| anyhow!("yt-dlp was not found."))?

// Depois
.ok_or_else(|| anyhow!(
    "yt-dlp was not found. Install it system-wide or configure an explicit path in Settings."
))?

// Antes
bail!("ffmpeg failed");

// Depois
bail!(
    "ffmpeg failed with error: {}. Check that the file is valid media and ffmpeg is properly installed.",
    stderr
);
```

**Critério de sucesso:** Mensagens de erro são claras e sugerem solução

---

### FASE 4: SCREENSHOTS E README (ESSENCIAL - 1 hora)

#### 4.1 Capturar screenshots de qualidade

**Preparação:**
- Garantir que app está rodando com dados reais
- Usar tema dark (já é padrão)
- Maximizar janela para captura

**Screenshots necessários:**

1. **overview.png** - Dashboard com métricas
   - Deve mostrar: stats cards, recent jobs, library preview
   - Capturar quando houver dados reais

2. **settings.png** - Settings configurado e ready
   - Deve mostrar: library root preenchido, binários detectados, badge "Ready to ingest"

3. **ingest.png** - Formulário de ingestão preenchido
   - Deve mostrar: URL mode selecionado, URL preenchida, checkbox marcado

4. **jobs.png** - Lista de jobs com completed/failed
   - Deve mostrar: múltiplos jobs, progress bars, status badges

5. **library.png** - Catálogo com items
   - Deve mostrar: lista de items, busca, filtros

6. **detail.png** - Inspector de detalhes com metadata JSON
   - Deve mostrar: paths, metadata JSON expandido

**Salvar em:** `C:\dev\soniva\screenshots/`

#### 4.2 Atualizar README com screenshots

**Arquivo:** `README.md`

**Adicionar seção após "Features":**

```markdown
## Screenshots

### Dashboard
![Overview](screenshots/overview.png)

### Settings
![Settings](screenshots/settings.png)

### Ingestion
![Ingest](screenshots/ingest.png)

### Jobs Tracking
![Jobs](screenshots/jobs.png)

### Library
![Library](screenshots/library.png)

### Detail Inspector
![Detail](screenshots/detail.png)
```

#### 4.3 Melhorar README

**Adicionar badges no topo:**
```markdown
![Tauri](https://img.shields.io/badge/Tauri-2.0-blue)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Rust](https://img.shields.io/badge/Rust-stable-orange)
![License](https://img.shields.io/badge/license-MIT-green)
```

**Adicionar seção "Why Soniva?":**
```markdown
## Why Soniva?

Soniva is designed for users who need:
- **Local-first control** - All data stays on your machine
- **Metadata preservation** - Structured metadata and sidecar files
- **Organized library** - Predictable directory structure
- **Authorized workflows** - Built-in authorization checkpoints
- **Desktop integration** - Native OS integration via Tauri

Unlike command-line tools, Soniva provides a polished UI, persistent job tracking, and searchable catalog.
```

**Critério de sucesso:** README tem screenshots reais e é convincente

---

### FASE 5: HANDOFF (OBRIGATÓRIO - 30 min)

Ao final, você DEVE entregar um relatório com:

#### 5.1 Relatório de execução

**Template:**
```markdown
# RELATÓRIO DE IMPLEMENTAÇÃO - SONIVA

## O que foi feito

- [ ] Build Rust validado
- [ ] App executado pela primeira vez
- [ ] URL ingestion testada
- [ ] Local file ingestion testada
- [ ] Overwrite policy testada
- [ ] Confirmação antes de replace implementada
- [ ] Empty states melhorados
- [ ] Validação de JSON implementada
- [ ] Error messages melhorados
- [ ] Screenshots capturados
- [ ] README atualizado

## Problemas encontrados e soluções

1. **Problema:** [descrição]
   **Solução:** [descrição]
   **Arquivo:** [path]

2. ...

## Testes executados e resultados

### URL Ingestion
- URL testada: [url]
- Status: ✅ PASSOU / ❌ FALHOU
- Observações: [detalhes]

### Local File Ingestion
- Arquivo testado: [path]
- Status: ✅ PASSOU / ❌ FALHOU
- Observações: [detalhes]

### Overwrite Policy
- Skip: ✅ PASSOU / ❌ FALHOU
- Replace: ✅ PASSOU / ❌ FALHOU
- Observações: [detalhes]

## Arquivos modificados

- src/pages/IngestPage.tsx - adicionado modal de confirmação
- src/components/ui/EmptyState.tsx - melhorado para aceitar CTAs
- src-tauri/src/pipeline.rs - melhorado error messages
- README.md - adicionado screenshots e badges
- screenshots/ - 6 imagens capturadas

## Status final do projeto

- Build TypeScript: ✅ PASSA
- Build Rust: ✅ PASSA / ❌ FALHA
- URL ingestion: ✅ FUNCIONA / ❌ FALHA
- Local file ingestion: ✅ FUNCIONA / ❌ FALHA
- Overwrite policy: ✅ FUNCIONA / ❌ FALHA
- Screenshots: ✅ COMPLETO / ⏳ PARCIAL

## Próximos passos recomendados

1. [ação prioritária]
2. [ação secundária]
3. ...

## Riscos conhecidos

- [risco 1]
- [risco 2]

## Instruções para rodar

1. Instalar prerequisites: [lista]
2. Instalar binários: yt-dlp, ffmpeg
3. Executar: `npm run tauri:dev`
4. Configurar Settings
5. Testar ingestão
```

---

## CRITÉRIOS DE SUCESSO

Você terá sucesso se:

- ✅ `npm run typecheck` passa sem erros
- ✅ `npm run tauri:dev` compila e abre app
- ✅ URL ingestion funciona end-to-end
- ✅ Local file ingestion funciona end-to-end
- ✅ Overwrite policy funciona corretamente (skip e replace)
- ✅ Modal de confirmação aparece antes de replace
- ✅ Empty states têm CTAs úteis
- ✅ Error messages são claros e acionáveis
- ✅ 6 screenshots reais foram capturados
- ✅ README está atualizado com screenshots e badges
- ✅ Handoff está completo e claro

---

## IMPORTANTE

- Trabalhe de forma **incremental** - teste cada mudança
- **Documente** problemas e soluções conforme encontrar
- **Não pule etapas** - cada fase depende da anterior
- Se encontrar **bloqueio**, documente e peça ajuda
- Priorize **funcionalidade** sobre perfeição
- Lembre-se: o objetivo é **MVP FUNCIONAL**, não produto perfeito

---

## RECURSOS DISPONÍVEIS

**Documentação do projeto:**
- `README.md` - setup e features
- `docs/ARCHITECTURE.md` - arquitetura
- `docs/RUNBOOK.md` - passo-a-passo
- `docs/PORTFOLIO_NOTES.md` - framing profissional
- `AUDITORIA_COMPLETA.md` - auditoria técnica completa

**Comandos úteis:**
```bash
# Typecheck
npm run typecheck

# Dev mode
npm run tauri:dev

# Build production
npm run tauri:build

# Drizzle Studio (requer SONIVA_DB_PATH)
npm run db:studio
```

**Estrutura de pastas:**
```
soniva/
├── src/                    # Frontend React
│   ├── components/         # UI components
│   ├── pages/             # Páginas principais
│   ├── lib/               # Drizzle, Tauri bridge, utils
│   └── styles/            # CSS global
├── src-tauri/             # Backend Rust
│   └── src/
│       ├── main.rs        # Entry point, comandos Tauri
│       ├── db.rs          # Database operations
│       ├── pipeline.rs    # Ingestion pipeline
│       └── models.rs      # Rust types
├── drizzle/               # SQL migrations
└── docs/                  # Documentação
```

---

**Boa sorte! 🚀**

Transforme o Soniva em um MVP funcional e apresentável.
