import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  onClose: (id: string) => void;
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-mint-400" />,
    error: <XCircle className="h-5 w-5 text-rose-400" />,
    info: <AlertCircle className="h-5 w-5 text-accent-400" />
  };

  const styles = {
    success: "border-mint-400/20 bg-mint-400/10",
    error: "border-rose-400/20 bg-rose-400/10",
    info: "border-accent-400/20 bg-accent-400/10"
  };

  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 shadow-soft backdrop-blur-xl ${styles[type]}`}>
      {icons[type]}
      <p className="flex-1 text-sm leading-6 text-mist-50">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-mist-400 transition hover:text-mist-50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
