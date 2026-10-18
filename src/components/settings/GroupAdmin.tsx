import { useState } from "react";
import { Container } from "../common/Container";

import { BorderButton } from "../common/Button";
import ListRow from "../common/ListRow";
import { Link } from "../common/Link";
import { Spacer } from "../common/Spacer";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { Kohort } from "../../types/types";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import { useParams } from "react-router-dom";
import Loading from "../common/Loading";
import { AddUserByUid } from "./AddUserByUid";
import { AddInvite } from "./AddInvite";

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

  function handleRemoveUser() {
    firebase
      .firestore()
      .collection("groups")
      .doc(kohortId)
      .update({
        members: kohort?.members.filter((memberId) => memberId !== uid) ?? [],
      });
    invalidate(["groups", kohortId]);
  }

  return (
    <ListRow>
      <div className="min-w-0 flex-1 wrap-break-word">
        {user?.name || "Ukjent bruker"}{" "}
        {showUid ? (
          <span className="text-[1.3rem] opacity-60">({uid})</span>
        ) : (
          <button
            className="cursor-pointer border-none bg-transparent p-0 text-[1.3rem] text-text underline opacity-60 hover:opacity-100"
            onClick={() => setShowUid(true)}
          >
            Vis ID
          </button>
        )}
      </div>
      {myUid !== uid ? (
        <BorderButton className="min-h-36 py-2" onClick={handleRemoveUser}>
          Fjern
        </BorderButton>
      ) : (
        <span className="px-8 text-[1.4rem] font-semibold">Administrator</span>
      )}
    </ListRow>
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
    await firebase
      .firestore()
      .collection("groups")
      .doc(kohort?.id)
      .update({
        invites: kohort?.invites.filter((m) => m !== invite) ?? [],
      });

    setRemoveInviteLoading(true);
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
    <ListRow>
      <span className="min-w-0 wrap-break-word">{invite}</span>
      {removeInviteLoading ? (
        <Loading />
      ) : (
        <BorderButton className="min-h-36 py-2" onClick={handleRemoveInvite}>
          Fjern
        </BorderButton>
      )}
    </ListRow>
  );
};

export const GroupAdmin = ({ myUid }: { myUid: string }) => {
  const { kohortId } = useParams<{ kohortId?: string }>();
  const { kohort } = useKohort(kohortId ?? "");
  const { user } = useUser(myUid);

  if (kohort?.admin !== myUid) return null;

  return (
    <Container textLeft>
      <Link className="mb-16 inline-block text-[1.4rem]" to="/settings">
        ← Tilbake til innstillinger
      </Link>
      <StyledBigHeader>Administrer gruppe {kohort.groupName}</StyledBigHeader>
      <StyledSubHeader>Invitasjoner</StyledSubHeader>
      {kohort.invites.length === 0 && (
        <p className="mb-10 opacity-75">Ingen ventende invitasjoner.</p>
      )}
      {kohort.invites.map((invite) => {
        return (
          <KohortInvite
            key={invite}
            kohort={kohort}
            kohortId={kohortId ?? ""}
            invite={invite}
          />
        );
      })}
      <Spacer />
      <StyledSubHeader>Medlemmer</StyledSubHeader>
      {kohort.members.map((member) => {
        return (
          <KohortMember
            key={member}
            kohort={kohort}
            kohortId={kohortId ?? ""}
            myUid={myUid}
            uid={member}
          />
        );
      })}
      <Spacer />
      <AddInvite kohort={kohort} kohortId={kohortId ?? ""} user={user} />
      <Spacer />
      <AddUserByUid kohort={kohort} kohortId={kohortId ?? ""} />
    </Container>
  );
};
