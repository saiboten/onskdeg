// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Container from '../common/container/Container';
import user from '../common/User';
import firebase from '../firebase/firebase';
import facebook from '../firebase/facebooklogin';

const debug = require('debug')('SelectUser');


require('./selectuser.css');

const mapStateToProps = function (state, ownProps) {
  debug('mapDispatchToProps: ', state, ownProps);
  return {
    userReducer: state.userReducer,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => (
  {}
);

class SelectUser extends React.Component {

  static loginFacebook(e) {
    debug('loginFacebook', e);

    e.preventDefault();
    firebase.auth().signInWithRedirect(facebook);
  }

  constructor(props) {
    super();
    debug('constructor');
    this.state = {
      user: '',
      password: '',
      feedback: '',
    };
  }

  componentDidMount() {
    debug('componentDidMount');

    firebase.auth().getRedirectResult().then((result) => {
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

    debug('Logging user in with the following credentials: ', this.state.user, this.state.password);
    e.preventDefault();

    this.setState({
      feedback: '',
    });

    firebase.auth().signInWithEmailAndPassword(this.state.user, this.state.password).catch((error) => {
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
    }, (error) => {
      this.setState({
        feedback: 'Klarte ikke å logge deg ut, beklager det!',
      });
    });
  }

  render() {
    const loggedInAs =
    this.props.userReducer.uid ?
    (<p>Du er logget inn som: <strong>{this.props.userReducer.email}</strong></p>) : '';

    const logoutLink = this.props.userReducer.uid ?
    (<button className="button-navigation" onClick={this.logOut}>Logg ut</button>) : '';

    const nextPage = this.props.userReducer.uid ?
    (<Link className="button" to="/choosepath">Gå videre</Link>) : '';

    const loginForm = this.props.userReducer.uid ? '' : (
      <form className="select-user__form" onSubmit={this.logIn} >
        <div className="smallspace">Brukernavn</div>
        <div className="smallspace" value={this.state.user} onChange={this.updateUserState} />
        <div className="smallspace">Passord</div>
        <input
          type="password"
          className="smallspace"
          value={this.state.password}
          onChange={this.updatePasswordState}
        />
        <div className="flex-row space-between">
          <input className="button" type="submit" value="Logg inn" />
          <button
            className="button select-user__facebook-button"
            onClick={this.loginFacebook}
          >
            Logg inn <br />med facebook
          </button>
        </div>
      </form>
    );

    return (<Container>
      <h1>Logg inn</h1>

      {loggedInAs}

      {loginForm}

      {this.state.feedback}

      <div className="flex-row space-between">
        {logoutLink}
        {nextPage}
      </div>

    </Container>);
  }
}

SelectUser.propTypes = {
  userReducer: React.PropTypes.object,
};

export default connect(
  mapStateToProps, mapDispatchToProps)(SelectUser);
