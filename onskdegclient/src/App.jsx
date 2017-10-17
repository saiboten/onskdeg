// @flow
/* global document b:true*/
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import YourWishList from './yours/YourWishList';
import OthersWishListSelection from './otherwishlistselection/OthersWishListSelection';
import OthersWishList from './others/OthersWishList';
import ChoosePath from './choosepath/ChoosePath';
import SelectUser from './selectuser/SelectUser';
import NameSelect from './nameselect/NameSelect';
import Gifts from './gifts/Gifts';

import store from './store';

import authFirebase from './firebase/authFirebase';
import suggestionsFirebase from './suggestions/suggestionsFirebase';
import wishesFirebase from './wish/wishesFirebase';

const debug = require('debug')('index');

require('./global.css');
/*eslint-disable */
require('babel-polyfill');
/*eslint-enable */

let loggedIn = false;

const StartApp = () => (
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={SelectUser} />
      <Route path="/choosepath" component={ChoosePath} />
      <Route path="/nameselect" component={NameSelect} />
      <Route path="/yours" component={YourWishList} />
      <Route path="/others" component={OthersWishListSelection} />
      <Route path="/gifts" component={Gifts} />
      <Route path="/other/:name" component={OthersWishList} />
    </Router>
  </Provider>
);

/* debug('this.context.router.getCurrentPathname();', this.context.router.getCurrentPathname());

if (this.context.router.getCurrentPathname() === '') {
  startApp();
}*/

authFirebase.authChangeListener(() => {
  debug('Auth! ');
  loggedIn = true;
  StartApp();
});

setTimeout(() => {
  if (!loggedIn) {
    browserHistory.push('/');
  }
}, 10000);

suggestionsFirebase.setupSuggestionListener();
wishesFirebase.setupWishesListener();

export default StartApp;
