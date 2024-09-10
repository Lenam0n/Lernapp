import React from "react";
import "./QuestionHeader.css"; // Importiere die CSS-Datei

const QuestionHeader = ({ question }) => {
  return (
    <div className="question-header-container">
      <h2 className="question-header">{question}</h2>
    </div>
  );
};

export default QuestionHeader;
