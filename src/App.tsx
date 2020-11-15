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
import { AddChild } from "./components/childs/AddChild";
import { AddKohort } from "./components/group/AddKohort";
import firebase from "./components/firebase/firebase";
import { Settings } from "./components/Settings";
import { LegacyWishes } from "./components/LegacyWishes";

const App = () => {
  const [uid, setUid] = useState<string | undefined>();
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | undefined>();
  const [uidResolved, setUidResolved] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user != null) {
        setUid(user.uid);
        setFirebaseUser(user);
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
      <Suspense fallback={<Loading />}>
        <GlobalStyle />
        <HeaderComponent uid={uid} />
        <Switch>
          <Route path="/wish/:uid/:wishid" exact>
            <YourWishDetails />
          </Route>
          <Route path="/others">
            <SelectWishList uid={uid} />
          </Route>
          <Route path="/other/:uid/:wishid">
            <OtherWishDetail />
          </Route>
          <Route path="/other/:uid">
            <OthersWishList />
          </Route>
          <Route path="/addchild">
            <AddChild uid={uid} />
          </Route>
          <Route path="/settings">
            <Settings uid={uid} />
          </Route>
          <Route path="/addgroup">
            <AddKohort uid={uid} />
          </Route>
          <Route path="/legacy">
            <LegacyWishes uid={uid} />
          </Route>
          <Route path="/">
            <YourWishList firebaseUser={firebaseUser} uid={uid} />
          </Route>
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
