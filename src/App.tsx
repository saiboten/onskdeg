import React from 'react';
import {
  BrowserRouter, Route, Switch, withRouter,
} from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import styled from 'styled-components';

import YourWishList from './components/yours/YourWishList';
import YourWishDetails from './components/yours/YourWishDetails';

import OthersWishListSelection from './components/otherwishlistselection/OthersWishListSelectionWrapper';
import OthersWishList from './components/others/OthersWishList';
import OtherWishDetail from './components/others/OtherWishDetail';
import Header from './components/header/Header';
import Login from './components/login/Login';
import SetName from './components/setname/SetName';

import store from './store';

import authFirebase from './components/firebase/authFirebase';
import { ApplicationState } from './state/reducers';
import { UserState } from './state/reducers/types';
import Loading from './components/common/Loading';
import { GlobalStyle } from './GlobalStyles';

interface AppProps {
  user: UserState;
}

// To prevent route update blockin
const HeaderWithRouter = withRouter<any>(Header);
const AppComp = ({ user }: AppProps) => {
  if (!user || !user.loaded) {
    return <Loading />;
  }
  if (!user.uid) {
    return <Login />;
  }

  if (!user.name) {
    return <SetName />;
  }
  
  return (
      <BrowserRouter>
        <>
          <HeaderWithRouter />
          <Switch>
            <Route path="/" exact component={YourWishList} />
            <Route path="/wish/:wishid" exact component={YourWishDetails} />
            <Route path="/others" component={OthersWishListSelection} />
            <Route path="/other/:user/:wishid" component={OtherWishDetail} />
            <Route path="/other/:name" component={OthersWishList} />
          </Switch>
        </>
      </BrowserRouter>
  );
};

const mapStateToProps = ({ user }: ApplicationState) => ({ user });
const AppCompWrapper = connect(mapStateToProps)(AppComp);

const App = () => (
  <Provider store={store}>
    <>
    <GlobalStyle />
    <AppCompWrapper />
    </>
  </Provider>
);

authFirebase.authChangeListener();

export default App;
