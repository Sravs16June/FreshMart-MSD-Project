import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

if (typeof window !== "undefined") {
  window.addEventListener(
    "unhandledrejection",
    (e) => {
      const msg = String((e as any).reason || "");
      if (msg.includes("Understand this error")) {
        e.preventDefault();
      }
    },
    { capture: true }
  );

  window.addEventListener(
    "error",
    (e: ErrorEvent) => {
      const src = String(e.filename || "");
      if (src.includes("enable_copy") || src.includes("content.js")) {
        e.preventDefault();
      }
    },
    { capture: true }
  );
}

createRoot(document.getElementById("root")!).render(<App />);
