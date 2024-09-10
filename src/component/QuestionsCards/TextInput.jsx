import React from "react";
import "./TextInput.css"; // Importiere die CSS-Datei

export const TextInput = ({ inputAnswer, handleAnswerChange }) => {
  return (
    <div className="text-input-container">
      <input
        type="text"
        value={inputAnswer}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder="Your answer here"
        className="text-input-field"
      />
    </div>
  );
};
