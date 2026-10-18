import { useEffect, useLayoutEffect, useState, Suspense } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

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
import { NavLink } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsQuery } from "./hooks/useSettings";
import { LoginWrapper } from "./components/login/LoginWrapper";
import { Link } from "./components/common/Link";

const App = () => {
  const [uid, setUid] = useState<string | undefined>();
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | undefined>();
  const [uidResolved, setUidResolved] = useState(false);
  const {
    data: settings,
    isPending: isLoading,
    isError,
  } = useQuery(settingsQuery(uid || ""));

  const theme = !uid
    ? "dark"
    : settings?.festivitasThemesEnabled
      ? "christmas"
      : settings?.darkMode
        ? "dark"
        : "light";

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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
      <HashRouter>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <Suspense fallback={<GlobalLoading />}>
        <div className="mx-auto flex max-w-1030 items-center justify-end gap-12 px-16 pt-24 pb-16 text-[1.6rem] text-contrast sm:px-30 sm:pt-36">
          <span>gaveønske.no</span>
          <NavLink to="/profile" aria-label="Profil">
            <UserIcon className="h-32 w-32 text-contrast" />
          </NavLink>
        </div>
        <div className="mx-auto mb-40 max-w-1030 rounded-[25px] bg-primary-dark pb-24 shadow-[0px_4px_4px_rgba(0,0,0,0.25),0px_4px_4px_rgba(0,0,0,0.25)] max-[1062px]:mx-16 max-[450px]:mx-8 max-[450px]:rounded-[18px]">
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
            <Route path="/legacy" element={<LegacyWishes uid={uid} />}></Route>
            <Route path="/fixwishes" element={<FixWishes />}></Route>
            <Route
              path="/"
              element={<YourWishList firebaseUser={firebaseUser} uid={uid} />}
            ></Route>
          </Routes>
          <footer className="mt-24 flex justify-center gap-24 text-[1.3rem]">
            <Link to="/privacypolicy">Privacy Policy</Link>
            <Link to="/tos">Terms of Service</Link>
          </footer>
        </div>
      </Suspense>
    </HashRouter>
  );
};

export default App;
