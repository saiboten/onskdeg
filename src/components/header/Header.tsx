import React, { useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

import firebase from "../firebase/firebase";
import { logout as logoutAction } from "../../state/actions/user";
import { ApplicationState } from "../../state/reducers";
import { APP_TITLE } from "../../constants";
import { NavLink, Link } from "../common/Link";
import Container from "../common/Container";
import { ButtonNavigation } from "../common/Button";

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

function logOut(setFeedback: (n: string) => void, logout: () => void) {
  firebase
    .auth()
    .signOut()
    .then(
      () => {
        setFeedback("Du er nå logget ut");
        logout();
      },
      e => {
        console.log(e);
        setFeedback("Noe gikk galt under utlogging.");
      }
    );
}

const othersActive = (match: any, location: any) =>
  location.pathname.startsWith("/other");

const yoursActive = (match: any, location: any) =>
  location.pathname === "/" || location.pathname.startsWith("/wish");

export const HeaderComponent = () => {
  const { user } = useSelector(({ user }: ApplicationState) => ({ user }));

  const dispatch = useDispatch();

  function logout() {
    dispatch(logoutAction());
  }

  const [feedback, setFeedback] = useState("");

  if (!user || !user.uid) {
    return null;
  }

  const H1 = styled.h1`
    color: white;
  `;
  const UserEmail = styled.span`
    margin-right: 10px;
  `;
  const UserInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
    padding-right: 0.5rem;
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
      <H1>
        <Link to="/">{APP_TITLE}</Link>
      </H1>
      <UserInfo>
        <UserEmail>{user ? user.email : "Ukjent"}</UserEmail>
        <ButtonNavigation
          type="button"
          onClick={() => logOut(setFeedback, logout)}
        >
          Logg ut
        </ButtonNavigation>
        {feedback}
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
            Vennelister
          </CustomNavLink>
        </ActionButtons>
      </StyledHeader>
    </Container>
  );
};
