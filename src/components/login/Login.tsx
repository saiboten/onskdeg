import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import firebase from '../firebase/firebase';
import facebook from '../firebase/facebooklogin';
import { User } from '../../types/types';
import ThirdPartyLogin from './ThirdPartyLogin';
import InternalLogin from './InternalLogin';

const debug = require('debug')('SelectUser');

require('./selectuser.scss');

const StyledParagraph = styled.p`
  font-size: 3rem;
  margin: 2rem;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

interface Props {
  user: User;
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
  loginFacebook(e: React.MouseEvent<HTMLButtonElement>) {
    debug('loginFacebook', e);

    e.preventDefault();
    e.stopPropagation();
    this.setState({ submitting: true });
    firebase.auth().signInWithRedirect(facebook);
  }

  render() {
    const { feedback } = this.state;

    const H1 = styled.h1`
      color: white;
      font-weight: 400;
    `;
    return (
      <BrowserRouter>
        <LoginContainer>
            <H1>ØNSK DEG NOE</H1>
            <Switch>
              <Route path="/" exact component={ThirdPartyLogin} />
              <Route path="/internal" component={InternalLogin} />
            </Switch>
            <StyledParagraph>{feedback}</StyledParagraph>
        </LoginContainer>
      </BrowserRouter>
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
