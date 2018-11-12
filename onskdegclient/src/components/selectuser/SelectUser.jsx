import React from 'react';
import { any } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import facebook from '../firebase/facebooklogin';

const debug = require('debug')('SelectUser');


require('./selectuser.scss');

const StyledParagraph = styled.p`
  font-size: 3rem;
  margin: 2rem;
`;

const StyledInput = styled.input`
  margin: 2rem;
  height: 4rem;
`;

const mapStateToProps = ({ user }) => (
  {
    user,
  });

class SelectUser extends React.Component {
  constructor(props) {
    super(props);
    debug('constructor');
    this.state = {
      user: '',
      password: '',
      feedback: '',
    };
    this.updateUserState = this.updateUserState.bind(this);
    this.updatePasswordState = this.updatePasswordState.bind(this);
    this.logIn = this.logIn.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');

    firebase.auth().getRedirectResult().then(() => {
      debug('Login was apparently successful');
    }).catch((error) => {
      debug('Facebook login failed: ', error);

      if (error) {
        this.setState({
          feedback: 'Klarte ikke å logge deg inn med facebook, beklager det.',
        });
      }
    });
  }
  /* eslint-disable */
  loginFacebook(e) {
  /* eslint-enable */
    debug('loginFacebook', e);

    e.preventDefault();
    e.stopPropagation();
    firebase.auth().signInWithRedirect(facebook);
  }

  updateUserState(e) {
    debug('updateUserState', e);

    this.setState({
      user: e.target.value,
    });
  }

  updatePasswordState(e) {
    debug('updatePasswordState', e);

    this.setState({
      password: e.target.value,
    });
  }

  logIn(e) {
    debug('logIn', e);
    const { user, password } = this.state;

    debug('Logging user in with the following credentials: ', user, password);
    e.preventDefault();

    this.setState({
      feedback: '',
    });

    firebase.auth().signInWithEmailAndPassword(user, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      debug('Errorcode: ', errorCode, 'errorMessage', errorMessage);

      if (errorCode) {
        this.setState({
          feedback: 'Klarte ikke å logge deg inn, beklager det.',
        });
      }
    });
  }

  render() {
    const { user } = this.props;
    const { user: userState, password, feedback } = this.state;

    const loggedInAs = user.uid
    && (
    <StyledParagraph>
      {'Du er logget inn som: '}
      <strong>{user.email}</strong>
    </StyledParagraph>
    );

    const loginForm = user.uid ? '' : (
      <form className="select-user__form" onSubmit={this.logIn}>
        <label htmlFor="username" className="smallspace">Brukernavn</label>
        <StyledInput id="username" value={userState} onChange={this.updateUserState} />
        <label htmlFor="password" className="smallspace">Passord</label>
        <StyledInput
          id="password"
          type="password"
          value={password}
          onChange={this.updatePasswordState}
        />
        <div className="flex-row space-between">
          <input className="button button--padded" type="submit" value="Logg inn" />
          <button
            type="button"
            className="button button--padded select-user__facebook-button"
            onClick={this.loginFacebook}
          >
            {'Logg inn'}
            <br />
            {'Med facebook'}
          </button>
        </div>
      </form>
    );

    return (
      <Container>
        <h1>Logg inn</h1>
        {loggedInAs}
        {loginForm}
        <StyledParagraph>{feedback}</StyledParagraph>
      </Container>
    );
  }
}

SelectUser.propTypes = {
  user: any,
};

export default connect(
  mapStateToProps, null,
)(SelectUser);
