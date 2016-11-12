import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import YourWishList from './modules/yours/YourWishList'
import OthersWishListSelection from './modules/otherwishlistselection/OthersWishListSelection'
import OthersWishList from './modules/others/OthersWishList'
import ChoosePath from './modules/choosepath/ChoosePath'
import SelectUser from './modules/selectuser/SelectUser'
import NameSelect from './modules/nameselect/NameSelect'

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import store from './store';

require('normalize.css');
require('./global.css');
require("babel-polyfill");

render((
  <Provider store={store}>
  <Router history={hashHistory}>
    <Route path="/" component={SelectUser}/>
    <Route path="/choosepath" component={ChoosePath}/>
    <Route path="/nameselect" component={NameSelect}/>
    <Route path="/yours" component={YourWishList}/>
    <Route path="/others" component={OthersWishListSelection}/>
    <Route path="/other/:name" component={OthersWishList}/>
  </Router>
  </Provider>
), document.getElementById('wrapper'))
