import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function AuthLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4 py-20 text-sm text-[var(--muted)]">
          Загрузка…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
