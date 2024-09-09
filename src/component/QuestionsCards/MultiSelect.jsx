import React, { useEffect, useState } from "react";

export const MultiSelect = ({ options, selectedAnswer }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionClick = (option) => {
    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(option)
        ? prevSelectedOptions.filter((item) => item !== option)
        : [...prevSelectedOptions, option]
    );
  };

  useEffect(() => {
    selectedAnswer = selectedOptions;
  }, [selectedOptions]);

  return (
    <div>
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleOptionClick(option)}
          style={{
            backgroundColor: selectedOptions.includes(option)
              ? "lightblue"
              : "white",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
