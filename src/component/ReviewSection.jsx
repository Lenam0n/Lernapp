import React from "react";
import { useNavigate } from "react-router-dom";
import HomeButton from "./HomeButton.jsx";
import "./ReviewSection.css"; // Importiere die CSS-Datei

// Überprüfungsbereich-Komponente
export const ReviewSection = ({ incorrectAnswers }) => {
  const navigate = useNavigate();

  return (
    <div className="review-section-container">
      {incorrectAnswers.length === 0 ? (
        <p className="congratulations-text">
          Congratulations! You answered all questions correctly.
        </p>
      ) : (
        <>
          <h2 className="review-section-title">Review Incorrect Answers</h2>
          <ul className="incorrect-answer-list">
            {incorrectAnswers.map((item, index) => (
              <li key={index} className="incorrect-answer-item">
                <p className="question-text">{item.question}</p>
                {item.type === "multiple_graph_answers" ? (
                  // Behandlung für multiple_graph_answers
                  <div>
                    <p className="correct-answer">Correct Answers:</p>
                    <ul>
                      {item.answer.map((answer, answerIndex) => (
                        <li key={answerIndex}>
                          <p>
                            {answer.label}: {answer.correct_answer}
                          </p>
                          <p className="explanation">
                            Explanation: {answer.explanation}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : item.type === "multiselect" ? (
                  // Behandlung für multiselect
                  <div>
                    <p className="correct-answer">Correct Answers:</p>
                    <ul>
                      {item.answer.map((answer, answerIndex) => (
                        <li key={answerIndex}>
                          <p>{answer.label}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  // Behandlung für Standardantworten
                  <p className="correct-answer">
                    Correct answer: {item.answer}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
      <HomeButton />
    </div>
  );
};
