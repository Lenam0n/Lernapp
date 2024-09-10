import React, { useState } from "react";
import "./MultipleChoise.css"; // Importiere die CSS-Datei

export const MultipleChoice = ({ options, handleAnswerChange }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleClick = (option) => {
    setSelectedOption(option);
    handleAnswerChange(option);
  };

  return (
    <div className="multiple-choice-container">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleClick(option)}
          className={`multiple-choice-option ${
            selectedOption === option ? "selected" : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
