import { useState } from "react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Gift } from "lucide-react";
import { useSecretSanta } from "../../hooks/useSecretSanta";
import { useUser } from "../../hooks/useUser";
import {
  cancelSecretSanta,
  secretSantaEndDate,
  startSecretSanta,
} from "../../services/secretSanta";
import { Kohort } from "../../types/types";
import { BorderButton, Button, DangerButton } from "../common/Button";
import { Checkbox } from "../common/Checkbox";
import { Avatar, Divided, Panel, Section } from "../common/Page";
import Spinner from "../common/Spinner";

const MemberToggle = ({
  uid,
  checked,
  onChange,
}: {
  uid: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  const { user } = useUser(uid);
  return (
    <div className="px-8 py-10">
      <Checkbox
        label={
          <span className="flex items-center gap-12">
            <Avatar name={user?.name} className="h-32 w-32 text-[1.2rem]" />
            {user?.name || "Ukjent bruker"}
          </span>
        }
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
};

const ParticipantName = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);
  return (
    <span className="inline-flex items-center gap-6 rounded-full bg-primary-dark px-10 py-4 text-[1.3rem]">
      <Avatar name={user?.name} className="h-20 w-20 text-[0.9rem]" />
      {user?.name || "Ukjent bruker"}
    </span>
  );
};

const formatEnd = (date: Date) => format(date, "d. MMMM yyyy", { locale: nb });

export const SecretSantaAdmin = ({
  kohort,
  kohortId,
}: {
  kohort: Kohort;
  kohortId: string;
}) => {
  const { draw, unavailable } = useSecretSanta(kohortId);
  // Members still in the group; a redraw starts from the current participants.
  const members = kohort.members;
  const [picking, setPicking] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(members));
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const showPicker = !draw || picking;

  function openPicker() {
    setSelected(
      new Set(members.filter((m) => draw?.participants.includes(m) ?? true)),
    );
    setPicking(true);
  }

  async function run(action: () => Promise<void>) {
    setSaving(true);
    setError("");
    try {
      await action();
      setPicking(false);
      setConfirmCancel(false);
    } catch (e) {
      console.error("Secret Santa failed", e);
      setError("Noe gikk galt. Prøv igjen.");
    } finally {
      setSaving(false);
    }
  }

  const selectedMembers = members.filter((m) => selected.has(m));

  if (unavailable) {
    return (
      <Section title="Hemmelig nisse">
        <Panel>
          <p className="text-[1.4rem] opacity-80">
            Hemmelig nisse er ikke tilgjengelig akkurat nå. Prøv igjen senere.
          </p>
        </Panel>
      </Section>
    );
  }

  return (
    <Section
      title="Hemmelig nisse"
      description={
        draw
          ? `Aktiv til ${formatEnd(draw.endsAt.toDate())}. Hver deltaker ser bare hvem de selv skal gi til – heller ikke du ser parene.`
          : `Velg hvem som er med. Alle trekker én annen deltaker å gi en gave til. Gjelder til ${formatEnd(secretSantaEndDate())}.`
      }
    >
      <Panel className="flex flex-col gap-16">
        {showPicker ? (
          <>
            <Divided>
              {members.map((uid) => (
                <MemberToggle
                  key={uid}
                  uid={uid}
                  checked={selected.has(uid)}
                  onChange={(checked) => {
                    const next = new Set(selected);
                    if (checked) next.add(uid);
                    else next.delete(uid);
                    setSelected(next);
                  }}
                />
              ))}
            </Divided>
            <div className="flex flex-wrap items-center justify-end gap-10">
              <span className="mr-auto text-[1.4rem] opacity-70">
                {selectedMembers.length < 2
                  ? "Velg minst to deltakere"
                  : `${selectedMembers.length} deltakere`}
              </span>
              {draw && (
                <BorderButton onClick={() => setPicking(false)}>
                  Avbryt
                </BorderButton>
              )}
              <Button
                disabled={saving || selectedMembers.length < 2}
                onClick={() =>
                  run(() =>
                    startSecretSanta(
                      {
                        id: kohortId,
                        groupName: kohort.groupName,
                        admin: kohort.admin,
                      },
                      selectedMembers,
                    ),
                  )
                }
              >
                {saving ? <Spinner /> : <Gift size={18} />}
                {draw ? "Trekk på nytt" : "Trekk hemmelige nisser"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="mb-8 font-semibold">
                {draw.participants.length} deltakere
              </p>
              <div className="flex flex-wrap gap-6">
                {draw.participants.map((uid) => (
                  <ParticipantName key={uid} uid={uid} />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-10">
              {confirmCancel ? (
                <>
                  <span className="mr-auto text-[1.4rem]">
                    Avslutte hemmelig nisse? Alle trekningene slettes.
                  </span>
                  <BorderButton onClick={() => setConfirmCancel(false)}>
                    Avbryt
                  </BorderButton>
                  <DangerButton
                    disabled={saving}
                    onClick={() => run(() => cancelSecretSanta(kohortId))}
                  >
                    {saving ? <Spinner /> : "Ja, avslutt"}
                  </DangerButton>
                </>
              ) : (
                <>
                  <BorderButton onClick={() => setConfirmCancel(true)}>
                    Avslutt
                  </BorderButton>
                  <Button onClick={openPicker}>
                    <Gift size={18} />
                    Trekk på nytt
                  </Button>
                </>
              )}
            </div>
          </>
        )}
        {error && <p className="text-[1.4rem] text-negative">{error}</p>}
      </Panel>
    </Section>
  );
};
