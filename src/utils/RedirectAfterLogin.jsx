import React from "react";
import { Navigate } from "react-router-dom";

const RedirectAfterLogin = ({ children }) => {
  const token = localStorage.getItem("token"); // Token aus dem localStorage abrufen

  // Wenn der Benutzer eingeloggt ist, leite zur Startseite weiter
  if (token) {
    return <Navigate to="/home" />; // Hier kannst du zu einer Seite wie "/home" weiterleiten
  }

  // Wenn der Benutzer nicht eingeloggt ist, zeige die Kinderkomponente (z.B. Login oder Register)
  return children;
};

export default RedirectAfterLogin;
