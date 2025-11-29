import { useEffect, useState, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { YourWishList } from "./components/yours/YourWishList";
import { YourWishDetails } from "./components/yours/YourWishDetails";
import { UploadWishesPage } from "./components/yours/UploadWishesPage";

import { SelectWishList } from "./components/selectwishlist/SelectWishList";
import { OthersWishList } from "./components/others/OthersWishList";
import { OtherWishDetail } from "./components/others/OtherWishDetail";
import { HeaderComponent } from "./components/header/Header";
import { Login } from "./components/login/Login";
import Loading from "./components/common/Loading";
import { GlobalLoading } from "./components/common/GlobalLoading";
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
import UserIcon from "./components/images/user.svg?react";
import { useSettings } from "./hooks/useSettings";
import styled from "styled-components";
import { InternalLogin } from "./components/login/InternalLogin";
import { LoginWrapper } from "./components/login/LoginWrapper";
import { Link } from "./components/common/Link";

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
          <BrowserRouter>
            <Routes>
              <Route
                path="/privacypolicy"
                element={
                  <LoginWrapper>
                    <PrivacyPolicy />
                  </LoginWrapper>
                }
              ></Route>
              <Route
                path="/tos"
                element={
                  <LoginWrapper>
                    <TermsOfService />
                  </LoginWrapper>
                }
              ></Route>
              <Route path="/" element={<Login />}></Route>
              <Route path="/internal" element={<InternalLogin />} />
            </Routes>
          </BrowserRouter>
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
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<GlobalLoading />}>
          <GlobalStyle />
          <MainContainer>
            <UserInfo>
              <span>gaveønske.no</span>
              <NavLink to="/profile">
                <StyledUserIcon />
              </NavLink>
            </UserInfo>
            <HeaderComponent uid={uid} />
            <Routes>
              <Route
                path="/wish/:uid/:wishid"
                element={<YourWishDetails />}
              ></Route>
              <Route
                path="/upload-wishes"
                element={<UploadWishesPage uid={uid} />}
              ></Route>
              <Route
                path="/others"
                element={<SelectWishList uid={uid} />}
              ></Route>
              <Route
                path="/mypurchases"
                element={<MyPurchases uid={uid} />}
              ></Route>
              <Route
                path="/other/:uid/:wishid"
                element={<OtherWishDetail myUid={uid} />}
              ></Route>
              <Route
                path="/other/:uid"
                element={<OthersWishList myUid={uid} />}
              ></Route>
              <Route path="/addchild" element={<AddChild uid={uid} />}></Route>
              <Route path="/profile" element={<Profile uid={uid} />}></Route>
              <Route
                path="/settings/kohort/:kohortId"
                element={<GroupAdmin myUid={uid} />}
              ></Route>
              <Route
                path="/settings/child/:childId"
                element={<ChildAdmin myUid={uid} />}
              ></Route>
              <Route
                path="/settings"
                element={<Settings firebaseUser={firebaseUser} uid={uid} />}
              ></Route>
              <Route path="/addgroup" element={<AddKohort uid={uid} />}></Route>
              <Route path="/privacypolicy" element={<PrivacyPolicy />}></Route>
              <Route path="/tos" element={<TermsOfService />}></Route>
              <Route path="/deleteme" element={<DeleteMe />}></Route>
              <Route
                path="/legacy"
                element={<LegacyWishes uid={uid} />}
              ></Route>
              <Route path="/fixwishes" element={<FixWishes />}></Route>
              <Route
                path="/"
                element={<YourWishList firebaseUser={firebaseUser} uid={uid} />}
              ></Route>
            </Routes>
            <Link to="/privacypolicy">Privacy Policy</Link> -{" "}
            <Link to="/tos">Terms of Service</Link>
          </MainContainer>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
