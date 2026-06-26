"use client";

import type { ReactNode } from "react";
import type { ExploreTab } from "@/lib/categories";
import { exploreTabs } from "@/lib/categories";

const tabIcons: Record<ExploreTab, ReactNode> = {
  homes: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  services: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  ),
  experiences: (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
    </svg>
  ),
};

export default function ExploreNav({
  active,
  onChange,
  counts,
}: {
  active: ExploreTab;
  onChange: (tab: ExploreTab) => void;
  counts: Record<ExploreTab, number>;
}) {
  return (
    <nav className="mb-8 border-b border-primary/15">
      <div className="flex justify-center gap-2 sm:gap-8">
        {exploreTabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`relative flex flex-col items-center gap-1.5 px-4 py-3 transition-colors sm:px-8 ${
                isActive
                  ? "text-primary"
                  : "text-muted/80 hover:text-primary/70"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/30"
                    : "bg-card text-muted ring-1 ring-primary/10"
                }`}
              >
                {tabIcons[tab.id]}
              </span>
              <span className="text-sm font-semibold">{tab.label}</span>
              <span
                className={`text-xs ${
                  isActive ? "text-primary" : "text-muted/80"
                }`}
              >
                {counts[tab.id]} available
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-3 pb-4 text-center text-sm text-muted">
        {exploreTabs.find((t) => t.id === active)?.description}
      </p>
    </nav>
  );
}
