import React from "react";

export const TextInput = ({ inputAnswer, handleAnswerChange }) => {
  return (
    <div>
      <input
        type="text"
        value={inputAnswer}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder="Your answer here"
      />
    </div>
  );
};
