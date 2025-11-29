import styled from "styled-components";
import { NavLink, NavLinkRight } from "../common/Link";
import { Container } from "../common/Container";
import { useUser } from "../../hooks/useUser";
import { useLocation } from "react-router-dom";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 3rem;
`;

interface Props {
  uid: string;
}

export const HeaderComponent = ({ uid }: Props) => {
  const { user } = useUser(uid);
  const location = useLocation();

  if (!user) {
    return null;
  }

  const isYoursActive = location.pathname === "/" || location.pathname.startsWith("/wish");
  const isOthersActive = location.pathname.startsWith("/other");

  const ActionButtons = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 1rem;

    @media (max-width: 450px) {
      gap: 0rem;
      justify-content: stretch;
    }
  `;

  return (
    <Container>
      <StyledHeader>
        <ActionButtons>
          <NavLink
            className={isYoursActive ? "selected" : ""}
            to=""
          >
            Mine ønsker
          </NavLink>
          <NavLinkRight
            className={isOthersActive ? "selected" : ""}
            to="/others"
          >
            Grupper
          </NavLinkRight>
        </ActionButtons>
      </StyledHeader>
    </Container>
  );
};
