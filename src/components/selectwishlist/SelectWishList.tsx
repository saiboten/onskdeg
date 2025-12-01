import styled from "styled-components";
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

const StyledKohorts = styled.div`
  padding: 1rem;
`;

const StyledUl = styled.ul`
  list-style-type: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const GroupUser = ({ uid }: { uid: string }) => {
  const { user } = useUser(uid);
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate(`/other/${user?.uid}`)} data-name={user?.name || ''}>
      {user?.name}
    </Button>
  );
};

const SortedGroupUsers = ({ members, uid }: { members: string[]; uid: string }) => {
  // Filter out current user
  const filteredMembers = members.filter((member) => member !== uid);
  
  // Sort by UID first (to maintain consistent hook order)
  const sortedByUid = [...filteredMembers].sort();
  
  // Fetch all users (hooks must be called unconditionally)
  const users = sortedByUid.map((memberId) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { user } = useUser(memberId);
    return { uid: memberId, name: user?.name || '' };
  });

  // Sort by name for display
  const sortedByName = [...users].sort((a, b) => 
    a.name.localeCompare(b.name, 'no', { sensitivity: 'base' })
  );
  
  return (
    <>
      {sortedByName.map((user) => (
        <li key={user.uid}>
          <GroupUser uid={user.uid} />
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
    <div
      style={{
        overflowWrap: "break-word",
        wordWrap: "break-word",
        wordBreak: "break-word",
        hyphens: "auto",
      }}
    >
      {isSuggestion
        ? `${format(date.toDate(), "dd.MM 'kl' HH:mm")}: ${
            suggestedByUser?.name
          } foreslo et ønske for ${user?.name}`
        : `${format(date.toDate(), "dd.MM 'kl' HH:mm")}: ${
            user?.name
          } ønsker seg ${wish}`}
    </div>
  );
};

const LatestNews = ({ newsFeed }: { newsFeed: NewsEntryType[] }) => {
  return (
    <div>
      {newsFeed?.length === 0 && <div>Intet nytt under solen ...</div>}
      {newsFeed.map((props) => (
        <NewsFeedEntry key={`${props.date}-${props.wish || ""}`} {...props} />
      ))}
    </div>
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
    <StyledKohorts>
      <StyledBigHeader>
        Gruppe: <strong>{kohort?.groupName}</strong>
      </StyledBigHeader>
      <Spacer />
      <StyledSubHeader>Siste nytt!</StyledSubHeader>
      <LatestNews newsFeed={kohort?.newsFeed ?? []}></LatestNews>
      <Spacer />
      <StyledSubHeader>Brukere</StyledSubHeader>
      <StyledUl>
        {kohort?.members && <SortedGroupUsers members={kohort.members} uid={uid} />}
      </StyledUl>
    </StyledKohorts>
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
  const activeGroup = searchParams.get('group') || user?.groups[0];

  const handleGroupChange = (groupId: string) => {
    setSearchParams({ group: groupId });
  };

  return (
    <Container textLeft>
      {user?.groups.length === 0 && (
        <div>
          Du er ikke med i noen grupper enda. Enten må du få en invitasjon fra
          administrator i en annen gruppe, eller{" "}
          <Link to="/settings">opprett en gruppe her</Link>
        </div>
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
