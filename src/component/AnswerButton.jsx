import React from "react";
import "./AnswerButton.css"; // Importiere die CSS-Datei

const AnswerButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="answer-button">
      Nächste Frage
    </button>
  );
};

export default AnswerButton;
