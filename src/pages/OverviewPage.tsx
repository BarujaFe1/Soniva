import { AlertTriangle, AudioLines, CheckCircle2, LibraryBig } from "lucide-react";
import type { AppPage, BootstrapResponse, DashboardMetrics, IngestionJobRecord, LibraryListItem } from "../types";
import { formatDateTime, relativeTime } from "../lib/utils";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { StatCard } from "../components/ui/StatCard";

export function OverviewPage({
  bootstrap,
  metrics,
  jobs,
  library,
  onPageChange
}: {
  bootstrap: BootstrapResponse | null;
  metrics: DashboardMetrics;
  jobs: IngestionJobRecord[];
  library: LibraryListItem[];
  onPageChange: (page: AppPage) => void;
}) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        <StatCard label="Itens na biblioteca" value={metrics.totalItems} hint="Mídia catalogada localmente" icon={<LibraryBig className="h-4 w-4" />} />
        <StatCard label="Jobs registrados" value={metrics.totalJobs} hint="Histórico persistente de execução" icon={<AudioLines className="h-4 w-4" />} />
        <StatCard label="Concluídos" value={metrics.completedJobs} hint="Ingestões bem-sucedidas" icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Atenção" value={metrics.failedJobs} hint="Jobs com falha para revisão" icon={<AlertTriangle className="h-4 w-4" />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mist-400">Jobs recentes</p>
              <h3 className="text-xl font-semibold text-mist-50">Rastro de execução</h3>
            </div>
            <Badge tone="neutral">{jobs.length} visíveis</Badge>
          </div>
          {jobs.length === 0 ? (
            <EmptyState eyebrow="Nenhum job ainda" title="A fila está vazia." description="Configure as opções primeiro ou carregue os dados de demonstração para explorar o fluxo completo.">
              <Button onClick={() => onPageChange(bootstrap?.libraryRoot ? "ingest" : "settings")}>
                {bootstrap?.libraryRoot ? "Criar primeiro job" : "Abrir configurações"}
              </Button>
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <article key={job.id} className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-mist-100">{job.inputValue}</h4>
                      <p className="mt-1 text-xs text-mist-400">Criado {relativeTime(job.createdAt)} · Atualizado {formatDateTime(job.updatedAt)}</p>
                    </div>
                    <Badge tone={job.status === "completed" ? "success" : job.status === "failed" ? "danger" : "accent"}>{job.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-mist-300">
                    Etapa: <span className="text-mist-50">{job.stage}</span>
                  </p>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Ambiente</p>
            <h3 className="text-xl font-semibold text-mist-50">Espaço resolvido</h3>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-mist-400">Diretório de dados do app</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.appDataDir ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-mist-400">Banco SQLite</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.databasePath ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-mist-400">Raiz da biblioteca</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.libraryRoot ?? "—"}</dd>
            </div>
          </dl>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Nota de portfólio</p>
            <p className="mt-2 leading-6">
              O Soniva prioriza fluxos locais previsíveis: SQLite para persistência, núcleo Rust
              compacto para integrações de SO e superfície React otimizada para clareza. Esta demo
              web simula o estado sem binários nativos.
            </p>
          </div>
        </Card>
      </section>

      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-mist-400">Prévia da biblioteca</p>
            <h3 className="text-xl font-semibold text-mist-50">Entradas mais recentes</h3>
          </div>
          <Badge tone="neutral">{library.length} itens carregados</Badge>
        </div>
        {library.length === 0 ? (
          <EmptyState eyebrow="Biblioteca vazia" title="Nada foi ingerido ainda." description="Após o primeiro job bem-sucedido — ou ao carregar a demo — o Soniva mostra áudio extraído, metadados e diretório gerenciado.">
            <Button onClick={() => onPageChange("ingest")}>
              Ir para ingestão
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {library.slice(0, 3).map((item) => (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-mist-100">{item.title}</h4>
                    <p className="mt-1 text-sm text-mist-400">{item.sourceLabel || "Fonte local"}</p>
                  </div>
                  <Badge tone={item.status === "ready" ? "success" : "warning"}>{item.status}</Badge>
                </div>
                <p className="mt-3 break-all text-xs leading-5 text-mist-400">{item.libraryDir}</p>
              </article>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
