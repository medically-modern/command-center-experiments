import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface HighlightItem {
  label: string;
  value: ReactNode;
  /** Optional color class for the value text */
  valueColor?: string;
}

interface Props {
  items: HighlightItem[];
  className?: string;
}

/**
 * A fixed horizontal strip showing 4-6 key data points.
 * Stays visible at all times — eliminates scrolling back up.
 * Inspired by Salesforce's Highlights Panel.
 */
export function HighlightsStrip({ items, className }: Props) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b px-3 sm:px-6 py-2.5",
        "flex items-center gap-1 overflow-x-auto scrollbar-none",
        className,
      )}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "flex flex-col min-w-0 px-3 py-1",
            i < items.length - 1 && "border-r border-border",
          )}
        >
          <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground font-medium whitespace-nowrap">
            {item.label}
          </span>
          <span
            className={cn(
              "text-xs font-semibold truncate max-w-[160px]",
              item.valueColor || "text-foreground",
            )}
            title={typeof item.value === "string" ? item.value : undefined}
          >
            {item.value || "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
