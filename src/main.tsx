import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

import { AppContextProvider } from "./context/AppContextProvider.tsx";
import { CartContextProvider } from "./context/CartContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppContextProvider>
      <CartContextProvider>
        <App />
      </CartContextProvider>
    </AppContextProvider>
  </BrowserRouter>
);
