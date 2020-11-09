import React from "react";
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";

import { YourWishList } from "./components/yours/YourWishList";
import { YourWishDetails } from "./components/yours/YourWishDetails";

import { SelectWishList } from "./components/selectwishlist/SelectWishList";
import { OthersWishList } from "./components/others/OthersWishList";
import { OtherWishDetail } from "./components/others/OtherWishDetail";
import { HeaderComponent } from "./components/header/Header";
import { Login } from "./components/login/Login";
import Loading from "./components/common/Loading";
import { GlobalStyle } from "./GlobalStyles";
import { Guardians } from "./components/guardians/Guardians";
import { AddGroup } from "./components/group/AddGroup";
import { useLoggedInUser } from "./hooks/useLoggedInUser";
import { useUser } from "./hooks/useUser";

// To prevent route update blockin
const HeaderWithRouter = withRouter(HeaderComponent);
const App = () => {
  const { loggedInUser, isLoading } = useLoggedInUser();

  if (isLoading) {
    return <Loading />;
  }

  if (!loggedInUser) {
    return (
      <>
        <GlobalStyle />
        <Login />
      </>
    );
  }

  return (
    <BrowserRouter>
      <GlobalStyle />
      <HeaderWithRouter />
      <Switch>
        <Route path="/" exact>
          <YourWishList user={loggedInUser} />
        </Route>
        <Route path="/wish/:wishid" exact component={YourWishDetails} />
        <Route path="/others" component={SelectWishList} />
        <Route path="/other/:user/:wishid" component={OtherWishDetail} />
        <Route path="/other/:name" component={OthersWishList} />
        <Route path="/guardians" component={Guardians} />
        <Route path="/addgroup" component={AddGroup} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
