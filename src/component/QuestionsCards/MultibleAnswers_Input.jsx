import React from "react";

export const MultipleAnswers_Input = ({
  answerLabel,
  singleAnswer,
  handleAnswerChange,
}) => {
  return (
    <>
      {answerLabel.map((label, index) => {
        <div key={`${label - index}`}>
          <p>{label}</p>
          <input
            type="text"
            value={singleAnswer}
            onChange={(e) => handleAnswerChange(e.target.value, label)}
            placeholder="Your answer here"
          />
        </div>;
      })}
    </>
  );
};
