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
        <StatCard label="Library items" value={metrics.totalItems} hint="Media catalogued locally" icon={<LibraryBig className="h-4 w-4" />} />
        <StatCard label="Jobs recorded" value={metrics.totalJobs} hint="Persistent execution history" icon={<AudioLines className="h-4 w-4" />} />
        <StatCard label="Completed" value={metrics.completedJobs} hint="Successful ingestion runs" icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatCard label="Needs attention" value={metrics.failedJobs} hint="Failed jobs available for review" icon={<AlertTriangle className="h-4 w-4" />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mist-400">Recent jobs</p>
              <h3 className="text-xl font-semibold text-mist-50">Execution trace</h3>
            </div>
            <Badge tone="neutral">{jobs.length} visible</Badge>
          </div>
          {jobs.length === 0 ? (
            <EmptyState eyebrow="No jobs yet" title="The queue is empty." description="Configure settings first, then start with a short authorized URL or a local media file to generate your first persisted job history.">
              <Button onClick={() => onPageChange(bootstrap?.libraryRoot ? "ingest" : "settings")}>
                {bootstrap?.libraryRoot ? "Create First Job" : "Configure Settings"}
              </Button>
            </EmptyState>
          ) : (
            <div className="space-y-3">
              {jobs.slice(0, 5).map((job) => (
                <article key={job.id} className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-medium text-mist-100">{job.inputValue}</h4>
                      <p className="mt-1 text-xs text-mist-400">Created {relativeTime(job.createdAt)} · Updated {formatDateTime(job.updatedAt)}</p>
                    </div>
                    <Badge tone={job.status === "completed" ? "success" : job.status === "failed" ? "danger" : "accent"}>{job.status}</Badge>
                  </div>
                  <p className="mt-3 text-sm text-mist-300">
                    Stage: <span className="text-mist-50">{job.stage}</span>
                  </p>
                </article>
              ))}
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Environment</p>
            <h3 className="text-xl font-semibold text-mist-50">Resolved workspace</h3>
          </div>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-mist-400">Application data directory</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.appDataDir ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-mist-400">SQLite database</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.databasePath ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-mist-400">Configured library root</dt>
              <dd className="mt-1 break-all text-mist-50">{bootstrap?.libraryRoot ?? "—"}</dd>
            </div>
          </dl>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Portfolio note</p>
            <p className="mt-2 leading-6">
              Soniva intentionally favors predictable local workflows over feature inflation:
              SQLite for persistence, a compact Rust core for OS integrations, and a React surface
              optimized for clarity and screenshots.
            </p>
          </div>
        </Card>
      </section>

      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-mist-400">Library preview</p>
            <h3 className="text-xl font-semibold text-mist-50">Newest catalog entries</h3>
          </div>
          <Badge tone="neutral">{library.length} items loaded</Badge>
        </div>
        {library.length === 0 ? (
          <EmptyState eyebrow="Library is empty" title="Nothing has been ingested yet." description="After the first successful job, Soniva will show extracted audio, metadata footprint, library directory, and the most recent thumbnail when available.">
            <Button onClick={() => onPageChange("ingest")}>
              Go to Ingest
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3">
            {library.slice(0, 3).map((item) => (
              <article key={item.id} className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-medium text-mist-100">{item.title}</h4>
                    <p className="mt-1 text-sm text-mist-400">{item.sourceLabel || "Local source"}</p>
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
