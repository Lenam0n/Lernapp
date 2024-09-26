import React, { useEffect } from "react";
import { useUser } from "../utils/UserProvider";
import { useNavigate } from "react-router-dom";

export const Logout = () => {
  const { logout } = useUser(); // Ändere Logout zu logout, um Standard-Namenskonventionen zu folgen
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Logge den Benutzer aus
    navigate("/login"); // Navigiere nach dem Logout zur Login-Seite
  }, [logout, navigate]); // useEffect wird nur einmal ausgeführt, wenn die Komponente gerendert wird

  return <div>Logging out...</div>; // Zeige einen kurzen Hinweis, dass der Benutzer ausgeloggt wird
};
