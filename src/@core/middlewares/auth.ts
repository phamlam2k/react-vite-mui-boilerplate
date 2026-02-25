// import AuthUrls from "@modules/auth/_routes/path";
// import { redirect } from "react-router";

const authMiddleware = async (_args: any, next: any) => {
  // const localStorageUser = localStorage.getItem("user");
  // if (!localStorageUser) {
  //   throw redirect(AuthUrls.LOGIN);
  // }

  return await next();
};

export default authMiddleware;
