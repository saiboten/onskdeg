import React, { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

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
import { AddKohort } from "./components/group/AddKohort";
import firebase from "./components/firebase/firebase";

const App = () => {
  const [uid, setUid] = useState<string | undefined>();
  const [uidResolved, setUidResolved] = useState(false);

  console.log(uid, uidResolved);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user != null) {
        setUid(user.uid);
      }
      setUidResolved(true);
    });
  }, []);

  if (!uidResolved) {
    return <Loading />;
  }

  if (!uid) {
    return (
      <>
        <GlobalStyle />
        <Login />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <GlobalStyle />
        <HeaderComponent uid={uid} />
        <Switch>
          <Route path="/" exact>
            <YourWishList uid={uid} />
          </Route>
          <Route path="/wish/:wishid" exact>
            <YourWishDetails uid={uid} />
          </Route>
          <Route path="/others" component={SelectWishList} />
          <Route path="/other/:user/:wishid" component={OtherWishDetail} />
          <Route path="/other/:name" component={OthersWishList} />
          <Route path="/guardians">
            <Guardians uid={uid} />
          </Route>
          <Route path="/addgroup" component={AddKohort} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
