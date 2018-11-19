import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import firebase from '../firebase/firebase';
import { User } from '../../types/types';
import ThirdPartyLogin from './ThirdPartyLogin';
import InternalLogin from './InternalLogin';
import FloatingCircles from '../common/FloatingCircles';

const debug = require('debug')('SelectUser');

const StyledParagraph = styled.p`
font-size: 3rem;
margin: 2rem;
`;

require('./selectuser.scss');

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  height: 100%;
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

  render() {
    const { feedback } = this.state;

    const H1 = styled.h1`
      color: white;
      font-weight: 400;
      margin: 4rem 0;
    `;

    

    return (
      <BrowserRouter>
        <LoginContainer>
          <H1>GAVEØNSKE.NO</H1>
          <Switch>
            <Route path="/internal" component={InternalLogin} />
            <Route component={ThirdPartyLogin} />
          </Switch>
          <StyledParagraph>{feedback}</StyledParagraph>
          <FloatingCircles />
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
