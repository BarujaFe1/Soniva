import type { PropsWithChildren, ReactNode } from "react";
import type { AppPage } from "../../types";
import { cn } from "../../lib/utils";
import { AudioLines, House, LibraryBig, ListChecks, Settings } from "lucide-react";

const mobileNav = [
  { id: "overview" as const, label: "Visão", icon: House },
  { id: "ingest" as const, label: "Ingestão", icon: AudioLines },
  { id: "library" as const, label: "Biblioteca", icon: LibraryBig },
  { id: "jobs" as const, label: "Jobs", icon: ListChecks },
  { id: "settings" as const, label: "Ajustes", icon: Settings }
];

export function AppShell({
  sidebar,
  topbar,
  children,
  page,
  onPageChange
}: PropsWithChildren<{
  sidebar: ReactNode;
  topbar: ReactNode;
  page: AppPage;
  onPageChange: (page: AppPage) => void;
}>) {
  return (
    <div className="bg-hero-glow text-mist-50">
      <div className="mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1680px] grid-cols-1 gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
        <aside className="panel hidden lg:block lg:p-4">{sidebar}</aside>
        <main className="flex min-h-[calc(100vh-7rem)] flex-col gap-6">
          <nav
            aria-label="Navegação principal"
            className="panel flex gap-2 overflow-x-auto px-3 py-3 lg:hidden"
          >
            {mobileNav.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => onPageChange(id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2 text-sm transition",
                  page === id
                    ? "bg-white/[0.1] text-white"
                    : "text-mist-300 hover:bg-white/[0.05] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
          <header className="panel px-6 py-5">{topbar}</header>
          <div className="grid flex-1 gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
