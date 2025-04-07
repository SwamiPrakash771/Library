import { Outlet, Navigate } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "./layouts/Utils/SpinnerLoading";

const PrivateRoutes = () => {
  const { authState } = useOktaAuth();

  if (!authState) {
    return <SpinnerLoading />;
  }

  return authState.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
