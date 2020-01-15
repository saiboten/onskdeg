import React from "react";
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";

import { YourWishList } from "./components/yours/YourWishList";
import { YourWishDetails } from "./components/yours/YourWishDetails";

import { SelectWishList } from "./components/selectwishlist/SelectWishList";
import { OthersWishList } from "./components/others/OthersWishList";
import { OtherWishDetail } from "./components/others/OtherWishDetail";
import { HeaderComponent } from "./components/header/Header";
import { Login } from "./components/login/Login";
import { SetNameComp } from "./components/setname/SetName";

import store from "./store";

import authFirebase from "./components/firebase/authFirebase";
import { ApplicationState } from "./state/reducers";
import { UserState } from "./state/reducers/types";
import Loading from "./components/common/Loading";
import { GlobalStyle } from "./GlobalStyles";
import { Guardians } from "./components/guardians/Guardians";
import { AddGroup } from "./components/group/AddGroup";

// To prevent route update blockin
const HeaderWithRouter = withRouter<any>(HeaderComponent);
const AppComp = () => {
  const { user } = useSelector(({ user }: ApplicationState) => ({ user }));

  if (!user || !user.loaded) {
    return <Loading />;
  }
  if (!user.uid) {
    return <Login />;
  }

  if (!user.name) {
    return <SetNameComp />;
  }

  return (
    <BrowserRouter>
      <>
        <HeaderWithRouter />
        <Switch>
          <Route path="/" exact component={YourWishList} />
          <Route path="/wish/:wishid" exact component={YourWishDetails} />
          <Route path="/others" component={SelectWishList} />
          <Route path="/other/:user/:wishid" component={OtherWishDetail} />
          <Route path="/other/:name" component={OthersWishList} />
          <Route path="/guardians" component={Guardians} />
          <Route path="/addgroup" component={AddGroup} />
        </Switch>
      </>
    </BrowserRouter>
  );
};

const App = () => (
  <Provider store={store}>
    <>
      <GlobalStyle />
      <AppComp />
    </>
  </Provider>
);

authFirebase.authChangeListener();

export default App;
