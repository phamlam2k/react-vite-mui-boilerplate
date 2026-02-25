import { RouterProvider } from "react-router";
import { AppRouter } from "./AppRouter";
import RootProvider from "@core/providers/RootProvider";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <RootProvider>
      <RouterProvider router={AppRouter} />

      <ToastContainer />
    </RootProvider>
  );
}
