import { RouterProvider } from "react-router";
import { AppRouter } from "./AppRouter";
import RootLayout from "@core/app-shell/layouts/RootLayout";

export default function App() {
  return (
    <RootLayout>
      <RouterProvider router={AppRouter} />
    </RootLayout>
  );
}
