import { createRoot } from "react-dom/client";
import "./index.css";
import "@shared/i18n/i18n"; // i18n must be initialized before App renders
import App from "./App.tsx";

async function enableMocking() {
  if (import.meta.env.MODE !== "development") {
    return;
  }

  const { worker } = await import("@core/__mocks__/browser.ts");

  return await worker.start({
    onUnhandledRequest: "warn",
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
