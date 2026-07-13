import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toMediaUrl } from "../lib/mediaUrl";

export function MediaPreview({
  path,
  alt,
  kind
}: {
  path: string | null | undefined;
  alt: string;
  kind: "image" | "audio";
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setFailed(false);
    setSrc(null);

    void toMediaUrl(path).then((url) => {
      if (!cancelled) setSrc(url);
    });

    return () => {
      cancelled = true;
    };
  }, [path]);

  if (!path) return null;

  if (!src || failed) {
    return (
      <div className="flex h-40 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-mist-400">
        <ImageOff className="h-4 w-4" />
        {kind === "audio"
          ? "Prévia de áudio indisponível neste ambiente"
          : "Prévia de imagem indisponível neste ambiente"}
      </div>
    );
  }

  if (kind === "audio") {
    return (
      <div>
        <p className="mb-2 text-sm font-medium text-mist-100">Prévia de áudio</p>
        <audio controls src={src} className="w-full" style={{ height: "40px" }} onError={() => setFailed(true)} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full rounded-2xl border border-white/10"
      onError={() => setFailed(true)}
    />
  );
}
