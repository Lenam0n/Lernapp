import React from "react";
import "./CategorieButton.css"; // Importiere die CSS-Datei

const CategorieButton = ({
  navigateToQuestions,
  category,
  subCategory,
  name,
}) => {
  return (
    <button
      className="categorie-button"
      onClick={() => {
        navigateToQuestions(category, subCategory);
      }}
    >
      {name}
    </button>
  );
};

export default CategorieButton;
