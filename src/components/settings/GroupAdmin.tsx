import { useState } from "react";
import { Container } from "../common/Container";
import { BorderButton, DangerButton } from "../common/Button";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { Kohort } from "../../types/types";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import { useParams } from "react-router-dom";
import Spinner from "../common/Spinner";
import { AddUserByUid } from "./AddUserByUid";
import { AddInvite } from "./AddInvite";
import { Mail } from "lucide-react";
import { Avatar, Divided, PageHeader, Panel, Section } from "../common/Page";

const KohortMember = ({
  kohort,
  kohortId,
  myUid,
  uid,
}: {
  kohort: Kohort;
  kohortId: string;
  myUid: string;
  uid: string;
}) => {
  const { user } = useUser(uid);
  const [showUid, setShowUid] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleRemoveUser() {
    await firebase
      .firestore()
      .collection("groups")
      .doc(kohortId)
      .update({
        members: kohort?.members.filter((memberId) => memberId !== uid) ?? [],
      });
    invalidate(["groups", kohortId]);
  }

  return (
    <div className="flex flex-wrap items-center gap-12 px-8 py-10">
      <Avatar name={user?.name} className="h-36 w-36 text-[1.3rem]" />
      <div className="min-w-0 flex-1 wrap-break-word">
        <p className="font-semibold">{user?.name || "Ukjent bruker"}</p>
        {showUid ? (
          <p className="text-[1.3rem] opacity-60">{uid}</p>
        ) : (
          <button
            className="cursor-pointer border-none bg-transparent p-0 font-sans text-[1.3rem] text-text underline opacity-60 hover:opacity-100"
            onClick={() => setShowUid(true)}
          >
            Vis bruker-ID
          </button>
        )}
      </div>
      {myUid === uid ? (
        <span className="rounded-full bg-primary-dark px-12 py-4 text-[1.3rem] font-semibold">
          Administrator
        </span>
      ) : confirm ? (
        <div className="flex items-center gap-8">
          <BorderButton
            className="min-h-36 py-2"
            onClick={() => setConfirm(false)}
          >
            Avbryt
          </BorderButton>
          <DangerButton className="min-h-36 py-2" onClick={handleRemoveUser}>
            Fjern
          </DangerButton>
        </div>
      ) : (
        <BorderButton
          className="min-h-36 border-transparent py-2 opacity-75 hover:opacity-100"
          onClick={() => setConfirm(true)}
        >
          Fjern
        </BorderButton>
      )}
    </div>
  );
};

const KohortInvite = ({
  kohort,
  kohortId,
  invite,
}: {
  kohort: Kohort;
  kohortId: string;
  invite: string;
}) => {
  const [removeInviteLoading, setRemoveInviteLoading] = useState(false);
  async function handleRemoveInvite() {
    setRemoveInviteLoading(true);
    await firebase
      .firestore()
      .collection("groups")
      .doc(kohort?.id)
      .update({
        invites: kohort?.invites.filter((m) => m !== invite) ?? [],
      });

    const docRef = firebase.firestore().collection("invites").doc(invite);
    const inviteData = await docRef.get();

    await docRef.update({
      myInvites:
        inviteData.data()?.myInvites.filter((m: string) => m !== kohortId) ||
        [],
    });
    invalidate(["groups", kohortId]);
    setRemoveInviteLoading(false);
  }

  return (
    <div className="flex items-center gap-12 px-8 py-10">
      <span className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full bg-primary-dark">
        <Mail size={16} className="opacity-70" />
      </span>
      <span className="min-w-0 flex-1 wrap-break-word">{invite}</span>
      {removeInviteLoading ? (
        <Spinner />
      ) : (
        <BorderButton
          className="min-h-36 border-transparent py-2 opacity-75 hover:opacity-100"
          onClick={handleRemoveInvite}
        >
          Trekk tilbake
        </BorderButton>
      )}
    </div>
  );
};

export const GroupAdmin = ({ myUid }: { myUid: string }) => {
  const { kohortId } = useParams<{ kohortId?: string }>();
  const { kohort } = useKohort(kohortId ?? "");
  const { user } = useUser(myUid);

  if (kohort?.admin !== myUid) {
    return (
      <Container>
        <PageHeader
          back={{ to: "/settings", label: "Innstillinger" }}
          title="Ingen tilgang"
          subtitle="Bare administratoren kan endre denne gruppen."
        />
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader
        back={{ to: "/settings", label: "Innstillinger" }}
        title={kohort.groupName}
        subtitle="Administrer gruppen"
      />

      <Section
        title="Inviter noen"
        description="De får en e-post og en invitasjon når de logger inn."
      >
        <Panel className="flex flex-col gap-16">
          <AddInvite kohort={kohort} kohortId={kohortId ?? ""} user={user} />
          <details className="group">
            <summary className="cursor-pointer text-[1.4rem] opacity-70 hover:opacity-100">
              Legg til med bruker-ID i stedet
            </summary>
            <div className="mt-12">
              <AddUserByUid kohort={kohort} kohortId={kohortId ?? ""} />
            </div>
          </details>
        </Panel>
      </Section>

      {kohort.invites.length > 0 && (
        <Section title="Ventende invitasjoner">
          <Panel className="p-8 sm:p-8">
            <Divided>
              {kohort.invites.map((invite) => (
                <KohortInvite
                  key={invite}
                  kohort={kohort}
                  kohortId={kohortId ?? ""}
                  invite={invite}
                />
              ))}
            </Divided>
          </Panel>
        </Section>
      )}

      <Section title={`Medlemmer (${kohort.members.length})`}>
        <Panel className="p-8 sm:p-8">
          <Divided>
            {kohort.members.map((member) => (
              <KohortMember
                key={member}
                kohort={kohort}
                kohortId={kohortId ?? ""}
                myUid={myUid}
                uid={member}
              />
            ))}
          </Divided>
        </Panel>
      </Section>
    </Container>
  );
};
