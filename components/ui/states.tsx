import { Button } from "./button";

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" aria-hidden />
      {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error | string; onRetry?: () => void }) {
  const message = typeof error === "string" ? error : error.message;
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-rose-200 bg-rose-50 px-6 py-10 text-center">
      <p className="text-sm font-medium text-rose-800">Something went wrong</p>
      <p className="max-w-md text-sm text-rose-700">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 px-6 py-12 text-center">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400" aria-hidden>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description && <p className="max-w-sm text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warning" | "error" | "success";
  title?: string;
  children?: React.ReactNode;
}) {
  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-800",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  }[tone];
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`} role={tone === "error" ? "alert" : "status"}>
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? "mt-0.5" : ""}>{children}</div>}
    </div>
  );
}
