import { useState } from "react";
import { Container } from "../common/Container";

import { Button } from "../common/Button";
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
    <div className="mb-10 flex items-center justify-between">
      <div
        style={{
          flex: "1",
          overflowWrap: "break-word",
          wordWrap: "break-word",
          wordBreak: "break-word",
          hyphens: "auto",
        }}
      >
        {user?.name || "Ukent bruker"} (
        {showUid ? (
          uid
        ) : (
          <button
            className="inline cursor-pointer border-none bg-transparent text-white outline-none"
            onClick={() => setShowUid(true)}
          >
            Vis ID
          </button>
        )}
        )
      </div>
      {myUid !== uid ? (
        <Button onClick={handleRemoveUser}>Fjern bruker</Button>
      ) : (
        <div>Administrator</div>
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
    <div className="mb-10 flex items-center justify-between">
      {invite}
      {removeInviteLoading ? (
        <Loading />
      ) : (
        <Button onClick={handleRemoveInvite}>Fjern invitasjon</Button>
      )}
    </div>
  );
};

export const GroupAdmin = ({ myUid }: { myUid: string }) => {
  const { kohortId } = useParams<{ kohortId?: string }>();
  const { kohort } = useKohort(kohortId ?? "");
  const { user } = useUser(myUid);

  if (kohort?.admin !== myUid) return null;

  return (
    <Container textLeft>
      <StyledBigHeader>Administrer gruppe {kohort.groupName}</StyledBigHeader>
      <StyledSubHeader>Invitasjoner</StyledSubHeader>
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
      <Spacer />
      <Link to="/settings">Tilbake til innstillinger</Link>
    </Container>
  );
};
