import { FolderOpen, Loader2, SearchCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { pickDirectory } from "../lib/dialog";
import { detectBinary, saveSettings } from "../lib/tauri";
import { useToast } from "../hooks/useToast";
import type { BinaryProbe, BootstrapResponse, SettingsPayload } from "../types";

export function SettingsPage({
  initial,
  bootstrap,
  onSaved
}: {
  initial: SettingsPayload;
  bootstrap: BootstrapResponse | null;
  onSaved: () => Promise<void>;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [ytProbe, setYtProbe] = useState<BinaryProbe | null>(null);
  const [ffmpegProbe, setFfmpegProbe] = useState<BinaryProbe | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const effectiveYtPath = ytProbe?.resolvedPath ?? bootstrap?.detectedYtDlpPath ?? null;
  const effectiveFfmpegPath = ffmpegProbe?.resolvedPath ?? bootstrap?.detectedFfmpegPath ?? null;
  const ready = useMemo(
    () => Boolean(form.libraryRoot.trim() && effectiveYtPath && effectiveFfmpegPath),
    [effectiveFfmpegPath, effectiveYtPath, form.libraryRoot]
  );

  async function handlePickDirectory() {
    const selected = await pickDirectory();
    if (selected) {
      setForm((current) => ({ ...current, libraryRoot: selected }));
    }
  }

  async function probe(binaryName: "yt-dlp" | "ffmpeg") {
    setMessage(null);
    const result = await detectBinary(binaryName, binaryName === "yt-dlp" ? form.ytDlpPath : form.ffmpegPath);
    if (binaryName === "yt-dlp") {
      setYtProbe(result);
      if (result.found && result.resolvedPath) {
        setForm((current) => ({ ...current, ytDlpPath: result.resolvedPath! }));
      }
    } else {
      setFfmpegProbe(result);
      if (result.found && result.resolvedPath) {
        setForm((current) => ({ ...current, ffmpegPath: result.resolvedPath! }));
      }
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const result = await saveSettings(form);
      setMessage(result.message);
      showToast("success", "Configurações salvas com sucesso");
      await onSaved();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Não foi possível salvar as configurações.";
      setMessage(errorMsg);
      showToast("error", errorMsg);
    } finally {
      setSaving(false);
    }
  }

  const ytStatus = ytProbe
    ? `${ytProbe.message}${ytProbe.version ? ` · ${ytProbe.version}` : ""}`
    : bootstrap?.detectedYtDlpPath
      ? `Detectado automaticamente: ${bootstrap.detectedYtDlpPath}`
      : "Deixe em branco se o yt-dlp já estiver no PATH.";

  const ffmpegStatus = ffmpegProbe
    ? `${ffmpegProbe.message}${ffmpegProbe.version ? ` · ${ffmpegProbe.version}` : ""}`
    : bootstrap?.detectedFfmpegPath
      ? `Detectado automaticamente: ${bootstrap.detectedFfmpegPath}`
      : "Deixe em branco se o ffmpeg já estiver no PATH.";

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-mist-400">Configuração</p>
            <h3 className="text-2xl font-semibold text-mist-50">Ambiente local</h3>
          </div>
          <Badge tone={ready ? "success" : "warning"}>{ready ? "Pronto para ingerir" : "Precisa completar"}</Badge>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">Diretório raiz da biblioteca</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={form.libraryRoot}
              onChange={(event) => setForm((current) => ({ ...current, libraryRoot: event.target.value }))}
              placeholder="C:/Users/voce/Media/Soniva Library"
            />
            <Button variant="secondary" onClick={() => void handlePickDirectory()}>
              <FolderOpen className="h-4 w-4" />Escolher
            </Button>
          </div>
          <p className="text-sm text-mist-400">Este é o único local de armazenamento gerenciado pelo Soniva.</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">Caminho do yt-dlp</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={form.ytDlpPath}
              onChange={(event) => setForm((current) => ({ ...current, ytDlpPath: event.target.value }))}
              placeholder="C:/Tools/yt-dlp.exe"
            />
            <Button variant="secondary" onClick={() => void probe("yt-dlp")}>
              <SearchCheck className="h-4 w-4" />Detectar
            </Button>
          </div>
          <p className="text-sm text-mist-400">{ytStatus}</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">Caminho do ffmpeg</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={form.ffmpegPath}
              onChange={(event) => setForm((current) => ({ ...current, ffmpegPath: event.target.value }))}
              placeholder="C:/Tools/ffmpeg.exe"
            />
            <Button variant="secondary" onClick={() => void probe("ffmpeg")}>
              <SearchCheck className="h-4 w-4" />Detectar
            </Button>
          </div>
          <p className="text-sm text-mist-400">{ffmpegStatus}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm text-mist-400">Formato de áudio extraído</label>
            <Select value={form.audioFormat} onChange={(event) => setForm((current) => ({ ...current, audioFormat: event.target.value as "mp3" }))}>
              <option value="mp3">MP3 (padrão V1)</option>
            </Select>
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-mist-400">Política de sobrescrita</label>
            <Select value={form.overwritePolicy} onChange={(event) => setForm((current) => ({ ...current, overwritePolicy: event.target.value as "skip" | "replace" }))}>
              <option value="skip">Ignorar quando a mesma origem já existir</option>
              <option value="replace">Substituir a origem catalogada após um rerun bem-sucedido</option>
            </Select>
          </div>
        </div>

        {message ? <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-mist-200">{message}</div> : null}

        <div className="flex items-center justify-end">
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Salvar configurações
          </Button>
        </div>
      </Card>

      <div className="grid gap-6">
        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Política de caminhos</p>
            <h3 className="text-xl font-semibold text-mist-50">Por que caminhos em branco são permitidos</h3>
          </div>
          <p className="text-sm leading-6 text-mist-300">
            O Soniva prefere dependências locais transparentes a instaladores ocultos. Caminhos explícitos são opcionais
            desde que o binário possa ser detectado automaticamente no PATH em tempo de execução.
          </p>
          <ul className="space-y-2 text-sm text-mist-300">
            <li>• A raiz da biblioteca é sempre obrigatória.</li>
            <li>• O yt-dlp é necessário apenas para ingestão por URL.</li>
            <li>• O ffmpeg é necessário para ingestão por URL e por arquivo local.</li>
          </ul>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Padrões operacionais</p>
            <h3 className="text-xl font-semibold text-mist-50">Escolhas da V1</h3>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Formato extraído</p>
            <p className="mt-2 leading-6">MP3 é a única saída da V1 para manter o setup estável e simplificar a validação em demos. O schema já está pronto para formatos adicionais.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Postura de sobrescrita</p>
            <p className="mt-2 leading-6">Skip reutiliza o item catalogado quando a mesma origem é reconhecida. Replace executa um novo run e remove a entrada anterior quando a nova saída for bem-sucedida.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
