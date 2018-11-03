import React from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import { Provider } from 'react-redux';

import YourWishList from './components/yours/YourWishList';
import OthersWishListSelection from './components/otherwishlistselection/OthersWishListSelectionWrapper';
import OthersWishList from './components/others/OthersWishList';
import ChoosePath from './components/choosepath/ChoosePathWrapper';
import SelectUser from './components/selectuser/SelectUser';
import NameSelect from './components/nameselect/NameSelectWrapper';
import Gifts from './components/gifts/Gifts';

import store from './store';

import authFirebase from './components/firebase/authFirebase';
import suggestionsFirebase from './components/suggestions/suggestionsFirebase';
import wishesFirebase from './components/wish/wishesFirebase';
import usersFirebase from './components/users/userlistFirebase';

const debug = require('debug')('index');

require('./global.css');

let loggedIn = false;

const StartApp = () => (
  <Provider store={store}>
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
  </Provider>
);

/* debug('this.context.router.getCurrentPathname();', this.context.router.getCurrentPathname());

if (this.context.router.getCurrentPathname() === '') {
  startApp();
} */

authFirebase.authChangeListener(() => {
  debug('Auth! ');
  loggedIn = true;
  StartApp();
});

setTimeout(() => {
  if (!loggedIn) {
    window.location = '/';
  }
}, 10000);

suggestionsFirebase.setupSuggestionListener();
wishesFirebase.setupWishesListener();
usersFirebase.subscribe();

export default StartApp;
