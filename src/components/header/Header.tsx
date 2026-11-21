import { Link, NavLink, useLocation } from "react-router-dom";
import { Gift } from "lucide-react";
import { useUser } from "../../hooks/useUser";
import { cn } from "../../util/cn";
import { Avatar } from "../common/Page";

interface Props {
  uid: string;
}

const tab =
  "flex-1 rounded-full px-20 py-8 text-center text-[1.5rem] font-semibold text-text no-underline transition-colors duration-200 sm:flex-none";

export const HeaderComponent = ({ uid }: Props) => {
  const { user } = useUser(uid);
  const { pathname } = useLocation();

  const isYoursActive = pathname === "/" || pathname.startsWith("/wish");
  const isOthersActive =
    pathname.startsWith("/other") || pathname.startsWith("/others");
  const isProfileActive =
    pathname.startsWith("/profile") || pathname.startsWith("/settings");

  return (
    <header className="mx-auto flex max-w-1030 flex-wrap items-center gap-x-16 gap-y-12 px-16 pt-20 pb-20 sm:px-30 sm:pt-28">
      <Link
        to="/"
        className="flex items-center gap-8 text-[2rem] font-bold tracking-[0.02em] text-text no-underline"
      >
        <span className="flex h-36 w-36 items-center justify-center rounded-[10px] bg-secondary">
          <Gift size={20} />
        </span>
        gaveønske.no
      </Link>

      {user && (
        <nav
          aria-label="Hovedmeny"
          className="order-3 flex w-full gap-4 rounded-full bg-primary-dark p-4 shadow-[0_2px_8px_rgba(0,0,0,0.15)] sm:order-2 sm:mx-auto sm:w-auto"
        >
          <NavLink
            to="/"
            className={cn(
              tab,
              isYoursActive ? "bg-secondary" : "opacity-75 hover:opacity-100",
            )}
          >
            Mine ønsker
          </NavLink>
          <NavLink
            to="/others"
            className={cn(
              tab,
              isOthersActive ? "bg-secondary" : "opacity-75 hover:opacity-100",
            )}
          >
            Grupper
          </NavLink>
        </nav>
      )}

      <NavLink
        to="/profile"
        aria-label="Profil"
        title="Profil"
        className={cn(
          "order-2 ml-auto rounded-full no-underline transition-shadow sm:order-3 sm:ml-0",
          isProfileActive
            ? "shadow-[0_0_0_3px_var(--color-contrast)]"
            : "hover:shadow-[0_0_0_3px_var(--color-secondary-dark)]",
        )}
      >
        <Avatar name={user?.name} />
      </NavLink>
    </header>
  );
};
