import { FlaskConical, Info } from "lucide-react";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

const PORTFOLIO_URL = "https://barujafe1.vercel.app";
const GITHUB_URL = "https://github.com/BarujaFe1/Soniva";

const STACK_BADGES = ["TypeScript", "React", "Vite", "Tauri", "SQLite"] as const;

export function PortfolioHeader({
  demoLoaded,
  onLoadDemo
}: {
  demoLoaded: boolean;
  onLoadDemo: () => void;
}) {
  return (
    <header className="border-b border-white/10 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-4 px-4 py-4 lg:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-mist-500">Projeto de portfólio · breadth</p>
              <h1 className="text-xl font-semibold tracking-tight text-mist-50">Soniva</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              {STACK_BADGES.map((badge) => (
                <Badge key={badge} tone="neutral">
                  {badge}
                </Badge>
              ))}
              <Badge tone="accent">Demo web (simulado)</Badge>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={onLoadDemo}>
              <FlaskConical className="h-4 w-4" />
              {demoLoaded ? "Recarregar dados de demonstração" : "Carregar dados de demonstração"}
            </Button>
            <a
              href={PORTFOLIO_URL}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-mist-100 transition hover:bg-white/[0.06]"
            >
              ← Portfólio
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-mist-100 transition hover:bg-white/[0.06]"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="leading-6">
            Esta é a <span className="font-medium text-amber-50">demo web em memória</span>: UI e fluxos
            reais do produto, sem yt-dlp/ffmpeg. O app desktop Tauri é a fonte de verdade para ingestão
            local. Use <code className="rounded bg-black/30 px-1.5 py-0.5 text-xs">?demo=1</code> para
            carregar dados automaticamente.
          </p>
        </div>
      </div>
    </header>
  );
}
