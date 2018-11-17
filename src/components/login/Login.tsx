import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import firebase from '../firebase/firebase';
import facebook from '../firebase/facebooklogin';
import { User } from '../../types/types';
import ThirdPartyLogin from './ThirdPartyLogin';
import InternalLogin from './InternalLogin';
import colors from '../../styles/colors';

const debug = require('debug')('SelectUser');

require('./selectuser.scss');

const StyledParagraph = styled.p`
  font-size: 3rem;
  margin: 2rem;
`;

const StyledCircleContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

function getRandomInt(min: number, max: number) {
  var num = Math.floor((Math.random() * Math.floor(max)));
  if(num < min) {
    num += min;
  }
  return num;
}

interface StyledCircleProps {
  size: string;
  top: string;
  left: string;
}

const StyledCircle = styled.div`
  background-color: ${colors.goldDark};
  border-radius: 50%;
  filter: opacity(.5);
  position: absolute;
  width: ${(props: StyledCircleProps) => props.size};
  height: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
`;

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

    const circles = Array(15).fill(0).map(
      (el, index) =>
        <StyledCircle
          key={index}
          size={`${getRandomInt(50, 500)}px`}
          top={`${getRandomInt(0, 100)}%`}
          left={`${getRandomInt(0, 100)}%`} />);

    return (
      <BrowserRouter>
        <LoginContainer>
          <H1>GAVEØNSKE.NO</H1>
          <Switch>
            <Route path="/internal" component={InternalLogin} />
            <Route component={ThirdPartyLogin} />
          </Switch>
          <StyledParagraph>{feedback}</StyledParagraph>
          <StyledCircleContainer>
            {circles}
          </StyledCircleContainer>
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
