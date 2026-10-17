import React, { useState } from "react";
import { Container } from "../common/Container";

import { BorderButton, Button } from "../common/Button";
import { Link } from "../common/Link";
import { Spacer } from "../common/Spacer";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import firebase from "../firebase/firebase";
import { mutate } from "swr";
import Loading from "../common/Loading";
import { StyledNotification } from "../common/StyledNotification";

const ChildSetting = ({ childUid }: { childUid: string }) => {
  const { user } = useUser(childUid);

  return (
    <Link
      style={{
        marginRight: "1rem",
      }}
      to={`/settings/child/${user?.uid || ""}`}
    >
      <StyledSubHeader>
        {user?.name} ({childUid})
      </StyledSubHeader>
    </Link>
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
  const [notification, setNotification] = useState("");

  async function handleDeleteUser() {
    setLoading(true);
    const docRef = firebase.firestore().collection("groups").doc(groupId);

    const existingData = await docRef.get();

    docRef.update({
      members: existingData.data()?.members.filter((m: string) => myUid !== m),
    });

    await firebase
      .firestore()
      .collection("user")
      .doc(myUid)
      .update({
        groups: user?.groups.filter((m) => m !== groupId) ?? [],
      });

    mutate(["groups", groupId]);
    mutate(["user", myUid]);
    setLoading(false);
    setNotification(`Du er fjernet fra gruppe ${kohort?.groupName}`);

    setTimeout(() => {
      setNotification("");
    }, 2000);
  }

  return (
    <div className="flex items-start justify-start max-[450px]:flex-col">
      <StyledSubHeader style={{ marginRight: "1rem" }}>
        {kohort?.groupName}
      </StyledSubHeader>
      {kohort?.admin === myUid && (
        <Link
          style={{ marginRight: "1rem" }}
          to={`/settings/kohort/${kohort.id}`}
        >
          Administrer gruppe
        </Link>
      )}
      <Spacer />
      {loading ? (
        <Loading />
      ) : (
        <Button onClick={handleDeleteUser}>Forlate gruppen?</Button>
      )}
      <StyledNotification active={notification !== ""} text={notification} />
    </div>
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
    <Container textLeft>
      <h1>Innstillinger</h1>
      <Spacer />
      <p>Din bruker-id er: {uid}</p>
      <p>Din epost er: {firebaseUser?.email || "Ukjent"}</p>

      {showNoEmailDisclaimer && (
        <div className="m-10 rounded-[5px] border-5 border-solid border-[red] bg-white p-10 text-black">
          Vi kunne ikke finne eposten din. Dette betyr at du ikke kan inviteres
          til grupper. Send din id til administrator slik at vedkommende kan
          legge deg inn manuelt. Din id er: {uid}.
        </div>
      )}

      <Spacer />
      <BorderButton>
        <Link to={`/addgroup`}>Opprett ny gruppe</Link>
      </BorderButton>
      <StyledBigHeader>Administrer grupper</StyledBigHeader>
      {user?.groups.map((group) => (
        <React.Fragment key={group}>
          <GroupSetting myUid={uid} group={group} />
          <Spacer />
        </React.Fragment>
      ))}
      <StyledBigHeader>Brukere</StyledBigHeader>
      <div className="flex items-start justify-start max-[450px]:flex-col">
        {user?.childs?.map((childUid) => (
          <ChildSetting childUid={childUid} />
        ))}
      </div>

      <Spacer />
    </Container>
  );
};
