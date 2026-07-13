import { useMemo, useState } from "react";
import { FileWarning, FolderOpen, RefreshCcw } from "lucide-react";
import type { AppPage, IngestionJobRecord, JobDetailResponse } from "../types";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ProgressBar } from "../components/ui/ProgressBar";
import { formatDateTime, prettyJson } from "../lib/utils";
import { getJobDetail, openInFileManager } from "../lib/tauri";
import { useToast } from "../hooks/useToast";

export function JobsPage({ jobs, onRefresh, onPageChange }: { jobs: IngestionJobRecord[]; onRefresh: () => Promise<void>; onPageChange: (page: AppPage) => void }) {
  const [selected, setSelected] = useState<JobDetailResponse | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const latestFailed = useMemo(() => jobs.find((job) => job.status === "failed") ?? null, [jobs]);
  const { showToast } = useToast();

  async function handleSelect(job: IngestionJobRecord) {
    setLoadingId(job.id);
    try {
      setSelected(await getJobDetail(job.id));
    } catch (error) {
      setSelected(null);
      showToast("error", error instanceof Error ? error.message : "Falha ao carregar detalhes do job");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-mist-400">Histórico persistente</p>
            <h3 className="text-2xl font-semibold text-mist-50">Jobs de ingestão</h3>
          </div>
          <Button variant="secondary" onClick={() => void onRefresh()}><RefreshCcw className="h-4 w-4" />Atualizar</Button>
        </div>
        {jobs.length === 0 ? (
          <EmptyState eyebrow="Sem jobs" title="Ainda não há histórico de execução." description="Quando um job for criado, esta view mostrará etapas, progresso, erros e o item de mídia vinculado.">
            <Button onClick={() => onPageChange("ingest")}>
              Criar primeiro job
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <button key={job.id} className="w-full rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-left transition hover:bg-white/[0.04]" onClick={() => void handleSelect(job)}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-mist-100">{job.inputValue}</p>
                      <Badge tone={job.status === "completed" ? "success" : job.status === "failed" ? "danger" : "accent"}>{job.status}</Badge>
                    </div>
                    <p className="text-sm text-mist-400">{job.sourceKind === "url" ? "Origem URL" : "Origem local"} · {formatDateTime(job.createdAt)}</p>
                  </div>
                  <span className="text-xs text-mist-500">{job.id}</span>
                </div>
                <div className="mt-3"><ProgressBar value={job.progress} /></div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-mist-300">
                  <span>Etapa: {job.stage}</span>
                  <span>{loadingId === job.id ? "Carregando detalhes…" : formatDateTime(job.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mist-400">Detalhe selecionado</p>
              <h3 className="text-xl font-semibold text-mist-50">Inspeção do job</h3>
            </div>
            {selected?.job.outputDirectory && (
              <Button 
                variant="secondary" 
                onClick={async () => {
                  try {
                    await openInFileManager(selected.job.outputDirectory!);
                    showToast("success", "Pasta aberta no gerenciador (demo web: ver console)");
                  } catch (error) {
                    showToast("error", error instanceof Error ? error.message : "Falha ao abrir pasta");
                  }
                }}
              >
                <FolderOpen className="h-4 w-4" />
                Abrir pasta
              </Button>
            )}
          </div>
          {!selected ? (
            <EmptyState eyebrow="Nada selecionado" title="Escolha um job para inspecionar o payload completo." description="Este painel mostra caminhos de saída, mídia vinculada, estado de erro e metadados estruturados do item relacionado." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-mist-100">{selected.job.inputValue}</p>
                  <Badge tone={selected.job.status === "completed" ? "success" : selected.job.status === "failed" ? "danger" : "accent"}>{selected.job.status}</Badge>
                </div>
                <dl className="mt-4 space-y-2 text-sm text-mist-300">
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Etapa</dt><dd>{selected.job.stage}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Progresso</dt><dd>{selected.job.progress}%</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Diretório de saída</dt><dd className="max-w-[18rem] break-all text-right">{selected.job.outputDirectory || "—"}</dd></div>
                </dl>
              </div>

              {selected.job.errorMessage ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200"><p className="font-medium">Rastro de erro</p><p className="mt-2 whitespace-pre-wrap leading-6">{selected.job.errorMessage}</p></div> : null}

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm font-medium text-mist-100">Trecho de log</p>
                <pre className="soniva-scrollbar mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{selected.job.logExcerpt || "Nenhum trecho de log persistido ainda."}</pre>
              </div>

              {selected.detail ? <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4"><p className="text-sm font-medium text-mist-100">Metadados da mídia vinculada</p><pre className="soniva-scrollbar mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{prettyJson(selected.detail.metadataJson)}</pre></div> : null}
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-2 text-rose-200"><FileWarning className="h-5 w-5" /><h3 className="text-lg font-semibold">Postura de falha</h3></div>
          {latestFailed ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
              <p className="font-medium">{latestFailed.inputValue}</p>
              <p className="mt-2 leading-6">O Soniva não engole falhas de subprocesso. O job com falha mais recente permanece consultável, os logs ficam no registro e a UI expõe o erro com clareza.</p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-mist-300">Nenhum job com falha visível agora. Na demo, carregue os dados de demonstração para inspecionar um exemplo de falha.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
