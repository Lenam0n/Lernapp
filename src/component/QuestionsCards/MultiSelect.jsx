import React, { useEffect, useState } from "react";
import "./MultiSelect.css"; // Importiere die CSS-Datei

export const MultiSelect = ({ options, selectedAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionClick = (option) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(option)
        ? prevSelectedOptions.filter((item) => item !== option)
        : [...prevSelectedOptions, option]
    );
  };

  useEffect(() => {
    selectedAnswer = selectedOptions;
  }, [selectedOptions]);

  return (
    <div className="multi-select-container">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option)}
          className={`multi-select-option ${
            selectedOptions.includes(option) ? "selected" : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
