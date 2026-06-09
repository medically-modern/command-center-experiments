import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface Props {
  /** Board/source label shown above the title */
  breadcrumb?: string;
  /** Page title */
  title: string;
  /** Patient name shown to the right of the title */
  subtitle?: string;
  /** Icon element in the gradient box */
  icon: ReactNode;
  /** Color variant — default or escalated (red) */
  variant?: "default" | "escalated";
  /** Back navigation handler */
  onBack: () => void;
  /** Right-side action buttons */
  children?: ReactNode;
}

export function PageHeader({
  breadcrumb = "Medically Modern",
  title,
  subtitle,
  icon,
  variant = "default",
  onBack,
  children,
}: Props) {
  const isEscalated = variant === "escalated";

  return (
    <header
      className={cn(
        "border-b border-sidebar-border",
        isEscalated
          ? "bg-red-700 text-white"
          : "bg-gradient-navy text-navy-foreground",
      )}
    >
      <div className="px-3 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
        {/* Left cluster */}
        <div className="flex items-center gap-3 min-w-0">
          <SidebarTrigger className="-ml-1 text-white/70 hover:text-white hover:bg-white/10" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-elevate shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">{breadcrumb}</p>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold truncate">{title}</h1>
              {subtitle && (
                <span className="text-sm opacity-70 truncate hidden sm:inline">
                  — {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Right cluster — action buttons */}
        {children && (
          <div className="flex items-center gap-2 flex-wrap">{children}</div>
        )}
      </div>
    </header>
  );
}
