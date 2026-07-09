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
import type { AppPage, BootstrapResponse, DashboardMetrics, IngestionJobRecord, LibraryFilter, LibraryListItem, SettingsPayload } from "./types";

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
  const [metrics, setMetrics] = useState<DashboardMetrics>({ totalItems: 0, totalJobs: 0, completedJobs: 0, failedJobs: 0 });
  const [demoLoaded, setDemoLoaded] = useState(isDemoLoaded());
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
    await Promise.all([refreshBootstrap(), refreshSettings(), refreshJobs(), refreshLibrary(), refreshMetrics()]);
    setDemoLoaded(isDemoLoaded());
  }, [refreshBootstrap, refreshSettings, refreshJobs, refreshLibrary, refreshMetrics]);

  useEffect(() => {
    void fullRefresh();
  }, [fullRefresh]);

  useEffect(() => {
    return subscribeWebStore(() => {
      void fullRefresh();
    });
  }, [fullRefresh]);

  usePolling(() => Promise.all([refreshJobs(), refreshLibrary(), refreshMetrics()]).then(() => undefined), 3500, true);

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
      <AppShell sidebar={<Sidebar page={page} onPageChange={handlePageChange} bootstrap={bootstrap} />} topbar={<Topbar bootstrap={bootstrap} />}>
        {page === "overview" ? <OverviewPage bootstrap={bootstrap} metrics={metrics} jobs={jobs} library={library} onPageChange={handlePageChange} /> : null}
        {page === "ingest" ? <IngestPage bootstrap={bootstrap} onSubmitted={fullRefresh} latestJob={latestJob} /> : null}
        {page === "library" ? <LibraryPage items={library} query={libraryQuery} setQuery={setLibraryQuery} filter={libraryFilter} setFilter={setLibraryFilter} onPageChange={handlePageChange} /> : null}
        {page === "jobs" ? <JobsPage jobs={jobs} onRefresh={fullRefresh} onPageChange={handlePageChange} /> : null}
        {page === "settings" ? <SettingsPage initial={settings} bootstrap={bootstrap} onSaved={fullRefresh} /> : null}
      </AppShell>
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
