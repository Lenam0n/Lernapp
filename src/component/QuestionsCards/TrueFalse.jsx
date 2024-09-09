import React from "react";

export const TrueFalse = ({ handleAnswerChange }) => {
  return (
    <div>
      <button onClick={() => handleAnswerChange("true")}>True</button>
      <button onClick={() => handleAnswerChange("false")}>False</button>
    </div>
  );
};
