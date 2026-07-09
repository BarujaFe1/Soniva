import { FolderOpen, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import type { AppPage, LibraryFilter, LibraryListItem, MediaItemDetail } from "../types";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { Input } from "../components/ui/Input";
import { formatBytes, formatDateTime, formatDuration, prettyJson } from "../lib/utils";
import { getMediaItemDetail, openInFileManager } from "../lib/tauri";
import { useToast } from "../hooks/useToast";

export function LibraryPage({
  items,
  query,
  setQuery,
  filter,
  setFilter,
  onPageChange
}: {
  items: LibraryListItem[];
  query: string;
  setQuery: (value: string) => void;
  filter: LibraryFilter;
  setFilter: (value: LibraryFilter) => void;
  onPageChange: (page: AppPage) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<MediaItemDetail | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const nextId = items[0]?.id ?? null;
    setSelectedId((current) => current ?? nextId);
  }, [items]);

  useEffect(() => {
    if (!selectedId) return setDetail(null);
    void getMediaItemDetail(selectedId).then(setDetail);
  }, [selectedId]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-mist-400">Catálogo</p>
            <h3 className="text-2xl font-semibold text-mist-50">Biblioteca local</h3>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {([
              { value: "all", label: "todos" },
              { value: "ready", label: "prontos" },
              { value: "failed", label: "falhas" }
            ] as const).map(({ value, label }) => (
              <Button key={value} variant={filter === value ? "primary" : "secondary"} onClick={() => setFilter(value)}>
                {label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.02] px-4 py-3">
          <Search className="h-4 w-4 text-mist-400" />
          <Input className="border-0 bg-transparent px-0 py-0 focus:ring-0" placeholder="Buscar por título, fonte ou uploader" value={query} onChange={(event) => setQuery(event.target.value)} />
          <SlidersHorizontal className="h-4 w-4 text-mist-500" />
        </div>

        {items.length === 0 ? (
          <EmptyState eyebrow="Nenhum item" title="A consulta atual da biblioteca não retornou linhas." description="Limpe a busca, volte o filtro para todos ou enfileire um novo job de ingestão autorizada.">
            <Button onClick={() => onPageChange("ingest")}>
              Ir para ingestão
            </Button>
          </EmptyState>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <button key={item.id} onClick={() => setSelectedId(item.id)} className={`w-full rounded-3xl border p-4 text-left transition ${item.id === selectedId ? "border-accent-400/40 bg-accent-500/10" : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium text-mist-100">{item.title}</h4>
                    <p className="text-sm text-mist-400">{item.sourceLabel || "Arquivo local"}</p>
                  </div>
                  <Badge tone={item.status === "ready" ? "success" : item.status === "failed" ? "danger" : "warning"}>{item.status}</Badge>
                </div>
                <dl className="mt-4 grid gap-2 text-sm text-mist-300 sm:grid-cols-3">
                  <div><dt className="text-mist-500">Duração</dt><dd>{formatDuration(item.durationSeconds)}</dd></div>
                  <div><dt className="text-mist-500">Tamanho</dt><dd>{formatBytes(item.fileSizeBytes)}</dd></div>
                  <div><dt className="text-mist-500">Criado</dt><dd>{formatDateTime(item.createdAt)}</dd></div>
                </dl>
              </button>
            ))}
          </div>
        )}
      </Card>

      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-mist-400">Item selecionado</p>
            <h3 className="text-xl font-semibold text-mist-50">Inspetor de detalhes</h3>
          </div>
          {detail && (
            <Button 
              variant="secondary" 
              onClick={async () => {
                try {
                  await openInFileManager(detail.item.libraryDir);
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
        {!detail ? (
          <EmptyState eyebrow="Nenhum item selecionado" title="Escolha um item do catálogo." description="Ao selecionar uma linha, este inspetor mostra caminhos de thumbnail, áudio extraído, rastro da origem e metadados estruturados." />
        ) : (
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-mist-50">{detail.item.title}</h4>
                  <p className="mt-1 text-sm text-mist-400">{detail.item.sourceLabel || "Arquivo local"}</p>
                </div>
                <Badge tone={detail.item.status === "ready" ? "success" : "warning"}>{detail.item.status}</Badge>
              </div>

              {detail.item.thumbnailPath && (
                <div className="mt-4">
                  <img 
                    src={`asset://localhost/${detail.item.thumbnailPath.replace(/\\/g, '/')}`} 
                    alt={detail.item.title}
                    className="w-full rounded-2xl border border-white/10"
                    onError={(e) => { 
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] text-mist-400';
                      fallback.innerHTML = '<svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>';
                      e.currentTarget.parentElement?.appendChild(fallback);
                    }}
                  />
                </div>
              )}

              {detail.item.audioPath && (
                <div className="mt-4">
                  <p className="mb-2 text-sm font-medium text-mist-100">Prévia de áudio</p>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-mist-400">
                    Asset local: {detail.item.audioPath}
                  </div>
                </div>
              )}

              <dl className="mt-4 space-y-3 text-sm text-mist-300">
                <div><dt className="text-mist-500">Diretório da biblioteca</dt><dd className="mt-1 break-all text-mist-50">{detail.item.libraryDir}</dd></div>
                <div><dt className="text-mist-500">Caminho da mídia de origem</dt><dd className="mt-1 break-all text-mist-50">{detail.item.sourceMediaPath || "—"}</dd></div>
                <div><dt className="text-mist-500">Áudio extraído</dt><dd className="mt-1 break-all text-mist-50">{detail.item.audioPath || "Nenhum asset de áudio persistido ainda."}</dd></div>
                <div><dt className="text-mist-500">Thumbnail</dt><dd className="mt-1 break-all text-mist-50">{detail.item.thumbnailPath || "—"}</dd></div>
                <div><dt className="text-mist-500">URL remota</dt><dd className="mt-1 break-all text-mist-50">{detail.remoteUrl || "—"}</dd></div>
              </dl>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-mist-100">Metadados do item (JSON)</p>
              <pre className="soniva-scrollbar mt-3 max-h-60 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{prettyJson(detail.metadataJson)}</pre>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-sm font-medium text-mist-100">Metadados da origem (JSON)</p>
              <pre className="soniva-scrollbar mt-3 max-h-60 overflow-auto whitespace-pre-wrap text-xs leading-6 text-mist-300">{prettyJson(detail.sourceMetadataJson)}</pre>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
