import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"; // Importiere js-cookie

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token"); // Hole das Token aus den Cookies

  // Wenn kein Token vorhanden ist, leite zur Login-Seite weiter
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Wenn ein Token vorhanden ist, gib die Kinderkomponenten zurück
  return children;
};

export default ProtectedRoute;
