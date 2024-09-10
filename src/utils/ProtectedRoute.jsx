import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // Wenn kein Token vorhanden ist, leite zur Login-Seite weiter
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Wenn ein Token vorhanden ist, gib die Kinderkomponenten zurück
  return children;
};

export default ProtectedRoute;
