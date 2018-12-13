import React from 'react';
import styled from 'styled-components';
import { Link } from '../common/Link';
import colors from '../../styles/colors';
import { BorderInput } from '../common/Button';
import firebase from '../firebase/firebase';
import Icon from '../common/Icon';

const StyledInput = styled.input`
  height: 2.5rem;
  outline: none;
  padding: 0 1rem;
  margin-bottom: 12px;
  border: 0;
  -webkit-appearance: none;
  background: ${colors.primaryDark};
  color: white;
  width: 100%;
  &::placeholder {
    color: grey;
  }
`;

const SubmitButton = styled(BorderInput)`
  width: 100%;
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const StyledPeek = styled.button`
    position: absolute;
    border: 0;
    background-color: transparent;
    right: 15px;
    top: -8px;
    color: white;
`;

interface State {
  user: string;
  password: string;
  submitting: boolean;
  errorMessage: string;
  peek: boolean;
}
class InternalLogin extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: '',
      password: '',
      submitting: false,
      errorMessage: '',
      peek: false
    };
    this.updateUserState = this.updateUserState.bind(this);
    this.updatePasswordState = this.updatePasswordState.bind(this);
    this.logIn = this.logIn.bind(this);
    this.togglePeek = this.togglePeek.bind(this);
  }
  updateUserState(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      user: e.target.value,
    });
  }

  updatePasswordState(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      password: e.target.value,
    });
  }

  logIn(e: React.FormEvent<HTMLFormElement>) {
    const { user, password } = this.state;-
    e.preventDefault();

    this.setState({
      submitting: true
    });

    firebase.auth().signInWithEmailAndPassword(user, password).catch((error: any) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode) {
        this.setState({
          errorMessage: 'Klarte ikke å logge deg inn, beklager det.',
        });
      }
    });
  }

  togglePeek() {
    this.setState(({ peek }) => ({ peek: !peek }));
  }

  render() {
    return (
      <form onSubmit={this.logIn}>
        <label htmlFor="username" className="screen-reader-only">Brukernavn</label>
        <StyledInput id="username" value={this.state.user} onChange={this.updateUserState} placeholder="Brukernavn" />

        <PasswordContainer>
          <label htmlFor="password" className="screen-reader-only">Passord</label>
          <StyledInput
            id="password"
            type={this.state.peek ? "text" : "password"}
            placeholder="Passord"
            value={this.state.password}
            onChange={this.updatePasswordState}
          />
          <StyledPeek type="button" onClick={this.togglePeek}><Icon type="button" name={this.state.peek ? 'eye-off' : 'eye'} onClick={() => null} /></StyledPeek>
        </PasswordContainer>

        <SubmitButton type="submit" value="Logg inn" />
        <p>{this.state.errorMessage}</p>
        <Link to="/">Google/Facebook</Link>
      </form>
    );
  }
}

export default InternalLogin;
