import React from "react";
import "./TrueFalse.css"; // Importiere die CSS-Datei

export const TrueFalse = ({ handleAnswerChange }) => {
  return (
    <div className="true-false-container">
      <button
        className="true-false-button true-button"
        onClick={() => handleAnswerChange("true")}
      >
        True
      </button>
      <button
        className="true-false-button false-button"
        onClick={() => handleAnswerChange("false")}
      >
        False
      </button>
    </div>
  );
};
