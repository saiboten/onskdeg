import React from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import { Provider, connect } from 'react-redux';

import YourWishList from './components/yours/YourWishList';
import OthersWishListSelection from './components/otherwishlistselection/OthersWishListSelectionWrapper';
import OthersWishList from './components/others/OthersWishList';
import ChoosePath from './components/choosepath/ChoosePath';
import SelectUser from './components/selectuser/SelectUser';
import NameSelect from './components/nameselect/NameSelectWrapper';

import store from './store';

import authFirebase from './components/firebase/authFirebase';

require('./global.css');


const AppComp = (loaded: boolean) => {
  if (!loaded) {
    return (<div>Laster</div>);
  }

  return (
    <BrowserRouter>
      <React.Fragment>
        <ChoosePath />
        <Switch>
          <Route path="/" exact component={SelectUser} />
          <Route path="/nameselect" component={NameSelect} />
          <Route path="/yours" component={YourWishList} />
          <Route path="/others" component={OthersWishListSelection} />
          <Route path="/other/:name" component={OthersWishList} />
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
};


const AppCompWrapper = connect(({ user: { loaded } } : { user: { loaded: boolean }} ) => ({ loaded }), null)(AppComp);

const App = () => (
  <Provider store={store}>
    <AppCompWrapper />
  </Provider>
);

authFirebase.authChangeListener();

export default App;
