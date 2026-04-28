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
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-mist-400">Persistent history</p>
            <h3 className="text-2xl font-semibold text-mist-50">Ingestion jobs</h3>
          </div>
          <Button variant="secondary" onClick={() => void onRefresh()}><RefreshCcw className="h-4 w-4" />Refresh</Button>
        </div>
        {jobs.length === 0 ? (
          <EmptyState eyebrow="No jobs" title="There is no execution history yet." description="Once a job is created, this view will show stage transitions, progress, errors, and any linked media item.">
            <Button onClick={() => onPageChange("ingest")}>
              Create First Job
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
                    <p className="text-sm text-mist-400">{job.sourceKind === "url" ? "URL source" : "Local source"} · {formatDateTime(job.createdAt)}</p>
                  </div>
                  <span className="text-xs text-mist-500">{job.id}</span>
                </div>
                <div className="mt-3"><ProgressBar value={job.progress} /></div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-mist-300">
                  <span>Stage: {job.stage}</span>
                  <span>{loadingId === job.id ? "Loading details…" : formatDateTime(job.updatedAt)}</span>
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
              <p className="text-sm text-mist-400">Selected detail</p>
              <h3 className="text-xl font-semibold text-mist-50">Job inspection</h3>
            </div>
            {selected?.job.outputDirectory && (
              <Button 
                variant="secondary" 
                onClick={async () => {
                  try {
                    await openInFileManager(selected.job.outputDirectory!);
                    showToast("success", "Opened folder in file manager");
                  } catch (error) {
                    showToast("error", error instanceof Error ? error.message : "Failed to open folder");
                  }
                }}
              >
                <FolderOpen className="h-4 w-4" />
                Open Folder
              </Button>
            )}
          </div>
          {!selected ? (
            <EmptyState eyebrow="Nothing selected" title="Choose a job to inspect the full detail payload." description="This panel shows output paths, linked media, error state, and the structured metadata saved for the related library item." />
          ) : (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-mist-100">{selected.job.inputValue}</p>
                  <Badge tone={selected.job.status === "completed" ? "success" : selected.job.status === "failed" ? "danger" : "accent"}>{selected.job.status}</Badge>
                </div>
                <dl className="mt-4 space-y-2 text-sm text-mist-300">
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Stage</dt><dd>{selected.job.stage}</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Progress</dt><dd>{selected.job.progress}%</dd></div>
                  <div className="flex justify-between gap-4"><dt className="text-mist-400">Output directory</dt><dd className="max-w-[18rem] break-all text-right">{selected.job.outputDirectory || "—"}</dd></div>
                </dl>
              </div>

              {selected.job.errorMessage ? <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200"><p className="font-medium">Error trace</p><p className="mt-2 whitespace-pre-wrap leading-6">{selected.job.errorMessage}</p></div> : null}

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm font-medium text-mist-100">Log excerpt</p>
                <pre className="soniva-scrollbar mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{selected.job.logExcerpt || "No log excerpt persisted yet."}</pre>
              </div>

              {selected.detail ? <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4"><p className="text-sm font-medium text-mist-100">Linked media metadata</p><pre className="soniva-scrollbar mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{prettyJson(selected.detail.metadataJson)}</pre></div> : null}
            </div>
          )}
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-2 text-rose-200"><FileWarning className="h-5 w-5" /><h3 className="text-lg font-semibold">Failure posture</h3></div>
          {latestFailed ? (
            <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-100">
              <p className="font-medium">{latestFailed.inputValue}</p>
              <p className="mt-2 leading-6">Soniva does not swallow subprocess failures. The most recent failed job remains queryable, its logs stay attached to the record, and the UI exposes the error clearly.</p>
            </div>
          ) : (
            <p className="text-sm leading-6 text-mist-300">No failed job is visible right now. During demos, you can deliberately point ffmpeg or yt-dlp to an invalid path to show the error handling posture.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
