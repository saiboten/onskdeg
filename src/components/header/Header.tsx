import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import firebase from '../firebase/firebase';
import { logout as logoutAction } from '../../state/actions/user';
import { ApplicationState } from '../../state/reducers';
import { UserState } from '../../state/reducers/types';
import { APP_TITLE } from '../../constants';
import { NavLink } from '../common/Link';
import { RouterProps } from 'react-router';
import { RouteComponentProps } from 'react-router-dom';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function logOut(setFeedback: (n: string) => void, logout: () => void) {
  firebase.auth().signOut().then(() => {
    setFeedback('Du er nå logget ut');
    logout();
  }, (e) => {
    console.log(e);
    setFeedback('Noe gikk galt under utlogging.');
  });
}

const othersActive = (match: any, location: any) => location.pathname.startsWith("/other");

export interface HeaderProps {
  user?: UserState;
  logout: () => void;
}
const HeaderComponent = ({ user, logout }: HeaderProps) => {
  const [feedback, setFeedback] = useState('');

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
    margin-bottom: .5rem;
    padding-right: .5rem;
  `;
  const ActionButtons = styled.div`
    display: flex;
    width: 100%;
  `;
  const CustomNavLink = styled(NavLink)`
    width: 50%;
  `;
  return (
    <>
      <H1>{APP_TITLE}</H1>
      <UserInfo>
        <UserEmail>{user ? user.email : 'Ukjent'}</UserEmail>
        <button type="button" className="button-navigation button--square" onClick={() => logOut(setFeedback, logout)}>Logg ut</button>
        {feedback}
      </UserInfo>
      <StyledHeader>
        <ActionButtons>
          <CustomNavLink activeClassName="selected" exact to="">Mine ønsker</CustomNavLink>
          <CustomNavLink activeClassName="selected" isActive={othersActive} to="/others">Vennelister</CustomNavLink>
        </ActionButtons>
      </StyledHeader>
    </>
  );
};

const mapStateToProps = ({ user }: ApplicationState) => ({ user });
const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout() {
    dispatch(logoutAction());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
