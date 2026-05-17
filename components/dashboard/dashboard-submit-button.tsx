"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import {
  dashboardBtnMd,
  dashboardBtnSm,
  dashboardBtnSuccess,
} from "@/components/dashboard/dashboard-button-styles";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4 shrink-0"}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
    >
      <path
        d="M5 10.5 8.2 13.7 15 6.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FeedbackButtonProps = {
  pending: boolean;
  children: ReactNode;
  pendingLabel?: ReactNode;
  className?: string;
  size?: "sm" | "md";
} & Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "disabled" | "onClick"
>;

export function DashboardFeedbackButton({
  pending,
  children,
  pendingLabel,
  className,
  size = "sm",
  type = "submit",
  disabled,
  onClick,
}: FeedbackButtonProps) {
  const height = size === "md" ? "h-10" : "h-9";
  const base = className ?? (size === "md" ? dashboardBtnMd : dashboardBtnSm);

  if (pending) {
    return (
      <button
        type={type}
        disabled
        aria-busy="true"
        className={`${base} ${height} ${dashboardBtnSuccess}`}
      >
        <CheckIcon />
        <span>{pendingLabel ?? children}</span>
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${height} hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

type DashboardSubmitButtonProps = Omit<FeedbackButtonProps, "pending">;

function SubmitButtonInner(props: DashboardSubmitButtonProps) {
  const { pending } = useFormStatus();
  return <DashboardFeedbackButton pending={pending} {...props} />;
}

/** Place inside a <form> — turns green with checkmark while the server action runs. */
export function DashboardSubmitButton(props: DashboardSubmitButtonProps) {
  return <SubmitButtonInner {...props} />;
}
