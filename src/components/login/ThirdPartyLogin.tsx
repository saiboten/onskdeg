import React from 'react';
import styled from 'styled-components';

import facebook from '../firebase/facebooklogin';
import firebase from '../firebase/firebase';

import { ReactComponent as FbIcon } from './facebook-icon.svg';
import * as colors from '../../styles/colors';
import Spinner from '../common/Spinner';
import StyledLink from '../common/StyledLink';

const debug = require('debug')('ThirdPartyLogin');

const BorderButton = styled.button`
  border: 2px solid ${colors.gold};
  padding: 7px 14px;
  background: transparent;
  border-radius: 8px;
  outline: none;
  font-size: 16px;
  color: white;
  display: flex;
  align-items: center;
  width: 300px;
  min-height: 48px;
  margin-bottom: 16px;
`;

const iconHeight = '30px';
const FacebookIcon = styled(FbIcon)`
  font-size: 1em;
  height: ${iconHeight};
  width: ${iconHeight};
  margin-right: 6px;
`;

const ButtonSpinner = styled(Spinner)`
  margin: 0 auto;
`;

interface State {
  submitting: boolean;
}
class ThirdPartyLogin extends React.Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      submitting: false
    };
    this.loginFacebook = this.loginFacebook.bind(this);
  }

  loginFacebook(e: React.MouseEvent<HTMLButtonElement>) {
    debug('loginFacebook', e);

    e.preventDefault();
    e.stopPropagation();
    this.setState({ submitting: true });
    firebase.auth().signInWithRedirect(facebook);
  }

  render() {
    return (
      <>
        <BorderButton
          onClick={this.loginFacebook}
        >
          { this.state.submitting ?
            <ButtonSpinner />
            : <>
              <FacebookIcon />
              Logg på med facebook
            </>
          }
          
        </BorderButton>
        <StyledLink to="/internal">Passord/brukernavn?</StyledLink>
      </>
    );
  }
}

export default ThirdPartyLogin;
