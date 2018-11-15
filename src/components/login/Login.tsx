import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import firebase from '../firebase/firebase';
import facebook from '../firebase/facebooklogin';
import { User } from '../../types/types';
import { ReactComponent as FbIcon } from './facebook-icon.svg';
import * as colors from '../../styles/colors';
import Spinner from '../common/Spinner';
import { RouteComponentProps } from 'react-router-dom';

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

const BorderButton = styled.button`
  border: 2px solid ${colors.gold};
  padding: 7px 14px;
  background: transparent;
  border-radius: 8px;
  outline: none;
  font-family: "Open Sans", "Helvetica Neue", Arial, Helvetica, Verdana, sans-serif;
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;
  width: 300px;
  min-height: 48px;
`;

const iconHeight = '30px';
const FacebookIcon = styled(FbIcon)`
  font-size: 1em;
  height: ${iconHeight};
  width: ${iconHeight};
  margin-right: 6px;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

const ButtonSpinner = styled(Spinner)`
  margin: 0 auto;
`;

interface Props {
  user: User;
  history: { push: (path: string) => void };
}

interface State {
  user: string;
  password: string;
  feedback: string;
  submitting: boolean;
}

class Login extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    debug('constructor');
    this.state = {
      user: '',
      password: '',
      feedback: '',
      submitting: false,
    };
    this.updateUserState = this.updateUserState.bind(this);
    this.updatePasswordState = this.updatePasswordState.bind(this);
    this.logIn = this.logIn.bind(this);
    this.loginFacebook = this.loginFacebook.bind(this);
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
  loginFacebook(e: React.MouseEvent<HTMLButtonElement>) {
  /* eslint-enable */
    debug('loginFacebook', e);

    e.preventDefault();
    e.stopPropagation();
    this.setState({ submitting: true });
    firebase.auth().signInWithRedirect(facebook);
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
      feedback: '',
      submitting: true
    });

    firebase.auth().signInWithEmailAndPassword(user, password).catch((error: any) => {
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
    const { user, history } = this.props;
    const { feedback, submitting } = this.state;

    const H1 = styled.h1`
      color: white;
    `;
    return (
      <>
        <LoginContainer>
          <H1>ØNSK DEG NOE</H1>
          <BorderButton
            onClick={this.loginFacebook}
          >
            { submitting ?
              <ButtonSpinner />
              : <>
                <FacebookIcon />
                Logg på med facebook
              </>
            }
            
          </BorderButton>
          <StyledParagraph>{feedback}</StyledParagraph>

        </LoginContainer>
      </>
    );
  }
}

const mapStateToProps = ({ user }: { user: User }) => (
{
  user,
});

export default connect(
  mapStateToProps, null,
)(Login);
