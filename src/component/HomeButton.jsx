import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Home-Icon importieren
import "./HomeButton.css"; // Importiere die CSS-Datei

const HomeButton = ({ func }) => {
  const navigate = useNavigate(); // Verwende den useNavigate Hook

  return (
    <button
      onClick={() => {
        if (func) {
          func(); // Rufe die übergebene Funktion auf, wenn sie existiert
        }
        navigate("/categories"); // Navigiere zur Home-Seite
      }}
      className="home-button"
    >
      <FaHome className="home-button-icon" />
      Home
    </button>
  );
};

export default HomeButton;
