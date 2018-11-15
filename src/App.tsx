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

import store from './store';

import authFirebase from './components/firebase/authFirebase';
import { ApplicationState } from './state/reducers';

require('./global.css');


const AppComp = ({ loaded } : { loaded: boolean }) => {
  if (!loaded) {
    return (<div>Laster</div>);
  }

  return (
    <BrowserRouter>
      <React.Fragment>
        <ChoosePath />
        <Switch>
          <Route path="/" exact component={SelectUser} />
          <Route path="/others" component={OthersWishListSelection} />
          <Route path="/other/:name" component={OthersWishList} />
        </Switch>
      </React.Fragment>
    </BrowserRouter>
  );
};

const mapStateToProps = ({ user: { loaded } }: ApplicationState) => ({ loaded });
const AppCompWrapper = connect(mapStateToProps)(AppComp);

const App = () => (
  <Provider store={store}>
    <AppCompWrapper />
  </Provider>
);

authFirebase.authChangeListener();

export default App;
