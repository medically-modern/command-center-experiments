import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  badge?: string | number;
  badgeColor?: string;
  icon?: ReactNode;
  defaultOpen?: boolean;
  /** When true, section cannot be collapsed */
  forceOpen?: boolean;
  /** Adds a colored left-border accent */
  accentColor?: string;
  children: ReactNode;
  className?: string;
}

export function CollapsibleSection({
  title,
  badge,
  badgeColor = "bg-muted text-muted-foreground",
  icon,
  defaultOpen = false,
  forceOpen = false,
  accentColor,
  children,
  className,
}: Props) {
  const [open, setOpen] = useState(defaultOpen || forceOpen);
  const isOpen = forceOpen || open;

  return (
    <div
      className={cn(
        "rounded-xl bg-card border shadow-card overflow-hidden transition-all",
        accentColor && `border-l-[3px]`,
        className,
      )}
      style={accentColor ? { borderLeftColor: accentColor } : undefined}
    >
      <button
        type="button"
        onClick={() => !forceOpen && setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors",
          !forceOpen && "hover:bg-muted/30 cursor-pointer",
          forceOpen && "cursor-default",
        )}
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-sm font-semibold flex-1">{title}</span>
        {badge !== undefined && (
          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", badgeColor)}>
            {badge}
          </span>
        )}
        {!forceOpen && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        )}
      </button>
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden",
        )}
      >
        <div className="px-5 pb-5 pt-1">{children}</div>
      </div>
    </div>
  );
}
