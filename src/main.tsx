// @ts-nocheck

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TitleProvider } from "./context/fabricContext.tsx";
import { UrlProvider } from "./context/url-context/urlState.tsx";
import { CircleProvider } from "./context/circle-context/circleContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <UrlProvider>
      <CircleProvider>
    <TitleProvider>
      <App />
    </TitleProvider>
    </CircleProvider>
    </UrlProvider>
  </>
);
