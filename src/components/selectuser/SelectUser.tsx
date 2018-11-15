import React from 'react';
import { any } from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';

import firebase from '../firebase/firebase';
import facebook from '../firebase/facebooklogin';
import { User } from '../../types/types';
import { Redirect } from 'react-router';
import { ReactComponent as FbIcon } from './facebook-icon.svg';
import * as colors from '../../styles/colors';
import YourWishList from '../yours/YourWishList';

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
  max-width: 300px;
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
`;

const mapStateToProps = ({ user }: { user: User }) => (
  {
    user,
  });

interface Props {
  user: User
}

interface State {
  user: string;
  password: string;
  feedback: string;
}

class SelectUser extends React.Component<Props, State> {
  constructor(props: any) {
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
  loginFacebook(e: React.MouseEvent<HTMLButtonElement>) {
  /* eslint-enable */
    debug('loginFacebook', e);

    e.preventDefault();
    e.stopPropagation();
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
    const { user } = this.props;
    if (user.uid) {
      return <YourWishList />;
    }
    const { user: userState, password, feedback } = this.state;

    const loginForm = (
        <LoginContainer>
          <BorderButton
            onClick={this.loginFacebook}
          >
            <FacebookIcon />
            Logg på med facebook
          </BorderButton>
        </LoginContainer>
    );

    return (
      <>
        <h1>ØNSK DEG NOE</h1>
        {loginForm}
        <StyledParagraph>{feedback}</StyledParagraph>
      </>
    );
  }
}

export default connect(
  mapStateToProps, null,
)(SelectUser);
