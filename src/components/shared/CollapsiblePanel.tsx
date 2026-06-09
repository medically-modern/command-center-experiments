/**
 * Zendesk-style collapsible panel.
 * Bold clickable header bar with chevron — collapses content to cut scroll depth.
 */
import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface CollapsiblePanelProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  /** Optional count badge next to title */
  badge?: string | number;
}

export function CollapsiblePanel({
  title,
  defaultOpen = true,
  children,
  badge,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl border border-sidebar-border bg-card shadow-card overflow-hidden">
      {/* Clickable header bar */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-3.5 bg-muted/60 hover:bg-muted transition-colors text-left group"
      >
        <ChevronRight
          className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        />
        <span className="text-sm font-semibold text-foreground tracking-wide uppercase">
          {title}
        </span>
        {badge !== undefined && (
          <span className="ml-auto text-xs font-medium bg-primary/10 text-primary rounded-full px-2.5 py-0.5">
            {badge}
          </span>
        )}
      </button>

      {/* Collapsible content */}
      {open && (
        <div className="px-1 py-1">
          {children}
        </div>
      )}
    </div>
  );
}
