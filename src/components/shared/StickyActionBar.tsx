import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  /** Short label describing the current step, e.g. "Auth Outstanding" */
  stepLabel?: string;
  /** Description of what needs to happen, e.g. "Select auth result and enter dates" */
  hint?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Sticky bottom action bar that stays visible during scrolling.
 * Shows the current step context and primary/secondary action buttons.
 * Inspired by Zendesk's reply composer bar.
 */
export function StickyActionBar({ stepLabel, hint, children, className }: Props) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 bg-card/95 backdrop-blur-sm border-t shadow-[0_-2px_8px_rgba(0,0,0,0.06)]",
        "px-3 sm:px-6 py-3",
        className,
      )}
    >
      <div className="max-w-5xl xl:max-w-7xl 2xl:max-w-[1800px] mx-auto flex items-center gap-4">
        {(stepLabel || hint) && (
          <div className="flex-1 min-w-0">
            {stepLabel && (
              <p className="text-xs font-semibold text-foreground">{stepLabel}</p>
            )}
            {hint && (
              <p className="text-[11px] text-muted-foreground truncate">{hint}</p>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      </div>
    </div>
  );
}
