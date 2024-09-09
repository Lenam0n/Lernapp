import React from "react";

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
