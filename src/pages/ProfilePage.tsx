/**
 * Profile Checklist — standalone view from jenelle-profile-checklist repo.
 */
import { useEffect, useMemo, useState, useCallback } from "react";
import { useMondayPatients } from "@/hooks/profile/useMondayPatients";
import { fetchClinicLabels, createClinicLabel, moveItemToGroup, GROUPS } from "@/lib/profile/mondayApi";
import { sendPatientToMonday } from "@/lib/profile/mondayWrite";
import { writeText, COL } from "@/lib/profile/mondayApi";
import type { Patient } from "@/lib/profile/workflow";
import { hasValidZip } from "@/lib/profile/workflow";
import { StediPanel } from "@/components/profile/StediPanel";
import { DoctorPanel } from "@/components/profile/DoctorPanel";
import { ServingPanel } from "@/components/profile/ServingPanel";
import { PatientsSidebar } from "@/components/profile/PatientsSidebar";
import { PatientProfileCard } from "@/components/profile/PatientProfileCard";
import { ReferralEmailPanel } from "@/components/profile/ReferralEmailPanel";
import { NotesPanel } from "@/components/profile/NotesPanel";
import { FollowUpModal } from "@/components/profile/FollowUpModal";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClipboardCheck, Send, AlertTriangle, Loader2, Clock, Save, Ban, User } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { HighlightsStrip } from "@/components/shared/HighlightsStrip";
import { CollapsibleSection } from "@/components/shared/CollapsibleSection";
import { StickyActionBar } from "@/components/shared/StickyActionBar";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBackNavigation } from "@/hooks/useBackNavigation";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { goBack } = useBackNavigation();
  const [searchParams] = useSearchParams();
  const isEscalated = searchParams.get("escalated") === "1";
  const { patients, loading, error, refetch, updateLocal, clearOverlay, removeOverlayKeys , saveOverlay, hasOverlay } = useMondayPatients(searchParams.get("patientId"));
  const [selectedId, setSelectedId] = useState<string | null>(
    searchParams.get("patientId") ?? null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [clinicLabels, setClinicLabels] = useState<{ id: number; name: string }[]>([]);
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
  const [referralEmailOpen, setReferralEmailOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [stuckSending, setStuckSending] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClinicLabels().then(setClinicLabels).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedId && patients.length > 0) setSelectedId(patients[0].id);
  }, [patients, selectedId]);

  const selected: Patient | undefined = useMemo(
    () => patients.find((p) => p.id === selectedId),
    [patients, selectedId],
  );

  const handleUpdate = useCallback((patch: Partial<Patient>) => {
    if (!selected) return;
    updateLocal(selected.id, patch);
  }, [selected, updateLocal]);

  const handleClinicSelect = useCallback((id: number, name: string) => {
    setSelectedClinicId(id);
    if (selected) updateLocal(selected.id, { clinicName: name });
  }, [selected, updateLocal]);

  const handleClinicCreate = useCallback(async (name: string) => {
    try {
      const newId = await createClinicLabel(name);
      setClinicLabels((prev) => [...prev, { id: newId, name }]);
      setSelectedClinicId(newId);
      if (selected) updateLocal(selected.id, { clinicName: name });
      toast.success(`Clinic "${name}" added`);
    } catch (e) {
      toast.error("Failed to create clinic", {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }, [selected, updateLocal]);

  const handleSave = useCallback(() => {
    if (!selected) return;
    setSaving(true);
    try {
      saveOverlay(selected.id);
      toast.success(`Progress saved for ${selected.name}`, {
        description: "Your edits are saved locally — you can navigate away and come back.",
      });
    } catch (e) {
      toast.error("Failed to save progress", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setSaving(false);
    }
  }, [selected, saveOverlay]);

  const handleSubmit = async (action: "advance" | "needsInfo") => {
    if (!selected) return;
    if (selected.clinicAddress && !hasValidZip(selected.clinicAddress)) {
      toast.error("Clinic address must include a valid 5-digit zip code");
      return;
    }
    setSubmitting(true);
    try {
      await sendPatientToMonday(selected, action, selectedClinicId);
      clearOverlay(selected.id);
      toast.success(
        action === "advance"
          ? `${selected.name} advanced to MN`
          : `${selected.name} marked as needs more info`,
      );
      setTimeout(refetch, 1500);
    } catch (e) {
      toast.error("Failed to submit", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStuck = async () => {
    if (!selected) return;
    setStuckSending(true);
    try {
      await moveItemToGroup(selected.id, GROUPS.stuck);
      toast.success(`${selected.name} moved to Stuck`);
      // Select next patient or clear selection
      const remaining = patients.filter((p) => p.id !== selected.id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
      setTimeout(refetch, 1500);
    } catch (e) {
      toast.error("Failed to move to Stuck", {
        description: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setStuckSending(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <PatientsSidebar
          patients={patients}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setSelectedClinicId(null);
          }}
          loading={loading}
          error={error}
          onRefresh={refetch}
          hasOverlay={hasOverlay}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <PageHeader
            breadcrumb="Medically Modern · Profile Tool"
            title={selected ? selected.name : "Profile Send Off"}
            subtitle={selected?.alreadyInSystem?.toLowerCase() === "yes" ? "Already In System" : undefined}
            icon={<ClipboardCheck className="h-5 w-5 text-primary-foreground" />}
            variant={isEscalated ? "escalated" : "default"}
            onBack={() => goBack()}
          >
            {selected && (
              <>
                <Button
                  onClick={() => setFollowUpOpen(true)}
                  variant="ghost"
                  className="gap-2 text-white/80 hover:text-white hover:bg-white/10"
                >
                  <Clock className="h-4 w-4" /> Follow Up
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving || !hasOverlay(selected.id)}
                  className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-elevate"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
              </>
            )}
          </PageHeader>

          {selected && (
            <HighlightsStrip
              items={[
                { label: "Patient", value: selected.name },
                { label: "DOB", value: selected.dob || "—" },
                { label: "Phone", value: selected.ptPhone || "—" },
                { label: "Gender", value: selected.gender || "—" },
                { label: "Intake", value: selected.dateOfIntake || "—" },
              ]}
            />
          )}

          <main className="flex-1 px-3 sm:px-6 py-6">
            <section className="max-w-5xl xl:max-w-7xl 2xl:max-w-[1800px] mx-auto space-y-5">
              {!selected && (
                <div className="rounded-xl bg-card border shadow-card p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    {loading ? "Loading patients from Monday…" : error ? error : "Select a patient from the sidebar to begin."}
                  </p>
                </div>
              )}

              {selected && (
                <>
                  {/* 1. Patient Demographics */}
                  <CollapsibleSection
                    title="Patient Profile"
                    icon={<User className="h-4 w-4" />}
                    defaultOpen={false}
                    className="opacity-80"
                  >
                    <PatientProfileCard
                      patient={selected}
                      onUpdate={handleUpdate}
                      referralEmailOpen={referralEmailOpen}
                      onToggleReferralEmail={() => setReferralEmailOpen((o) => !o)}
                    />
                  </CollapsibleSection>

                  {/* 2. Referral — rendered via ServingPanel (referral-only mode) */}
                  <CollapsibleSection title="Referral" forceOpen>
                    <ServingPanel patient={selected} onUpdate={handleUpdate} hideReferral={false} referralOnly />
                  </CollapsibleSection>

                  {/* 3. Benefits — Stedi */}
                  <CollapsibleSection title="Benefits (Stedi)" forceOpen>
                    <StediPanel
                      patient={selected}
                      onRefresh={refetch}
                      onUpdate={handleUpdate}
                      onRemoveOverlayKeys={(keys) =>
                        selected && removeOverlayKeys(selected.id, keys)
                      }
                    />
                  </CollapsibleSection>

                  {/* 4. Request, Cross-Sell, Serving, Coverage (no referral) */}
                  <CollapsibleSection title="Serving & Coverage" forceOpen>
                    <ServingPanel patient={selected} onUpdate={handleUpdate} hideReferral />
                  </CollapsibleSection>

                  {/* 5. Doctor */}
                  <CollapsibleSection title="Doctor Information" forceOpen>
                    <DoctorPanel
                      patient={selected}
                      onUpdate={handleUpdate}
                      clinicLabels={clinicLabels}
                      onClinicSelect={handleClinicSelect}
                      onClinicCreate={handleClinicCreate}
                    />
                  </CollapsibleSection>

                  {/* 6. Notes */}
                  <CollapsibleSection title="Notes" defaultOpen>
                    <NotesPanel
                      notes={selected.notes}
                      onNotesChange={(v) => updateLocal(selected.id, { notes: v })}
                      onSaveToMonday={(v) => writeText(selected.id, COL.notes, v)}
                    />
                  </CollapsibleSection>

                  {/* Follow Up Modal */}
                  <FollowUpModal
                    open={followUpOpen}
                    onOpenChange={setFollowUpOpen}
                    patientId={selected.id}
                    patientName={selected.name}
                    onSuccess={refetch}
                  />
                </>
              )}
            </section>
          </main>

          {selected && (
            <StickyActionBar
              stepLabel="Profile Send Off"
              hint="All edits will be saved to Monday when you submit."
            >
              <Button
                variant="outline"
                onClick={handleStuck}
                disabled={stuckSending || submitting}
                className="gap-2 border-orange-300 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
              >
                {stuckSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Ban className="h-4 w-4" />}
                Stuck
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit("needsInfo")}
                disabled={submitting || stuckSending}
                className="gap-2 border-blue-300 text-blue-700 hover:bg-purple-100 hover:text-blue-700"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                Need More Info
              </Button>
              <Button
                onClick={() => handleSubmit("advance")}
                disabled={submitting || stuckSending}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-elevate"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Advance to MN
              </Button>
            </StickyActionBar>
          )}
        </div>

        {/* Side-by-side referral email panel — sibling of the main
            column, NOT a modal. The user can scroll/interact with both
            simultaneously. */}
        {referralEmailOpen && selected && (
          <ReferralEmailPanel
            itemId={selected.id}
            patientName={selected.name}
            onClose={() => setReferralEmailOpen(false)}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default ProfilePage;
