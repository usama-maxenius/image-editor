import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { CanvasContextProvider } from "./context/CanvasContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CanvasContextProvider>
    <App />
    <Toaster position="top-right" />
  </CanvasContextProvider>
);
