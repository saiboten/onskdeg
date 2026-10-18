import { format } from "date-fns";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container } from "../common/Container";
import { NewsEntryType } from "../../types/types";
import { useUser } from "../../hooks/useUser";
import { useKohort } from "../../hooks/useKohort";
import { Link } from "../common/Link";
import { StyledBigHeader, StyledSubHeader } from "../common/StyledHeading";
import { Spacer } from "../common/Spacer";
import { Button } from "../common/Button";
import { TabContainer, Tab } from "../common/Tabs";

export const GroupUser = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);
  const navigate = useNavigate();

  return (
    <Button
      className="h-44 px-20 text-[1.5rem]"
      onClick={() => navigate(`/other/${user?.uid}`)}
    >
      {user?.name}
    </Button>
  );
};

const SortedGroupUsers = ({
  members,
  uid,
}: {
  members: string[];
  uid: string;
}) => {
  // Filter out current user and sort by UID for consistent rendering
  const filteredMembers = members.filter((member) => member !== uid).sort();

  return (
    <>
      {filteredMembers.map((memberId) => (
        <li key={memberId}>
          <GroupUser uid={memberId} />
        </li>
      ))}
    </>
  );
};

const NewsFeedEntry = ({
  user: uid,
  wish,
  isSuggestion,
  suggestedBy,
  date,
}: NewsEntryType) => {
  const { user } = useUser(uid);
  const { user: suggestedByUser } = useUser(suggestedBy || "");

  return (
    <li className="flex gap-12 wrap-break-word hyphens-auto">
      <span className="shrink-0 text-[1.4rem] leading-[2.7rem] opacity-75">
        {format(date.toDate(), "dd.MM 'kl' HH:mm")}
      </span>
      <span>
        {isSuggestion
          ? `${suggestedByUser?.name} foreslo et ønske for ${user?.name}`
          : `${user?.name} ønsker seg ${wish}`}
      </span>
    </li>
  );
};

const LatestNews = ({ newsFeed }: { newsFeed: NewsEntryType[] }) => {
  return (
    <ul className="flex list-none flex-col gap-4">
      {newsFeed?.length === 0 && <li>Intet nytt under solen ...</li>}
      {newsFeed.map((props) => (
        <NewsFeedEntry key={`${props.date}-${props.wish || ""}`} {...props} />
      ))}
    </ul>
  );
};

export const GroupUsers = ({
  uid,
  groupId,
}: {
  uid: string;
  groupId: string;
}) => {
  const { kohort } = useKohort(groupId);

  return (
    <div>
      <StyledBigHeader className="mb-24">
        Gruppe: <strong>{kohort?.groupName}</strong>
      </StyledBigHeader>
      <StyledSubHeader>Brukere</StyledSubHeader>
      <ul className="flex list-none flex-wrap gap-10">
        {kohort?.members && (
          <SortedGroupUsers members={kohort.members} uid={uid} />
        )}
      </ul>
      <Spacer />
      <StyledSubHeader>Siste nytt!</StyledSubHeader>
      <LatestNews newsFeed={kohort?.newsFeed ?? []}></LatestNews>
    </div>
  );
};

const GroupTab = ({
  groupId,
  $active,
  onClick,
}: {
  groupId: string;
  $active: boolean;
  onClick: () => void;
}) => {
  const { kohort } = useKohort(groupId);

  return (
    <Tab $active={$active} onClick={onClick}>
      {kohort?.groupName || "Laster..."}
    </Tab>
  );
};

interface Props {
  uid: string;
}

export const SelectWishList = function ({ uid }: Props) {
  const { user } = useUser(uid);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGroup = searchParams.get("group") || user?.groups[0];

  const handleGroupChange = (groupId: string) => {
    setSearchParams({ group: groupId });
  };

  return (
    <Container textLeft>
      {user?.groups.length === 0 && (
        <p>
          Du er ikke med i noen grupper enda. Enten må du få en invitasjon fra
          administrator i en annen gruppe, eller{" "}
          <Link to="/addgroup">opprett en gruppe her</Link>
        </p>
      )}

      {user?.groups && user.groups.length > 1 && (
        <TabContainer>
          {user.groups.map((groupId) => (
            <GroupTab
              key={groupId}
              groupId={groupId}
              $active={groupId === activeGroup}
              onClick={() => handleGroupChange(groupId)}
            />
          ))}
        </TabContainer>
      )}

      {activeGroup && <GroupUsers uid={uid} groupId={activeGroup} />}
    </Container>
  );
};
