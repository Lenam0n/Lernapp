import React from "react";

export const MultipleChoice = ({ options, handleAnswerChange }) => {
  return (
    <div>
      {options.map((option, index) => (
        <button key={index} onClick={() => handleAnswerChange(option)}>
          {option}
        </button>
      ))}
    </div>
  );
};
