import { useState } from "react";
import { Container } from "../common/Container";

import { BorderButton, borderButton } from "../common/Button";
import { Link, UnstyledLink } from "../common/Link";
import ListRow from "../common/ListRow";
import { Plus } from "lucide-react";
import { useKohort } from "../../hooks/useKohort";
import { useUser } from "../../hooks/useUser";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import firebase from "../firebase/firebase";
import { invalidate } from "../../queryClient";
import Loading from "../common/Loading";
import { StyledNotification } from "../common/StyledNotification";

const ChildSetting = ({ childUid }: { childUid: string }) => {
  const { user } = useUser(childUid);

  return (
    <ListRow className="pr-16">
      <span className="min-w-0 wrap-break-word">
        {user?.name}{" "}
        <span className="text-[1.3rem] opacity-60">({childUid})</span>
      </span>
      <Link className="shrink-0" to={`/settings/child/${user?.uid || ""}`}>
        Administrer
      </Link>
    </ListRow>
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

    invalidate(["groups", groupId]);
    invalidate(["user", myUid]);
    setLoading(false);
    setNotification(`Du er fjernet fra gruppe ${kohort?.groupName}`);

    setTimeout(() => {
      setNotification("");
    }, 2000);
  }

  return (
    <ListRow className="flex-wrap py-8">
      <span className="min-w-0 font-semibold wrap-break-word">
        {kohort?.groupName}
      </span>
      <div className="flex flex-wrap items-center gap-16">
        {kohort?.admin === myUid && (
          <Link to={`/settings/kohort/${kohort.id}`}>Administrer</Link>
        )}
        {loading ? (
          <Loading />
        ) : (
          <BorderButton className="min-h-36 py-2" onClick={handleDeleteUser}>
            Forlat gruppen
          </BorderButton>
        )}
      </div>
      <StyledNotification active={notification !== ""} text={notification} />
    </ListRow>
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
      <StyledBigHeader>Innstillinger</StyledBigHeader>
      <div className="mb-24 flex flex-col gap-4">
        <p>
          Din bruker-id er: <span className="font-semibold">{uid}</span>
        </p>
        <p>
          Din epost er:{" "}
          <span className="font-semibold">
            {firebaseUser?.email || "Ukjent"}
          </span>
        </p>
      </div>

      {showNoEmailDisclaimer && (
        <div className="mb-24 rounded-[10px] border-2 border-solid border-negative px-16 py-12">
          Vi kunne ikke finne eposten din. Dette betyr at du ikke kan inviteres
          til grupper. Send din id til administrator slik at vedkommende kan
          legge deg inn manuelt. Din id er: {uid}.
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center justify-between gap-12">
        <StyledSubHeader className="mb-0">Grupper</StyledSubHeader>
        <UnstyledLink className={borderButton} to="/addgroup">
          <Plus size={18} />
          Opprett ny gruppe
        </UnstyledLink>
      </div>
      <div className="mt-12 mb-24">
        {user?.groups.map((group) => (
          <GroupSetting key={group} myUid={uid} group={group} />
        ))}
        {user?.groups.length === 0 && <p>Du er ikke med i noen grupper.</p>}
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-12">
        <StyledSubHeader className="mb-0">Ekstra brukere</StyledSubHeader>
        <UnstyledLink className={borderButton} to="/addchild">
          <Plus size={18} />
          Legg til ekstra bruker
        </UnstyledLink>
      </div>
      <div className="mt-12">
        {user?.childs?.map((childUid) => (
          <ChildSetting key={childUid} childUid={childUid} />
        ))}
        {!user?.childs?.length && <p>Ingen ekstra brukere.</p>}
      </div>
    </Container>
  );
};
