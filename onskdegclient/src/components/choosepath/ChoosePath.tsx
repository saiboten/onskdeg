import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import { logout as logoutAction } from '../../state/actions/user';
import { ApplicationState } from '../../state/reducers';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButtons = styled.div`

`;

const StyledBack = styled.div`

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

interface ChoosePathProps {
  uid?: string;
  logout: () => void;
}
const ChoosePathComponent = ({ uid, logout } : ChoosePathProps) => {
  const [feedback, setFeedback] = useState('');

  if (!uid) {
    return <Redirect to="/" />;
  }

  return (
    <Container>
      <h1>Hvilken ønskeliste vil du se?</h1>
      <StyledHeader>
        <ActionButtons>
          <Link className="smallspace button button--padded" to="/yours">Din</Link>
          <Link className="smallspace button button--padded" to="/others">Andres</Link>
        </ActionButtons>
        <StyledBack>
          <button type="button" className="select-user__logout button-navigation button--square" onClick={() => logOut(setFeedback, logout)}>Logg ut</button>
          {feedback}
        </StyledBack>
      </StyledHeader>
    </Container>
  );
};

const mapStateToProps = ({ user: { uid }}: ApplicationState) => ({ uid });
const mapDispatchToProps = (dispatch: Dispatch) => ({
  logout() {
    dispatch(logoutAction());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChoosePathComponent);
