import React, { useEffect, useState, Suspense } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

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
import { Settings } from "./components/settings/Settings";
import { LegacyWishes } from "./components/LegacyWishes";
import { GroupAdmin } from "./components/settings/GroupAdmin";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { DeleteMe } from "./components/DeleteMe";
import { ChildAdmin } from "./components/settings/ChildAdmin";
import ScrollToTop from "./components/ScrollToTop";
import { MyPurchases } from "./components/MyPurchases";
import { FixWishes } from "./components/FixWishes";
import { Profile } from "./components/Profile";
import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./components/themes";
import { useSettings } from "./hooks/useSettings";

const App = () => {
  const [uid, setUid] = useState<string | undefined>();
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | undefined>();
  const [uidResolved, setUidResolved] = useState(false);
  const { settings, isLoading, isError } = useSettings(uid || "", false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user != null) {
        setUid(user.uid);
        setFirebaseUser(user);
      } else {
        setUid("");
        setFirebaseUser(undefined);
      }
      setUidResolved(true);
    });
  }, []);

  if (!uidResolved || isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Noe har gått galt.</div>;
  }

  if (!uid) {
    return (
      <>
        <ThemeProvider theme={darkTheme}>
          <GlobalStyle />
          <Login />
        </ThemeProvider>
      </>
    );
  }

  return (
    <ThemeProvider theme={settings?.darkMode ? darkTheme : lightTheme}>
      <HashRouter>
        <ScrollToTop />
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
            <Route path="/mypurchases">
              <MyPurchases uid={uid} />
            </Route>
            <Route path="/other/:uid/:wishid">
              <OtherWishDetail myUid={uid} />
            </Route>
            <Route path="/other/:uid">
              <OthersWishList myUid={uid} />
            </Route>
            <Route path="/addchild">
              <AddChild uid={uid} />
            </Route>
            <Route path="/profile">
              <Profile uid={uid} />
            </Route>
            <Route path="/settings/kohort/:kohortId">
              <GroupAdmin myUid={uid} />
            </Route>
            <Route path="/settings/child/:childId">
              <ChildAdmin myUid={uid} />
            </Route>
            <Route path="/settings">
              <Settings firebaseUser={firebaseUser} uid={uid} />
            </Route>
            <Route path="/addgroup">
              <AddKohort uid={uid} />
            </Route>
            <Route path="/privacypolicy">
              <PrivacyPolicy />
            </Route>
            <Route path="/tos">
              <TermsOfService />
            </Route>
            <Route path="/deleteme">
              <DeleteMe />
            </Route>
            <Route path="/legacy">
              <LegacyWishes uid={uid} />
            </Route>
            <Route path="/fixwishes">
              <FixWishes />
            </Route>
            <Route path="/">
              <YourWishList firebaseUser={firebaseUser} uid={uid} />
            </Route>
          </Switch>
        </Suspense>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
