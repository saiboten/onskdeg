// @flow
/* global document b:true*/
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
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


require('normalize.css');
require('./global.css');
/*eslint-disable */
require('babel-polyfill');
/*eslint-enable */

authFirebase.authChangeListener();
suggestionsFirebase.setupSuggestionListener();
wishesFirebase.setupWishesListener();

render((
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
), document.getElementById('wrapper'));