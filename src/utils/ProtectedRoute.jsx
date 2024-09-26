import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { user, useUser } from "./UserProvider";
import Loading from "../component/Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const token = Cookies.get("token"); // Check for user token
  const cookieConsent = Cookies.get("cookieConsent"); // Check for cookie consent

  if (loading) {
    // Zeige den Loader, solange die Benutzerdaten noch geladen werden
    return <Loading />;
  }

  // Wenn keine Zustimmung für Cookies gegeben wurde, zur Startseite umleiten
  if (!cookieConsent) {
    return <Navigate to="/home" />;
  }

  // Wenn der Benutzer nicht eingeloggt ist, zur Login-Seite umleiten
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
