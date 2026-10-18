import { NavLink } from "../common/Link";
import { Container } from "../common/Container";
import { useUser } from "../../hooks/useUser";
import { useLocation } from "react-router-dom";

interface Props {
  uid: string;
}

export const HeaderComponent = ({ uid }: Props) => {
  const { user } = useUser(uid);
  const location = useLocation();

  if (!user) {
    return null;
  }

  const isYoursActive =
    location.pathname === "/" || location.pathname.startsWith("/wish");
  const isOthersActive = location.pathname.startsWith("/other");

  return (
    <Container className="pt-24 pb-16">
      <nav className="flex justify-center gap-10 max-[450px]:gap-8">
        <NavLink className={isYoursActive ? "selected" : ""} to="">
          Mine ønsker
        </NavLink>
        <NavLink className={isOthersActive ? "selected" : ""} to="/others">
          Grupper
        </NavLink>
      </nav>
    </Container>
  );
};
