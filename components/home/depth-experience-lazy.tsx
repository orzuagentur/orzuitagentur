"use client";

import dynamic from "next/dynamic";

const DepthExperience = dynamic(
  () =>
    import("@/components/experience/depth-experience").then(
      (mod) => mod.DepthExperience,
    ),
  { ssr: false },
);

export function DepthExperienceLazy() {
  return <DepthExperience />;
}
