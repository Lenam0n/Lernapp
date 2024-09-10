import React from "react";
import "./MultipleAnswersInput.css"; // Importiere die CSS-Datei

export const MultipleAnswersInput = ({
  answerLabel,
  singleAnswer,
  handleAnswerChange,
}) => {
  return (
    <div className="multiple-answers-container">
      {answerLabel.map((label, index) => (
        <div key={`${label}-${index}`} className="answer-item">
          <p className="answer-label">{label}</p>
          <input
            type="text"
            value={singleAnswer}
            onChange={(e) => handleAnswerChange(e.target.value, label)}
            placeholder="Your answer here"
            className="answer-input"
          />
        </div>
      ))}
    </div>
  );
};
