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
`;

const StyledUserIcon = styled(UserIcon)`
  margin-left: 12px;
  width: 32px;
  height: 32px;
  fill: ${(props) => props.theme.primaryDark};
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
    top: 1rem;
    right: 0;
  `;
  const ActionButtons = styled.div`
    display: flex;
    width: 100%;
  `;

  const CustomNavLink = styled(NavLink)`
    width: 50%;
  `;

  return (
    <Container>
      <div
        style={{
          position: "relative",
        }}
      >
        <H1>
          <Link to="/">{APP_TITLE}</Link>
        </H1>
        <UserInfo>
          <RouterNavLink activeClassName="selected" exact to="/profile">
            <StyledUserIcon />
          </RouterNavLink>
        </UserInfo>
        <StyledHeader>
          <ActionButtons>
            <CustomNavLink
              activeClassName="selected"
              isActive={yoursActive}
              exact
              to=""
            >
              Mine ønsker
            </CustomNavLink>
            <CustomNavLink
              activeClassName="selected"
              isActive={othersActive}
              to="/others"
            >
              Kohorter
            </CustomNavLink>
          </ActionButtons>
        </StyledHeader>
      </div>
    </Container>
  );
};
