import React from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { bool } from 'prop-types';

import YourWishList from './components/yours/YourWishList';
import OthersWishListSelection from './components/otherwishlistselection/OthersWishListSelectionWrapper';
import OthersWishList from './components/others/OthersWishList';
import ChoosePath from './components/choosepath/ChoosePathWrapper';
import SelectUser from './components/selectuser/SelectUser';
import NameSelect from './components/nameselect/NameSelectWrapper';
import Gifts from './components/gifts/Gifts';

import store from './store';

import authFirebase from './components/firebase/authFirebase';

require('./global.css');

const AppComp = ({ loaded }) => {
  if (!loaded) {
    return (<div>Laster</div>);
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={SelectUser} />
        <Route path="/choosepath" component={ChoosePath} />
        <Route path="/nameselect" component={NameSelect} />
        <Route path="/yours" component={YourWishList} />
        <Route path="/others" component={OthersWishListSelection} />
        <Route path="/gifts" component={Gifts} />
        <Route path="/other/:name" component={OthersWishList} />
      </Switch>
    </BrowserRouter>
  );
};

AppComp.propTypes = {
  loaded: bool,
};

AppComp.defaultProps = {
  loaded: false,
};

const AppCompWrapper = connect(({ user: { loaded } }) => ({ loaded }), null)(AppComp);

const App = () => (
  <Provider store={store}>
    <AppCompWrapper />
  </Provider>
);

authFirebase.authChangeListener();

export default App;
