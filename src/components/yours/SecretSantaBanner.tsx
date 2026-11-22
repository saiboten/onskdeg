import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronRight } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";
import { useMySecretSantas } from "../../hooks/useSecretSanta";
import { useUser } from "../../hooks/useUser";
import { SecretSantaAssignment } from "../../types/types";
import { Avatar, Panel } from "../common/Page";

const Assignment = ({ assignment }: { assignment: SecretSantaAssignment }) => {
  const { user } = useUser(assignment.receiver);
  return (
    <Panel className="mb-16 p-0 sm:p-0 shadow-[inset_0_0_0_2px_var(--color-secondary)]">
      <RouterLink
        to={`/other/${assignment.receiver}`}
        className="flex items-center gap-12 p-16 text-text no-underline hover:opacity-85 sm:p-20"
      >
        <span className="text-[2.8rem] leading-none" aria-hidden="true">
          🎅
        </span>
        <span className="min-w-0 flex-1">
          <span className="block wrap-break-word">
            Du er hemmelig nisse for{" "}
            <strong>{user?.name || "en ukjent bruker"}</strong>
            {assignment.groupName && (
              <>
                {" "}
                i <em>{assignment.groupName}</em>
              </>
            )}
          </span>
          <span className="block text-[1.3rem] opacity-70">
            Se ønskelisten · Gjelder til{" "}
            {format(assignment.endsAt.toDate(), "d. MMMM", { locale: nb })}
          </span>
        </span>
        <Avatar name={user?.name} className="h-36 w-36 text-[1.3rem]" />
        <ChevronRight size={20} className="shrink-0 opacity-60" />
      </RouterLink>
    </Panel>
  );
};

/** Shows who the user is Secret Santa for, in each active group draw. */
export const SecretSantaBanner = ({ uid }: { uid: string }) => {
  const { assignments } = useMySecretSantas(uid);
  return (
    <>
      {assignments.map((a) => (
        <Assignment key={a.groupId} assignment={a} />
      ))}
    </>
  );
};
