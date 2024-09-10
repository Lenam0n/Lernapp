import React from "react";
import "./CategorieHeader.css"; // Importiere die CSS-Datei

const CategorieHeader = ({ label }) => {
  return <h2 className="categorie-header">{label}</h2>;
};

export default CategorieHeader;
