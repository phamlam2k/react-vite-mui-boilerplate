import { RouterProvider } from "react-router";
import { AppRouter } from "./AppRouter";
import RootProvider from "@core/providers/RootProvider";

export default function App() {
  return (
    <RootProvider>
      <RouterProvider router={AppRouter} />
    </RootProvider>
  );
}
