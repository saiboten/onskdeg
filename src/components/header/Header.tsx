import React from "react";
import styled from "styled-components";
import { NavLink, NavLinkRight } from "../common/Link";
import { Container } from "../common/Container";
import { useUser } from "../../hooks/useUser";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 3rem;
`;

const othersActive = (_: any, location: any) =>
  location.pathname.startsWith("/other");

const yoursActive = (_: any, location: any) =>
  location.pathname === "/" || location.pathname.startsWith("/wish");

interface Props {
  uid: string;
}

export const HeaderComponent = ({ uid }: Props) => {
  const { user } = useUser(uid);

  if (!user) {
    return null;
  }

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
            activeClassName="selected"
            isActive={yoursActive}
            exact
            to=""
          >
            Mine ønsker
          </NavLink>
          <NavLinkRight
            activeClassName="selected"
            isActive={othersActive}
            to="/others"
          >
            Kohorter
          </NavLinkRight>
        </ActionButtons>
      </StyledHeader>
    </Container>
  );
};
