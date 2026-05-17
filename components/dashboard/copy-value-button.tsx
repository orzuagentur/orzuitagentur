"use client";

import { useState } from "react";

type CopyValueButtonProps = {
  value: string;
  label?: string;
};

export function CopyValueButton({ value, label = "Kopieren" }: CopyValueButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="shrink-0 rounded-lg border border-[var(--border)] bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
    >
      {copied ? "✓ Kopiert" : label}
    </button>
  );
}
