import { FolderRoot, ShieldCheck, Sparkles } from "lucide-react";
import type { BootstrapResponse } from "../types";
import { Badge } from "./ui/Badge";

export function Topbar({ bootstrap }: { bootstrap: BootstrapResponse | null }) {
  return (
    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Badge tone="accent">Desktop-first</Badge>
          <Badge tone="success">Local-first</Badge>
          <Badge tone="neutral">Authorized use only</Badge>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-gradient">
          A composed ingestion workflow for local media libraries.
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-mist-300">
          Configure a root directory, validate yt-dlp and ffmpeg, run ingestion jobs, and keep
          metadata, thumbnails, source traces, and extracted audio assets in one coherent local
          catalog.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-mist-400">
            <FolderRoot className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">Library root</span>
          </div>
          <p className="text-sm font-medium text-mist-50">
            {bootstrap?.libraryRoot || "Not configured yet"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-mist-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">yt-dlp</span>
          </div>
          <p className="text-sm font-medium text-mist-50">
            {bootstrap?.detectedYtDlpPath || "Resolve in settings"}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2 text-mist-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-[0.2em]">ffmpeg</span>
          </div>
          <p className="text-sm font-medium text-mist-50">
            {bootstrap?.detectedFfmpegPath || "Resolve in settings"}
          </p>
        </div>
      </div>
    </div>
  );
}
