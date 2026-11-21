import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { useSuspenseQueries } from "@tanstack/react-query";
import { ChevronRight, Plus, Settings, Users } from "lucide-react";
import { Container } from "../common/Container";
import { NewsEntryType } from "../../types/types";
import { userQuery, useUser } from "../../hooks/useUser";
import { useKohort } from "../../hooks/useKohort";
import { UnstyledLink } from "../common/Link";
import { borderButton, filledButton } from "../common/Button";
import { TabContainer, Tab } from "../common/Tabs";
import { Avatar, EmptyState, PageHeader, Panel, Section } from "../common/Page";
import { displayUrl, isUrl } from "../../util/format";

const MemberGrid = ({ members, uid }: { members: string[]; uid: string }) => {
  const results = useSuspenseQueries({
    queries: members.filter((m) => m !== uid).map(userQuery),
  });
  const users = results
    .map((r) => r.data)
    .filter((u) => u.uid)
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? "", "nb"));

  if (!users.length) {
    return (
      <p className="opacity-70">
        Ingen andre i gruppen ennå. Inviter noen fra innstillingene.
      </p>
    );
  }

  return (
    <ul className="grid list-none grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
      {users.map((user) => (
        <li key={user.uid}>
          <RouterLink
            to={`/other/${user.uid}`}
            className="flex items-center gap-12 rounded-[12px] bg-primary p-10 pr-12 text-text no-underline transition-colors hover:bg-secondary-dark"
          >
            <Avatar name={user.name} />
            <span className="min-w-0 flex-1 truncate font-semibold">
              {user.name ?? "Ukjent"}
            </span>
            <ChevronRight size={18} className="shrink-0 opacity-50" />
          </RouterLink>
        </li>
      ))}
    </ul>
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
    <li className="flex items-start gap-12 py-10 [&+&]:[border-top:1px_solid_var(--color-secondary-dark)]">
      <Avatar
        name={isSuggestion ? suggestedByUser?.name : user?.name}
        className="h-32 w-32 text-[1.2rem]"
      />
      <div className="min-w-0 flex-1 wrap-break-word">
        <p>
          {isSuggestion ? (
            <>
              <strong>{suggestedByUser?.name}</strong> foreslo et ønske for{" "}
              <strong>{user?.name}</strong>
            </>
          ) : (
            <>
              <strong>{user?.name}</strong> ønsker seg{" "}
              {isUrl(wish) ? `noe fra ${displayUrl(wish!)}` : wish}
            </>
          )}
        </p>
        <p className="text-[1.3rem] opacity-60">
          {formatDistanceToNow(date.toDate(), { addSuffix: true, locale: nb })}
        </p>
      </div>
    </li>
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
  const memberCount = kohort.members.length;
  const newsFeed = kohort.newsFeed ?? [];

  return (
    <>
      <PageHeader
        title={kohort.groupName}
        subtitle={`${memberCount} ${memberCount === 1 ? "medlem" : "medlemmer"}`}
        actions={
          kohort.admin === uid && (
            <UnstyledLink
              className={borderButton}
              to={`/settings/kohort/${groupId}`}
            >
              <Settings size={18} />
              Administrer
            </UnstyledLink>
          )
        }
      />
      <Section
        title="Ønskelister"
        description="Velg hvem du vil se ønskene til."
      >
        <MemberGrid members={kohort.members} uid={uid} />
      </Section>
      <Section title="Siste nytt">
        <Panel className="py-6 sm:py-8">
          {newsFeed.length === 0 ? (
            <p className="py-10 opacity-70">Ingenting nytt ennå.</p>
          ) : (
            <ul className="list-none">
              {newsFeed.map((props) => (
                <NewsFeedEntry
                  key={`${props.date?.seconds}-${props.wish || ""}`}
                  {...props}
                />
              ))}
            </ul>
          )}
        </Panel>
      </Section>
    </>
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

  if (!user?.groups.length) {
    return (
      <Container>
        <PageHeader title="Grupper" />
        <EmptyState
          icon={<Users size={32} />}
          title="Du er ikke med i noen grupper ennå"
        >
          <p className="mb-16">
            Få en invitasjon fra noen i en gruppe, eller opprett din egen og
            inviter familie og venner.
          </p>
          <UnstyledLink className={filledButton} to="/addgroup">
            <Plus size={18} />
            Opprett gruppe
          </UnstyledLink>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      {user.groups.length > 1 && (
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
