import React from 'react';
import styled from 'styled-components';

import facebook from '../firebase/facebooklogin';
import firebase from '../firebase/firebase';

import { ReactComponent as FbIcon } from './facebook-icon.svg';
import * as colors from '../../styles/colors';
import Spinner from '../common/Spinner';
import StyledLink from '../common/StyledLink';
import { BorderButton } from '../common/Button';

const debug = require('debug')('ThirdPartyLogin');

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
    const SmButton = styled(BorderButton)`
      display: flex;
      align-items: center;
      width: 100%;`;
    
    return (
      <>
        <SmButton
          onClick={this.loginFacebook}
        >
          { this.state.submitting ?
            <ButtonSpinner />
            : <>
              <FacebookIcon />
              Logg på med facebook
            </>
          }
          
        </SmButton>
        <StyledLink to="/internal">Passord/brukernavn?</StyledLink>
      </>
    );
  }
}

export default ThirdPartyLogin;
