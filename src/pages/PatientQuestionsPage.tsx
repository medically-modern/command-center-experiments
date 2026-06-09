/**
 * Patient Questions — read-only inbox view.
 * Aggregates patient messages from the Subscription board ("Patient Help Message")
 * and Secondary Claims board ("Patient Message").
 */
import { useEffect, useMemo, useState } from "react";
import { useMondayPatients } from "@/hooks/patientQuestions/useMondayPatients";
import type { PatientQuestion } from "@/lib/patientQuestions/types";
import { PatientsSidebar } from "@/components/patientQuestions/PatientsSidebar";
import { PatientDetailCard } from "@/components/patientQuestions/PatientDetailCard";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MessageCircleQuestion } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { HighlightsStrip } from "@/components/shared/HighlightsStrip";
import { useNavigate } from "react-router-dom";

const PatientQuestionsPage = () => {
  const navigate = useNavigate();
  const { patients, loading, error, refetch } = useMondayPatients();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "subscription" | "claims">("all");

  const filtered = useMemo(
    () => activeTab === "all" ? patients : patients.filter((p) => p.source === activeTab),
    [patients, activeTab],
  );

  // Auto-select first patient when data loads
  useEffect(() => {
    if (!selectedId && filtered.length > 0) setSelectedId(filtered[0].id);
  }, [filtered, selectedId]);

  // If selected patient not in current tab filter, reset selection
  useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId) && filtered.length > 0) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selected: PatientQuestion | undefined = useMemo(
    () => patients.find((p) => p.id === selectedId),
    [patients, selectedId],
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <PatientsSidebar
          patients={patients}
          selectedId={selectedId}
          onSelect={setSelectedId}
          loading={loading}
          error={error}
          onRefresh={() => refetch()}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <PageHeader
            title="Patient Questions"
            subtitle={selected?.name}
            icon={<MessageCircleQuestion className="h-5 w-5 text-primary-foreground" />}
            onBack={() => navigate("/?tab=dashboard")}
          >
            <span className="text-sm text-white/80">
              {filtered.length} message{filtered.length !== 1 ? "s" : ""}
            </span>
          </PageHeader>

          {selected && (
            <HighlightsStrip
              items={[
                { label: "Patient", value: selected.name },
                { label: "Source", value: selected.source || "—" },
                { label: "Message", value: selected.message ? (selected.message.length > 60 ? selected.message.slice(0, 60) + "..." : selected.message) : "—" },
              ]}
            />
          )}

          <main className="flex-1 px-6 py-6 overflow-y-auto">
            <section className="max-w-4xl mx-auto space-y-5">
              {!selected && (
                <div className="rounded-xl bg-card border shadow-card p-10 text-center">
                  <MessageCircleQuestion className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {loading
                      ? "Loading patient messages from Monday…"
                      : error
                        ? error
                        : patients.length === 0
                          ? "No patient messages found. Messages will appear here when patients submit questions via the reorder form or co-pay portal."
                          : "Select a patient from the sidebar to view their message."}
                  </p>
                </div>
              )}

              {selected && <PatientDetailCard patient={selected} />}
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PatientQuestionsPage;
