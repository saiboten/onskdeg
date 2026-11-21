import { useState } from "react";
import { Container } from "../common/Container";
import { BorderButton, borderButton, DangerButton } from "../common/Button";
import { UnstyledLink } from "../common/Link";
import { Check, Copy, Plus, Settings as SettingsIcon } from "lucide-react";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import Spinner from "../common/Spinner";
import { cn } from "../../util/cn";
import { StyledNotification } from "../common/StyledNotification";
import {
  Avatar,
  Divided,
  LinkRow,
  PageHeader,
  Panel,
  Section,
} from "../common/Page";

const ChildSetting = ({ childUid }: { childUid: string }) => {
  const { user } = useUser(childUid);

  return (
    <LinkRow
      to={`/settings/child/${user?.uid || childUid}`}
      icon={<Avatar name={user?.name} className="h-36 w-36 text-[1.3rem]" />}
      label={user?.name ?? "Ukjent"}
      description="Velg hvem som kan styre ønskelisten"
    />
  );
};

const GroupSetting = ({
  myUid,
  group: groupId,
}: {
  myUid: string;
  group: string;
}) => {
  const { kohort } = useKohort(groupId);
  const { user } = useUser(myUid);
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [notification, setNotification] = useState("");
  const isAdmin = kohort?.admin === myUid;

  async function handleLeaveGroup() {
    setLoading(true);
    const docRef = firebase.firestore().collection("groups").doc(groupId);
    const existingData = await docRef.get();

    await docRef.update({
      members: existingData.data()?.members.filter((m: string) => myUid !== m),
    });

    await firebase
      .firestore()
      .collection("user")
      .doc(myUid)
      .update({
        groups: user?.groups.filter((m) => m !== groupId) ?? [],
      });

    invalidate(["groups", groupId]);
    invalidate(["user", myUid]);
    setLoading(false);
    setNotification(`Du har forlatt ${kohort?.groupName}`);
    setTimeout(() => setNotification(""), 2500);
  }

  return (
    <div className="flex flex-wrap items-center gap-12 px-8 py-10">
      <div className="min-w-0 flex-1">
        <p className="font-semibold wrap-break-word">{kohort?.groupName}</p>
        <p className="text-[1.3rem] opacity-70">
          {kohort?.members.length ?? 0} medlemmer
          {isAdmin && " · Du er administrator"}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-8">
        {loading ? (
          <Spinner />
        ) : confirm ? (
          <>
            <span className="text-[1.4rem]">Forlate gruppen?</span>
            <BorderButton
              className="min-h-36 py-2"
              onClick={() => setConfirm(false)}
            >
              Avbryt
            </BorderButton>
            <DangerButton className="min-h-36 py-2" onClick={handleLeaveGroup}>
              Forlat
            </DangerButton>
          </>
        ) : (
          <>
            {isAdmin && (
              <UnstyledLink
                className={cn(borderButton, "min-h-36 py-2")}
                to={`/settings/kohort/${kohort.id}`}
              >
                <SettingsIcon size={16} />
                Administrer
              </UnstyledLink>
            )}
            <BorderButton
              className="min-h-36 border-transparent py-2 opacity-75 hover:opacity-100"
              onClick={() => setConfirm(true)}
            >
              Forlat
            </BorderButton>
          </>
        )}
      </div>
      <StyledNotification active={notification !== ""} text={notification} />
    </div>
  );
};

const CopyValue = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <span className="flex items-center gap-8">
      <code className="min-w-0 truncate rounded-[6px] bg-primary-dark px-8 py-2 text-[1.4rem]">
        {value}
      </code>
      <button
        type="button"
        aria-label="Kopier"
        title="Kopier"
        className="flex h-32 w-32 shrink-0 cursor-pointer items-center justify-center rounded-[8px] border-none bg-transparent text-text opacity-70 hover:opacity-100"
        onClick={async () => {
          await navigator.clipboard?.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </span>
  );
};

interface Props {
  uid: string;
  firebaseUser: firebase.User | undefined;
}

export const Settings = ({ uid, firebaseUser }: Props) => {
  const { user } = useUser(uid);
  const showNoEmailDisclaimer = !firebaseUser?.email;

  return (
    <Container>
      <PageHeader
        back={{ to: "/profile", label: "Profil" }}
        title="Innstillinger"
      />

      <Section
        title="Grupper"
        description="Gruppene du deler ønskelister med."
        actions={
          <UnstyledLink className={borderButton} to="/addgroup">
            <Plus size={18} />
            Ny gruppe
          </UnstyledLink>
        }
      >
        <Panel className="p-8 sm:p-8">
          {user?.groups.length ? (
            <Divided>
              {user.groups.map((group) => (
                <GroupSetting key={group} myUid={uid} group={group} />
              ))}
            </Divided>
          ) : (
            <p className="p-8 opacity-70">Du er ikke med i noen grupper.</p>
          )}
        </Panel>
      </Section>

      <Section
        title="Ekstra brukere"
        description="Ønskelister du styrer for andre, for eksempel barn."
        actions={
          <UnstyledLink className={borderButton} to="/addchild">
            <Plus size={18} />
            Legg til
          </UnstyledLink>
        }
      >
        <Panel className="p-8 sm:p-8">
          {user?.childs?.length ? (
            <Divided>
              {user.childs.map((childUid) => (
                <ChildSetting key={childUid} childUid={childUid} />
              ))}
            </Divided>
          ) : (
            <p className="p-8 opacity-70">Ingen ekstra brukere.</p>
          )}
        </Panel>
      </Section>

      <Section title="Konto">
        <Panel className="flex flex-col gap-12">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <span className="opacity-70">E-post</span>
            <span className="font-semibold">
              {firebaseUser?.email || "Ukjent"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <span className="opacity-70">Bruker-ID</span>
            <CopyValue value={uid} />
          </div>
          {showNoEmailDisclaimer && (
            <p className="rounded-[10px] bg-primary-dark px-12 py-10 text-[1.4rem] shadow-[inset_0_0_0_2px_var(--color-negative)]">
              Vi fant ikke e-posten din, så du kan ikke inviteres til grupper
              med e-post. Send bruker-ID-en din til en gruppeadministrator, så
              kan de legge deg til manuelt.
            </p>
          )}
        </Panel>
      </Section>
    </Container>
  );
};
