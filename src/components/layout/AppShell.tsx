import type { PropsWithChildren, ReactNode } from "react";

export function AppShell({
  sidebar,
  topbar,
  children
}: PropsWithChildren<{ sidebar: ReactNode; topbar: ReactNode }>) {
  return (
    <div className="bg-hero-glow text-mist-50">
      <div className="mx-auto grid min-h-[calc(100vh-5.5rem)] max-w-[1680px] grid-cols-1 gap-6 p-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:p-6">
        <aside className="panel hidden lg:block lg:p-4">{sidebar}</aside>
        <main className="flex min-h-[calc(100vh-7rem)] flex-col gap-6">
          <header className="panel px-6 py-5">{topbar}</header>
          <div className="grid flex-1 gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
