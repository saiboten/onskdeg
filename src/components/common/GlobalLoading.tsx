import Loading from "./Loading";

export const GlobalLoading = () => (
  <div className="fixed top-0 left-0 z-9999 flex h-screen w-screen items-center justify-center bg-primary-dark">
    <Loading />
  </div>
);
