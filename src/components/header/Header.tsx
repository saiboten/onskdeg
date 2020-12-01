import React from "react";
import styled from "styled-components";
import { APP_TITLE } from "../../constants";
import { NavLink, Link } from "../common/Link";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Container } from "../common/Container";
import { useUser } from "../../hooks/useUser";

import { ReactComponent as UserIcon } from "../images/user.svg";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 3rem;
`;

const StyledUserIcon = styled(UserIcon)`
  margin-left: 12px;
  width: 32px;
  height: 32px;
  fill: ${(props) => props.theme.contrast};
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

  const H1 = styled.h1`
    color: ${(props) => props.theme.text};
  `;
  const UserEmail = styled.span`
    margin-right: 10px;
  `;
  const UserInfo = styled.div`
    position: absolute;
    top: 2.5rem;
    right: 3rem;
  `;
  const ActionButtons = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    gap: 1rem;
  `;

  return (
    <Container>
      <UserInfo>
        <span>gaveønske.no</span>
        <RouterNavLink activeClassName="selected" exact to="/profile">
          <StyledUserIcon />
        </RouterNavLink>
      </UserInfo>
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
          <NavLink
            activeClassName="selected"
            isActive={othersActive}
            to="/others"
          >
            Kohorter
          </NavLink>
        </ActionButtons>
      </StyledHeader>
    </Container>
  );
};
