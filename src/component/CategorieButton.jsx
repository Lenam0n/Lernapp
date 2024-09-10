import React from "react";
import "./CategorieButton.css"; // Importiere die CSS-Datei

const CategorieButton = ({
  navigateToQuestions,
  setSubCategory,
  setCategory,
  category,
  subCategory,
  name,
}) => {
  return (
    <button
      className="categorie-button"
      onClick={() => {
        setCategory(category);
        setSubCategory(subCategory);
        navigateToQuestions(category, subCategory);
      }}
    >
      {name}
    </button>
  );
};

export default CategorieButton;
