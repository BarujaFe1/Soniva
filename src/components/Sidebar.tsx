import { AudioLines, House, LibraryBig, ListChecks, Settings } from "lucide-react";
import type { AppPage, BootstrapResponse } from "../types";
import { cn } from "../lib/utils";

const nav = [
  { id: "overview", label: "Visão geral", icon: House },
  { id: "ingest", label: "Ingestão autorizada", icon: AudioLines },
  { id: "library", label: "Biblioteca", icon: LibraryBig },
  { id: "jobs", label: "Jobs", icon: ListChecks },
  { id: "settings", label: "Configurações", icon: Settings }
] as const;

export function Sidebar({
  page,
  onPageChange,
  bootstrap
}: {
  page: AppPage;
  onPageChange: (page: AppPage) => void;
  bootstrap: BootstrapResponse | null;
}) {
  return (
    <div className="flex h-full flex-col gap-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-accent-500/20 text-accent-300">
            <AudioLines className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Soniva</h1>
            <p className="text-sm text-mist-400">Ingestão autorizada, localmente.</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-mist-300">
          Pensado para fontes de domínio público, licenciadas ou de outra forma permitidas. Cada
          artefato permanece na máquina que você controla.
        </p>
      </div>

      <nav className="space-y-2">
        {nav.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onPageChange(id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
              page === id
                ? "bg-white/[0.08] text-white"
                : "text-mist-300 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-mist-300">
        <p className="font-medium text-mist-100">Espaço de trabalho</p>
        <p className="mt-2 break-all text-xs leading-5 text-mist-400">
          DB: {bootstrap?.databasePath ?? "Aguardando bootstrap…"}
        </p>
      </div>
    </div>
  );
}
