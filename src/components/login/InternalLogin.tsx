import React from 'react';
import styled from 'styled-components';
import { Link } from '../common/Link';
import colors from '../../styles/colors';
import { BorderInput } from '../common/Button';

const debug = require('debug')('InternalLogin');


const StyledInput = styled.input`
  height: 2.5rem;
  outline: none;
  padding: 0 1rem;
  margin-bottom: 12px;
  border: 0;
  -webkit-appearance: none;
  background: ${colors.goldDark};
  color: white;
  width: 100%;
  &::placeholder {
    color: grey;
  }
`;

const SubmitButton = styled(BorderInput)`
  width: 100%;
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
      <form onSubmit={this.logIn}>
      <label htmlFor="username" className="screen-reader-only">Brukernavn</label>
      <StyledInput id="username" value={this.state.user} onChange={this.updateUserState} placeholder="Brukernavn" />

      <label htmlFor="password" className="screen-reader-only">Passord</label>
      <StyledInput
        id="password"
        type="password"
        placeholder="Passord"
        value={this.state.password}
        onChange={this.updatePasswordState}
      />
        <SubmitButton type="submit" value="Logg inn" />
        <p>{this.state.errorMessage}</p>
        <Link to="/">Google/Facebook</Link>
      </form>
    );
  }
}

export default InternalLogin;
