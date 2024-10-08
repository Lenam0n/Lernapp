import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import axios from "axios";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./utils/UserProvider"; // Importiere den UserProvider
import { ApiProvider } from "./utils/APIprovider";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

// Setze global withCredentials, damit Cookies bei jedem Request mitgeschickt werden
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <ApiProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </ApiProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
