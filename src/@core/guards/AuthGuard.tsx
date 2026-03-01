import { useEffect } from "react";
import { useGetAuthMe } from "@shared/apis/auth.hook";
import { syncAuthFromUserProfile } from "@shared/stores/auth.store";
import { Navigate } from "react-router";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading, error } = useGetAuthMe();

  useEffect(() => {
    if (data) syncAuthFromUserProfile(data);
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Navigate to={"/auth/login"} replace />;
  }

  return children;
};

export default AuthGuard;
