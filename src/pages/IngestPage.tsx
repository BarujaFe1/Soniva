import { AlertTriangle, CheckCircle2, FileAudio2, Link2, Loader2, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { useToast } from "../hooks/useToast";
import type { BootstrapResponse, IngestionRequest, IngestionJobRecord } from "../types";
import { pickFile } from "../lib/dialog";
import { startIngestionJob } from "../lib/tauri";

export function IngestPage({
  bootstrap,
  overwritePolicy,
  onSubmitted,
  latestJob
}: {
  bootstrap: BootstrapResponse | null;
  overwritePolicy: "skip" | "replace";
  onSubmitted: () => Promise<void>;
  latestJob: IngestionJobRecord | null;
}) {
  const [sourceKind, setSourceKind] = useState<IngestionRequest["sourceKind"]>("url");
  const [inputValue, setInputValue] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showReplaceWarning, setShowReplaceWarning] = useState(false);
  const { showToast } = useToast();

  const requirements = useMemo(() => {
    const hasLibraryRoot = Boolean(bootstrap?.libraryRoot);
    const hasYtDlp = Boolean(bootstrap?.detectedYtDlpPath);
    const hasFfmpeg = Boolean(bootstrap?.detectedFfmpegPath);

    if (sourceKind === "local_file") {
      return {
        ready: hasLibraryRoot && hasFfmpeg,
        message: "Resolva a raiz da biblioteca e o ffmpeg em Configurações primeiro. O yt-dlp só é necessário para ingestão por URL."
      };
    }

    return {
      ready: hasLibraryRoot && hasYtDlp && hasFfmpeg,
      message: "Resolva a raiz da biblioteca, yt-dlp e ffmpeg em Configurações primeiro."
    };
  }, [bootstrap, sourceKind]);

  async function handleBrowseFile() {
    const selected = await pickFile([
      { name: "Media", extensions: ["mp4", "mov", "mkv", "webm", "mp3", "wav", "m4a", "aac", "flac", "ogg"] }
    ]);

    if (selected) {
      setInputValue(selected);
      setSourceKind("local_file");
    }
  }

  async function handleSubmit() {
    setFeedback(null);
    if (!inputValue.trim()) return setFeedback("Informe uma URL ou escolha um arquivo de mídia local.");
    if (!authorized) return setFeedback("Confirme o uso autorizado antes de criar o job.");
    if (!requirements.ready) return setFeedback(requirements.message);

    const policy = bootstrap?.overwritePolicy ?? overwritePolicy;
    if (policy === "replace") {
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
      setFeedback("Job enfileirado com sucesso. As views de Jobs e Biblioteca atualizam automaticamente.");
      showToast("success", "Job enfileirado com sucesso");
      await onSubmitted();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Não foi possível enfileirar o job.";
      setFeedback(errorMsg);
      showToast("error", errorMsg);
    } finally {
      setLoading(false);
      setShowReplaceWarning(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-mist-400">Fluxo principal</p>
            <h3 className="text-2xl font-semibold text-mist-50">Criar job de ingestão autorizada</h3>
          </div>
          <Badge tone={requirements.ready ? "success" : "warning"}>{requirements.ready ? "Ambiente pronto" : "Configuração necessária"}</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className={`rounded-3xl border p-4 text-left transition ${sourceKind === "url" ? "border-accent-400/40 bg-accent-500/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"}`} onClick={() => setSourceKind("url")}>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]"><Link2 className="h-5 w-5" /></div>
            <h4 className="font-medium text-mist-100">URL autorizada</h4>
            <p className="mt-2 text-sm leading-6 text-mist-400">Coleta metadados com yt-dlp, preserva sidecars e extrai um asset de áudio local.</p>
          </button>
          <button className={`rounded-3xl border p-4 text-left transition ${sourceKind === "local_file" ? "border-accent-400/40 bg-accent-500/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"}`} onClick={() => setSourceKind("local_file")}>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.05]"><FileAudio2 className="h-5 w-5" /></div>
            <h4 className="font-medium text-mist-100">Arquivo local</h4>
            <p className="mt-2 text-sm leading-6 text-mist-400">Copia um asset local para a biblioteca gerenciada e extrai áudio no mesmo pipeline.</p>
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-sm text-mist-300">
          {sourceKind === "url"
            ? "A ingestão por URL precisa da raiz da biblioteca, yt-dlp e ffmpeg."
            : "A ingestão de arquivo local precisa da raiz da biblioteca e do ffmpeg. O yt-dlp não é necessário neste modo."}
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">{sourceKind === "url" ? "URL de origem" : "Arquivo de mídia local"}</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input placeholder={sourceKind === "url" ? "https://example.com/fonte-autorizada" : "C:/Users/voce/media/exemplo.mov"} value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
            {sourceKind === "local_file" ? <Button variant="secondary" onClick={() => void handleBrowseFile()}>Escolher arquivo</Button> : null}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.02] p-4">
          <input className="mt-1 h-4 w-4 rounded border-white/10 bg-transparent accent-accent-500" type="checkbox" checked={authorized} onChange={(event) => setAuthorized(event.target.checked)} />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-mist-100"><ShieldCheck className="h-4 w-4 text-mint-400" />Confirmo que esta fonte está autorizada para ingestão local.</div>
            <p className="text-sm leading-6 text-mist-400">Use este projeto apenas com mídia própria, domínio público, obras licenciadas livremente ou outras fontes que você tem permissão para preservar localmente.</p>
          </div>
        </label>

        {feedback ? <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-mist-200">{feedback}</div> : null}

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-mist-400">O Soniva cria um job persistido imediatamente e atualiza o status conforme o pipeline avança.</p>
          <Button onClick={() => void handleSubmit()} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Enfileirar job
          </Button>
        </div>
      </Card>

      <div className="grid gap-6">
        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">O que o pipeline faz</p>
            <h3 className="text-xl font-semibold text-mist-50">Etapas locais conservadoras</h3>
          </div>
          <ol className="space-y-3 text-sm text-mist-300">
            <li>1. Validar apenas as ferramentas exigidas pelo tipo de origem.</li>
            <li>2. Persistir a linha do job antes de qualquer trabalho longo.</li>
            <li>3. Coletar metadados estruturados e arquivos sidecar.</li>
            <li>4. Organizar o asset em um diretório previsível.</li>
            <li>5. Aplicar a política de sobrescrita quando a mesma origem for reconhecida.</li>
            <li>6. Extrair um MP3 local com ffmpeg e persistir o caminho resultante.</li>
          </ol>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Envio mais recente</p>
            <h3 className="text-xl font-semibold text-mist-50">Último job visível</h3>
          </div>
          {!latestJob ? (
            <EmptyState eyebrow="Nenhum envio ainda" title="Enfileire o primeiro job para preencher este painel." description="Esta view atualiza automaticamente e serve bem em demos para mostrar que o app persiste o histórico de execução imediatamente." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-mist-100">{latestJob.inputValue}</p>
                  <Badge tone={latestJob.status === "completed" ? "success" : latestJob.status === "failed" ? "danger" : "accent"}>{latestJob.status}</Badge>
                </div>
                <p className="mt-2 text-sm text-mist-300">Etapa: {latestJob.stage}</p>
              </div>
              {latestJob.errorMessage ? (
                <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">
                  <div className="mb-2 flex items-center gap-2 font-medium"><AlertTriangle className="h-4 w-4" />Erro de execução</div>
                  <p className="leading-6">{latestJob.errorMessage}</p>
                </div>
              ) : (
                <div className="rounded-3xl border border-mint-400/20 bg-mint-400/10 p-4 text-sm text-mint-100">
                  <div className="mb-2 flex items-center gap-2 font-medium"><CheckCircle2 className="h-4 w-4" />Bom comportamento de demo</div>
                  <p className="leading-6">Cada nova execução grava a linha do job primeiro, o que deixa o produto responsivo mesmo enquanto yt-dlp ou ffmpeg ainda trabalham.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {showReplaceWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-md space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-400/20">
                <AlertTriangle className="h-5 w-5 text-rose-300" />
              </div>
              <h3 className="text-xl font-semibold text-mist-50">Substituir item existente?</h3>
            </div>
            <p className="text-sm leading-6 text-mist-300">
              Sua política de sobrescrita está em <span className="font-medium text-mist-100">replace</span>. Se esta origem já existir na biblioteca,
              a entrada anterior e seu diretório serão removidos após a nova ingestão.
            </p>
            <p className="text-sm leading-6 text-mist-400">
              Esta ação não pode ser desfeita. Considere mudar para a política <span className="font-medium">skip</span> em Configurações se quiser preservar itens existentes.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setShowReplaceWarning(false)} className="flex-1">
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => void executeSubmit()} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Confirmar substituição
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
