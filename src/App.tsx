import React from 'react';
import {
  BrowserRouter, Route, Switch, Redirect,
} from 'react-router-dom';
import { Provider, connect } from 'react-redux';

import YourWishList from './components/yours/YourWishList';
import OthersWishListSelection from './components/otherwishlistselection/OthersWishListSelectionWrapper';
import OthersWishList from './components/others/OthersWishList';
import Header from './components/header/Header';
import Login from './components/login/Login';

import store from './store';

import authFirebase from './components/firebase/authFirebase';
import { ApplicationState } from './state/reducers';
import { UserState } from './state/reducers/types';
import Loading from './components/common/Loading';

require('./global.css');

interface AppProps {
  user: UserState;
}
const AppComp = ({ user } : AppProps) => {
  if (!user || !user.loaded) {
    return <Loading />;
  }
  if (!user || !user.uid) {
    return <Login />;
  }
  return (
    <BrowserRouter>
      <React.Fragment>
        <Header />
        <Switch>
          <Route path="/" exact component={YourWishList} />
          <Route path="/others" component={OthersWishListSelection} />
          <Route path="/other/:name" component={OthersWishList} />
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
};

const mapStateToProps = ({ user }: ApplicationState) => ({ user });
const AppCompWrapper = connect(mapStateToProps)(AppComp);

const App = () => (
  <Provider store={store}>
    <AppCompWrapper />
  </Provider>
);

authFirebase.authChangeListener();

export default App;
