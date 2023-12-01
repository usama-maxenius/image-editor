import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TitleProvider } from "./context/fabricContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TitleProvider>
      <App />
    </TitleProvider>
  </React.StrictMode>
);
