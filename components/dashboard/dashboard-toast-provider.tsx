"use client";

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  TOAST_MESSAGES,
  legacyToastKeyFromParams,
  type ToastVariant,
} from "@/lib/dashboard/toast-messages";

type ToastItem = {
  id: string;
  message: string;
  variant: ToastVariant;
};

type DashboardToastContextValue = {
  pushToast: (message: string, variant?: ToastVariant) => void;
};

const DashboardToastContext = createContext<DashboardToastContextValue | null>(
  null,
);

export function useDashboardToast() {
  const ctx = useContext(DashboardToastContext);
  if (!ctx) {
    throw new Error("useDashboardToast must be used within DashboardToastProvider");
  }
  return ctx;
}

function ToastCard({ message, variant }: { message: string; variant: ToastVariant }) {
  const isError = variant === "error";
  return (
    <div
      role="status"
      className={`pointer-events-auto flex max-w-[min(20rem,calc(100vw-2rem))] items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md animate-[dashboard-toast-in_0.35s_ease-out] ${
        isError
          ? "border-red-500/40 bg-[var(--toast-error-bg)]"
          : "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[color-mix(in_oklab,var(--surface-elevated)_94%,var(--theme-blend))]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isError ? "bg-red-500/20 text-red-200" : "bg-[var(--accent)]/15 text-[var(--accent)]"
        }`}
        aria-hidden
      >
        {isError ? "!" : "✓"}
      </span>
      <p className="text-sm font-medium leading-snug text-[var(--foreground)]">
        {message}
      </p>
    </div>
  );
}

function stripToastParams(params: URLSearchParams) {
  params.delete("toast");
  params.delete("toastType");
  params.delete("redeployed");
  params.delete("env_saved");
  params.delete("env_deleted");
  params.delete("domain_added");
  params.delete("error");
  params.delete("message");
  params.delete("deployment");
  params.delete("seeded");
  params.delete("seed_info");
  params.delete("seed_error");
}

function UrlToastListener({
  pushToast,
}: {
  pushToast: (message: string, variant?: ToastVariant) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consumedRef = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const legacy = legacyToastKeyFromParams(params);
    if (!legacy) return;

    const signature = `${pathname}?${searchParams.toString()}`;
    if (consumedRef.current === signature) return;
    consumedRef.current = signature;

    const entry = TOAST_MESSAGES[legacy.key];
    pushToast(entry?.message ?? legacy.key, entry?.variant ?? legacy.variant);

    stripToastParams(params);
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }, [pathname, pushToast, router, searchParams]);

  return null;
}

export function DashboardToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4200);
  }, []);

  return (
    <DashboardToastContext.Provider value={{ pushToast }}>
      {children}
      <Suspense fallback={null}>
        <UrlToastListener pushToast={pushToast} />
      </Suspense>
      <div
        className="pointer-events-none fixed right-4 top-4 z-[300] flex flex-col items-end gap-2 sm:right-6 sm:top-5"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <ToastCard key={t.id} message={t.message} variant={t.variant} />
        ))}
      </div>
    </DashboardToastContext.Provider>
  );
}
