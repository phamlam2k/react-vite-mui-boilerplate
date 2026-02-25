import { useGetAuthMe } from "@shared/apis/auth.hook";
import { Navigate } from "react-router";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, error } = useGetAuthMe();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <Navigate to={"/auth/login"} replace />;
  }

  return children;
};

export default AuthGuard;
