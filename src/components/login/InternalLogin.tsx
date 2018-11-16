import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import StyledLink from '../common/StyledLink';

const debug = require('debug')('InternalLogin');


const StyledInput = styled.input`
  margin: 2rem;
  height: 4rem;
`;

interface State {
  user: string;
  password: string;
  submitting: boolean;
  errorMessage: string;
}
class InternalLogin extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: '',
      password: '',
      submitting: false,
      errorMessage: ''
    };
    this.updateUserState = this.updateUserState.bind(this);
    this.updatePasswordState = this.updatePasswordState.bind(this);
    this.logIn = this.logIn.bind(this);
  }
  updateUserState(e: React.ChangeEvent<HTMLInputElement>) {
    debug('updateUserState', e);

    this.setState({
      user: e.target.value,
    });
  }

  updatePasswordState(e: React.ChangeEvent<HTMLInputElement>) {
    debug('updatePasswordState', e);

    this.setState({
      password: e.target.value,
    });
  }

  logIn(e: React.FormEvent<HTMLFormElement>) {
    debug('logIn', e);
    const { user, password } = this.state;

    debug('Logging user in with the following credentials: ', user, password);
    e.preventDefault();

    this.setState({
      submitting: true
    });

    firebase.auth().signInWithEmailAndPassword(user, password).catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      debug('Errorcode: ', errorCode, 'errorMessage', errorMessage);

      if (errorCode) {
        this.setState({
          errorMessage: 'Klarte ikke å logge deg inn, beklager det.',
        });
      }
    });
  }

  render() {
    return (
      <form className="select-user__form" onSubmit={this.logIn}>
        <label htmlFor="username" className="smallspace">Brukernavn</label>
        <StyledInput id="username" value={this.state.user} onChange={this.updateUserState} />
        <label htmlFor="password" className="smallspace">Passord</label>
        <StyledInput
          id="password"
          type="password"
          value={this.state.password}
          onChange={this.updatePasswordState}
        />
        <input className="button button--padded" type="submit" value="Logg inn" />
        <p>{this.state.errorMessage}</p>
        <StyledLink to="/">Google/Facebook</StyledLink>
      </form>
    );
  }
}

export default InternalLogin;
