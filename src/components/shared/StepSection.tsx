import { cn } from "@/lib/utils";

interface StepSectionProps {
  step: number;
  title: string;
  hint?: string;
  /** When true the step badge turns green */
  complete?: boolean;
  /** Optional element rendered on the right side of the header (e.g. a counter pill) */
  rightAccessory?: React.ReactNode;
  children: React.ReactNode;
}

export function StepSection({
  step,
  title,
  hint,
  complete,
  rightAccessory,
  children,
}: StepSectionProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 transition-colors border-border bg-muted/10",
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 border-2",
              complete
                ? "bg-success/15 text-success border-success/40"
                : "bg-background text-foreground border-border",
            )}
          >
            {step}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">
              Step {step} &middot; {title}
            </h3>
            {hint && (
              <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
            )}
          </div>
        </div>
        {rightAccessory}
      </div>
      {children}
    </div>
  );
}
