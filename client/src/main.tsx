// @crucial @learning @note the line below disables TypeScript's type checking in the file
// @ts-nocheck

import React from "react";
import { createRoot } from "react-dom/client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";
import './index.css';

import { StateContextProvider } from "./context";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/** @learning @critical thirdweb client ID is needed to access thirdweb services. Client ID is stored at client/.env */}
    <ThirdwebProvider
      activeChain="sepolia"
      clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID}
    >
      <Router>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </Router>
    </ThirdwebProvider>
  </React.StrictMode >
);
