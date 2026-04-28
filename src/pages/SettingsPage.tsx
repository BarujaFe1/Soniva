import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen, Loader2, SearchCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
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

  async function pickDirectory() {
    const selected = await open({ directory: true, multiple: false });
    if (typeof selected === "string") {
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
      showToast("success", "Settings saved successfully");
      await onSaved();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unable to save settings.";
      setMessage(errorMsg);
      showToast("error", errorMsg);
    } finally {
      setSaving(false);
    }
  }

  const ytStatus = ytProbe
    ? `${ytProbe.message}${ytProbe.version ? ` · ${ytProbe.version}` : ""}`
    : bootstrap?.detectedYtDlpPath
      ? `Auto-detected: ${bootstrap.detectedYtDlpPath}`
      : "Leave this blank if yt-dlp is already available on PATH.";

  const ffmpegStatus = ffmpegProbe
    ? `${ffmpegProbe.message}${ffmpegProbe.version ? ` · ${ffmpegProbe.version}` : ""}`
    : bootstrap?.detectedFfmpegPath
      ? `Auto-detected: ${bootstrap.detectedFfmpegPath}`
      : "Leave this blank if ffmpeg is already available on PATH.";

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-mist-400">Configuration</p>
            <h3 className="text-2xl font-semibold text-mist-50">Local environment settings</h3>
          </div>
          <Badge tone={ready ? "success" : "warning"}>{ready ? "Ready to ingest" : "Needs completion"}</Badge>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">Library root directory</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={form.libraryRoot}
              onChange={(event) => setForm((current) => ({ ...current, libraryRoot: event.target.value }))}
              placeholder="/Users/you/Media/Soniva Library"
            />
            <Button variant="secondary" onClick={() => void pickDirectory()}>
              <FolderOpen className="h-4 w-4" />Browse
            </Button>
          </div>
          <p className="text-sm text-mist-400">This is the only managed storage location used by Soniva.</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">yt-dlp path</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={form.ytDlpPath}
              onChange={(event) => setForm((current) => ({ ...current, ytDlpPath: event.target.value }))}
              placeholder="/usr/local/bin/yt-dlp"
            />
            <Button variant="secondary" onClick={() => void probe("yt-dlp")}>
              <SearchCheck className="h-4 w-4" />Detect
            </Button>
          </div>
          <p className="text-sm text-mist-400">{ytStatus}</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-mist-400">ffmpeg path</label>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
              value={form.ffmpegPath}
              onChange={(event) => setForm((current) => ({ ...current, ffmpegPath: event.target.value }))}
              placeholder="/usr/local/bin/ffmpeg"
            />
            <Button variant="secondary" onClick={() => void probe("ffmpeg")}>
              <SearchCheck className="h-4 w-4" />Detect
            </Button>
          </div>
          <p className="text-sm text-mist-400">{ffmpegStatus}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="block text-sm text-mist-400">Extracted audio format</label>
            <Select value={form.audioFormat} onChange={(event) => setForm((current) => ({ ...current, audioFormat: event.target.value as "mp3" }))}>
              <option value="mp3">MP3 (V1 default)</option>
            </Select>
          </div>
          <div className="space-y-3">
            <label className="block text-sm text-mist-400">Overwrite policy</label>
            <Select value={form.overwritePolicy} onChange={(event) => setForm((current) => ({ ...current, overwritePolicy: event.target.value as "skip" | "replace" }))}>
              <option value="skip">Skip when the same source already exists</option>
              <option value="replace">Replace the previous cataloged source after a successful rerun</option>
            </Select>
          </div>
        </div>

        {message ? <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-mist-200">{message}</div> : null}

        <div className="flex items-center justify-end">
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save settings
          </Button>
        </div>
      </Card>

      <div className="grid gap-6">
        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Path policy</p>
            <h3 className="text-xl font-semibold text-mist-50">Why the app allows blank binary paths</h3>
          </div>
          <p className="text-sm leading-6 text-mist-300">
            Soniva prefers transparent local dependencies over hidden installers. Explicit paths are optional
            as long as the selected binary can be auto-detected from PATH at runtime.
          </p>
          <ul className="space-y-2 text-sm text-mist-300">
            <li>• The library root is always required.</li>
            <li>• yt-dlp is required for URL ingestion only.</li>
            <li>• ffmpeg is required for both URL and local-file ingestion.</li>
          </ul>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-sm text-mist-400">Operational defaults</p>
            <h3 className="text-xl font-semibold text-mist-50">V1 choices</h3>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Extracted format</p>
            <p className="mt-2 leading-6">MP3 is the single V1 output to keep setup stable and simplify demo validation. The schema is already ready for additional formats in a future round.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 text-sm text-mist-300">
            <p className="font-medium text-mist-100">Overwrite posture</p>
            <p className="mt-2 leading-6">Skip reuses the existing cataloged item when Soniva recognizes the same source. Replace performs a fresh run first and then removes the previous catalog entry when the new output succeeds.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
