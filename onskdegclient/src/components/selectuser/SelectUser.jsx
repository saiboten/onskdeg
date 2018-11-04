// @flow

import React from 'react';
import { any } from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Container from '../common/container/Container';
import firebase from '../firebase/firebase';
import facebook from '../firebase/facebooklogin';

const debug = require('debug')('SelectUser');


require('./selectuser.css');

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
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');

    firebase.auth().getRedirectResult().then(() => {
      debug('Login was apparently successful');
    }).catch((error) => {
      debug('Facebook login failed: ', error);
      // alert(error.code); - might be handy later
      // alert(error.message);

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

  logOut(e) {
    debug('logOut', e);

    e.preventDefault();

    this.setState({
      feedback: '',
      password: '',
    });

    firebase.auth().signOut().then(() => {
      this.setState({
        feedback: 'Du er nå logget ut',
      });
    }, () => {
      this.setState({
        feedback: 'Klarte ikke å logge deg ut, beklager det!',
      });
    });
  }

  render() {
    const { user } = this.props;
    const { user: userState, password, feedback } = this.state;

    const loggedInAs = user.uid
      ? (
        <p>
          {'Du er logget inn som: '}
          <strong>{user.email}</strong>
        </p>) : '';

    const logoutLink = user.uid
      ? (<button type="button" className="button-navigation" onClick={this.logOut}>Logg ut</button>) : '';

    const nextPage = user.uid
      ? (<Link className="button button--padded" to="/choosepath">Gå videre</Link>) : '';

    const loginForm = user.uid ? '' : (
      <form className="select-user__form" onSubmit={this.logIn}>
        <div className="smallspace">Brukernavn</div>
        <input className="smallspace" value={userState} onChange={this.updateUserState} />
        <div className="smallspace">Passord</div>
        <input
          type="password"
          className="smallspace"
          value={password}
          onChange={this.updatePasswordState}
        />
        <div className="flex-row space-between">
          <input className="button" type="submit" value="Logg inn" />
          <button
            type="button"
            className="button select-user__facebook-button"
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
        {feedback}

        <div className="flex-row space-between">
          {logoutLink}
          {nextPage}
        </div>

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
