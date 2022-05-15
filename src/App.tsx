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
import { NavLink } from "react-router-dom";
import { darkTheme, lightTheme, christmasTheme } from "./components/themes";
import { ReactComponent as UserIcon } from "./components/images/user.svg";
import { useSettings } from "./hooks/useSettings";
import styled from "styled-components";

const MainContainer = styled.div`
  background: ${(props) => props.theme.primaryDark};
  max-width: 103rem;
  margin: 0 auto;
  margin-top: 10.5rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
`;

const StyledUserIcon = styled(UserIcon)`
  margin-left: 12px;
  width: 32px;
  height: 32px;
  fill: ${(props) => props.theme.contrast};
  transform: translateY(0.5rem);
`;

const UserInfo = styled.div`
  color: ${(props) => props.theme.contrast};
  font-size: 1.6rem;
  position: absolute;
  top: 4.5rem;
  right: 3rem;
  position: fixed;
  z-index: -1;
`;

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
          <HashRouter>
            <Switch>
              <Route path="/privacypolicy">
                <PrivacyPolicy />
              </Route>
              <Route path="/tos">
                <TermsOfService />
              </Route>
              <Route path="/">
                <Login />
              </Route>
            </Switch>
          </HashRouter>
        </ThemeProvider>
      </>
    );
  }

  return (
    <ThemeProvider
      theme={
        settings?.festivitasThemesEnabled
          ? christmasTheme
          : settings?.darkMode
          ? darkTheme
          : lightTheme
      }
    >
      <HashRouter>
        <ScrollToTop />
        <Suspense fallback={<Loading />}>
          <GlobalStyle />
          <MainContainer>
            <UserInfo>
              <span>gaveønske.no</span>
              <NavLink activeClassName="selected" exact to="/profile">
                <StyledUserIcon />
              </NavLink>
            </UserInfo>
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
          </MainContainer>
        </Suspense>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
