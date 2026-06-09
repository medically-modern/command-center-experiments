import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  className?: string;
}

/**
 * Visually distinct read-only field with muted styling.
 * No border, subtle background — clearly not editable.
 */
export function ReadOnlyField({ label, value, icon, className }: Props) {
  return (
    <div className={cn("space-y-1", className)}>
      <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground font-medium flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <div className="text-sm font-medium text-foreground bg-muted/40 rounded-md px-3 py-2 min-h-[36px] flex items-center">
        {value || <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}

/**
 * Wrapper for editable fields — white bg, visible border, blue left accent.
 */
export function EditableFieldWrapper({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("border-l-2 border-l-blue-400 pl-3", className)}>
      {children}
    </div>
  );
}
