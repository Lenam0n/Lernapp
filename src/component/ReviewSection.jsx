import React from "react";

// Überprüfungsbereich-Komponente
export const ReviewSection = ({ incorrectAnswers }) => {
  console.log(incorrectAnswers);
  return (
    <div>
      <h2>Review Incorrect Answers</h2>
      {incorrectAnswers.length === 0 ? (
        <p>Congratulations! You answered all questions correctly.</p>
      ) : (
        <ul>
          {incorrectAnswers.map((item, index) => (
            <li key={index}>
              <p>{item.Frage}</p>
              <p>Correct answer: {item.awnser}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
