"use client";

import { signOut } from "@/actions/logout";
import { useFormStatus } from "react-dom";

function SignOutInner() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 w-full items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-4 text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] transition-opacity disabled:opacity-60"
    >
      {pending ? "…" : "Abmelden"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={signOut} className="w-full">
      <SignOutInner />
    </form>
  );
}
