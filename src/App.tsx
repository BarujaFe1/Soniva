import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/layout/AppShell";
import { PortfolioHeader } from "./components/PortfolioHeader";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { listJobs, readSettingsMap, countDashboardMetrics } from "./lib/repositories";
import { bootstrapApp, listLibraryItems } from "./lib/tauri";
import { isDemoLoaded, loadDemoData, subscribeWebStore } from "./lib/webStore";
import { usePolling } from "./hooks/usePolling";
import { ToastProvider, useToast } from "./hooks/useToast";
import { IngestPage } from "./pages/IngestPage";
import { JobsPage } from "./pages/JobsPage";
import { LibraryPage } from "./pages/LibraryPage";
import { OverviewPage } from "./pages/OverviewPage";
import { SettingsPage } from "./pages/SettingsPage";
import type {
  AppPage,
  BootstrapResponse,
  DashboardMetrics,
  IngestionJobRecord,
  LibraryFilter,
  LibraryListItem,
  SettingsPayload
} from "./types";

const defaultSettings: SettingsPayload = {
  libraryRoot: "",
  ytDlpPath: "",
  ffmpegPath: "",
  audioFormat: "mp3",
  overwritePolicy: "skip"
};

function AppContent() {
  const [page, setPage] = useState<AppPage>("overview");
  const [bootstrap, setBootstrap] = useState<BootstrapResponse | null>(null);
  const [jobs, setJobs] = useState<IngestionJobRecord[]>([]);
  const [library, setLibrary] = useState<LibraryListItem[]>([]);
  const [settings, setSettings] = useState<SettingsPayload>(defaultSettings);
  const [libraryQuery, setLibraryQuery] = useState("");
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>("all");
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalItems: 0,
    totalJobs: 0,
    completedJobs: 0,
    failedJobs: 0
  });
  const [demoLoaded, setDemoLoaded] = useState(isDemoLoaded());
  const [bootError, setBootError] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const { showToast } = useToast();

  const refreshBootstrap = useCallback(async () => {
    setBootstrap(await bootstrapApp());
  }, []);

  const refreshSettings = useCallback(async () => {
    const map = await readSettingsMap();
    setSettings({
      libraryRoot: map.library_root ?? "",
      ytDlpPath: map.yt_dlp_path ?? "",
      ffmpegPath: map.ffmpeg_path ?? "",
      audioFormat: (map.audio_format as "mp3") ?? "mp3",
      overwritePolicy: (map.overwrite_policy as "skip" | "replace") ?? "skip"
    });
  }, []);

  const refreshJobs = useCallback(async () => {
    setJobs((await listJobs()) as IngestionJobRecord[]);
  }, []);

  const refreshLibrary = useCallback(async () => {
    setLibrary(await listLibraryItems(libraryQuery, libraryFilter));
  }, [libraryFilter, libraryQuery]);

  const refreshMetrics = useCallback(async () => {
    setMetrics(await countDashboardMetrics());
  }, []);

  const fullRefresh = useCallback(async () => {
    try {
      setBootError(null);
      await Promise.all([
        refreshBootstrap(),
        refreshSettings(),
        refreshJobs(),
        refreshLibrary(),
        refreshMetrics()
      ]);
      setDemoLoaded(isDemoLoaded());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao inicializar o Soniva.";
      setBootError(message);
      showToast("error", message);
    } finally {
      setBooting(false);
    }
  }, [refreshBootstrap, refreshSettings, refreshJobs, refreshLibrary, refreshMetrics, showToast]);

  useEffect(() => {
    void fullRefresh();
  }, [fullRefresh]);

  // Demo journey: ?demo=1 auto-loads sample data once the web shell boots.
  useEffect(() => {
    if (booting || bootError) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") !== "1") return;
    if (isDemoLoaded()) return;
    loadDemoData();
    showToast("success", "Dados de demonstração carregados (?demo=1)");
    setPage("overview");
  }, [booting, bootError, showToast]);

  useEffect(() => {
    return subscribeWebStore(() => {
      void fullRefresh();
    });
  }, [fullRefresh]);

  usePolling(
    () => Promise.all([refreshJobs(), refreshLibrary(), refreshMetrics()]).then(() => undefined),
    3500,
    true
  );

  const latestJob = useMemo(() => jobs[0] ?? null, [jobs]);

  const handlePageChange = (newPage: AppPage) => {
    setPage(newPage);
  };

  const handleLoadDemo = () => {
    loadDemoData();
    showToast("success", "Dados de demonstração carregados");
    setPage("overview");
  };

  return (
    <div className="min-h-screen">
      <PortfolioHeader demoLoaded={demoLoaded} onLoadDemo={handleLoadDemo} />
      {booting ? (
        <div className="mx-auto flex min-h-[50vh] max-w-[1680px] items-center justify-center p-8 text-mist-300">
          Inicializando Soniva…
        </div>
      ) : bootError ? (
        <div className="mx-auto max-w-xl space-y-4 p-8">
          <div className="rounded-3xl border border-rose-400/30 bg-rose-400/10 p-6 text-rose-100">
            <h2 className="text-xl font-semibold">Não foi possível iniciar</h2>
            <p className="mt-3 text-sm leading-6">{bootError}</p>
            <button
              type="button"
              className="mt-5 rounded-2xl border border-white/20 px-4 py-2 text-sm text-mist-50 hover:bg-white/10"
              onClick={() => {
                setBooting(true);
                void fullRefresh();
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      ) : (
        <AppShell
          sidebar={<Sidebar page={page} onPageChange={handlePageChange} bootstrap={bootstrap} />}
          topbar={<Topbar bootstrap={bootstrap} />}
          page={page}
          onPageChange={handlePageChange}
        >
          {page === "overview" ? (
            <OverviewPage
              bootstrap={bootstrap}
              metrics={metrics}
              jobs={jobs}
              library={library}
              onPageChange={handlePageChange}
            />
          ) : null}
          {page === "ingest" ? (
            <IngestPage
              bootstrap={bootstrap}
              overwritePolicy={settings.overwritePolicy}
              onSubmitted={fullRefresh}
              latestJob={latestJob}
            />
          ) : null}
          {page === "library" ? (
            <LibraryPage
              items={library}
              query={libraryQuery}
              setQuery={setLibraryQuery}
              filter={libraryFilter}
              setFilter={setLibraryFilter}
              onPageChange={handlePageChange}
            />
          ) : null}
          {page === "jobs" ? (
            <JobsPage jobs={jobs} onRefresh={fullRefresh} onPageChange={handlePageChange} />
          ) : null}
          {page === "settings" ? (
            <SettingsPage initial={settings} bootstrap={bootstrap} onSaved={fullRefresh} />
          ) : null}
        </AppShell>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
