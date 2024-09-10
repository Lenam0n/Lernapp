import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa"; // Home-Icon importieren
import "./HomeButton.css"; // Importiere die CSS-Datei

const HomeButton = () => {
  const navigate = useNavigate(); // Verwende den useNavigate Hook

  return (
    <button onClick={() => navigate("/home")} className="home-button">
      <FaHome className="home-button-icon" />
      Home
    </button>
  );
};

export default HomeButton;
