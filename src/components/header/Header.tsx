import { NavLink, NavLinkRight } from "../common/Link";
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
    <Container>
      <div className="flex items-center justify-between pt-30">
        <div className="flex w-full justify-center gap-10 max-[450px]:justify-stretch max-[450px]:gap-0">
          <NavLink className={isYoursActive ? "selected" : ""} to="">
            Mine ønsker
          </NavLink>
          <NavLinkRight
            className={isOthersActive ? "selected" : ""}
            to="/others"
          >
            Grupper
          </NavLinkRight>
        </div>
      </div>
    </Container>
  );
};
