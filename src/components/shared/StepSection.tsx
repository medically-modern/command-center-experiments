import { cn } from "@/lib/utils";

interface StepSectionProps {
  step: number;
  title: string;
  hint?: string;
  complete?: boolean;
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
    <div className="rounded-xl border-2 border-border bg-card shadow-card overflow-hidden">
      {/* ── Header bar ── */}
      <div className="bg-muted/40 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center text-base font-bold shrink-0 border-2",
                complete
                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                  : "bg-primary/10 text-primary border-primary/30",
              )}
            >
              {step}
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">
                {title}
              </h3>
              {hint && (
                <p className="text-sm text-muted-foreground mt-0.5">{hint}</p>
              )}
            </div>
          </div>
          {rightAccessory}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-6 py-5">
        {children}
      </div>
    </div>
  );
}
