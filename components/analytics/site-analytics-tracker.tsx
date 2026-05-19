"use client";

import { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/actions/analytics/track";

function ratingFor(metric: string, value: number) {
  if (metric === "LCP") return value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor";
  if (metric === "CLS") return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor";
  return "info";
}

export function SiteAnalyticsTracker() {
  const sentDepths = useRef(new Set<number>());

  useEffect(() => {
    const hasIdleCallback = typeof window.requestIdleCallback === "function";
    const idleId = hasIdleCallback
      ? window.requestIdleCallback(() => {
          void trackAnalyticsEvent({
            eventName: "page_view",
            payload: { path: window.location.pathname },
          });
        })
      : window.setTimeout(() => {
      void trackAnalyticsEvent({
        eventName: "page_view",
        payload: { path: window.location.pathname },
      });
        }, 800);

    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest("a,button") : null;
      if (!target) return;
      const text = target.textContent?.trim().slice(0, 120);
      if (!text) return;
      const href = target instanceof HTMLAnchorElement ? target.href : undefined;
      const looksLikeCta =
        href?.includes("#kontakt") ||
        href?.startsWith("mailto:") ||
        href?.startsWith("tel:") ||
        /kontakt|projekt|anfragen|termin|starten/i.test(text);
      if (!looksLikeCta) return;
      void trackAnalyticsEvent({
        eventName: "cta_click",
        payload: { label: text, href, path: window.location.pathname },
      });
    }

    function onScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const depth = Math.min(100, Math.round((window.scrollY / total) * 100));
      for (const marker of [25, 50, 75, 100]) {
        if (depth >= marker && !sentDepths.current.has(marker)) {
          sentDepths.current.add(marker);
          void trackAnalyticsEvent({
            eventName: "scroll_depth",
            payload: { depth: marker, path: window.location.pathname },
          });
        }
      }
    }

    window.addEventListener("click", onClick, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (hasIdleCallback) {
        window.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
      window.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!("PerformanceObserver" in window)) return;
    const observers: PerformanceObserver[] = [];
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (!last) return;
        void trackAnalyticsEvent({
          eventName: "web_vital",
          payload: {
            metric: "LCP",
            value: Math.round(last.startTime),
            rating: ratingFor("LCP", last.startTime),
          },
        });
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
      observers.push(lcpObserver);

      let cls = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            value?: number;
            hadRecentInput?: boolean;
          };
          if (!layoutShift.hadRecentInput) cls += layoutShift.value ?? 0;
        }
        void trackAnalyticsEvent({
          eventName: "web_vital",
          payload: {
            metric: "CLS",
            value: Number(cls.toFixed(3)),
            rating: ratingFor("CLS", cls),
          },
        });
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
      observers.push(clsObserver);
    } catch {
      // Browser does not support one of the observed metric types.
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return null;
}
