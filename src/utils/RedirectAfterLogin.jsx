import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Importiere js-cookie

const RedirectAfterLogin = ({ children }) => {
  const token = Cookies.get("token"); // Token aus den Cookies abrufen

  // Wenn der Benutzer eingeloggt ist, leite zur Startseite weiter
  if (token) {
    return <Navigate to="/home" />;
  }

  // Wenn der Benutzer nicht eingeloggt ist, zeige die Kinderkomponente (z.B. Login oder Register)
  return children;
};

export default RedirectAfterLogin;
