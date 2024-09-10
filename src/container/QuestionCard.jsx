import React from "react";
import AnswerButton from "../component/AnswerButton";
import QuestionHeader from "../component/QuestionHeader";
import { MultipleChoice } from "../component/QuestionsCards/MultipleChoise";
import { TextInput } from "../component/QuestionsCards/TextInput";
import { TrueFalse } from "../component/QuestionsCards/TrueFalse";
import { MultiSelect } from "../component/QuestionsCards/MultiSelect";
import { Graph } from "../component/QuestionsCards/Graph";
import { MultipleAnswersInput } from "../component/QuestionsCards/MultipleAnswersInput";
import "./QuestionCard.css"; // Importiere die CSS-Datei

const QuestionCard = ({
  question,
  questionType,
  options,
  multipleAnswer,
  singleAnswer,
  handleAnswerChange,
  handleCheckAnswer,
  handleNextQuestion,
  additionalData,
  isCorrect,
  answerLabel,
}) => {
  const renderQuestionContent = () => {
    switch (questionType) {
      case "multiple_choice":
        return (
          <div className="answer-options-container">
            <MultipleChoice
              options={options}
              handleAnswerChange={handleAnswerChange}
            />
            <button onClick={handleCheckAnswer} className="submit-button">
              Submit
            </button>
          </div>
        );

      case "text_input":
        return (
          <div className="answer-options-container">
            <TextInput
              singleAnswer={singleAnswer}
              handleAnswerChange={handleAnswerChange}
            />
            <button onClick={handleCheckAnswer} className="submit-button">
              Submit
            </button>
          </div>
        );

      case "true_false":
        return (
          <div className="answer-options-container">
            <TrueFalse handleAnswerChange={handleAnswerChange} />
          </div>
        );

      case "multiselect":
        return (
          <div className="answer-options-container">
            <MultiSelect options={options} multipleAnswer={multipleAnswer} />
          </div>
        );

      case "multiple_graph_answers":
        return (
          <div className="multiple-graph-input">
            <Graph additionalData={additionalData} />
            <MultipleAnswersInput
              handleAnswerChange={handleAnswerChange}
              answerLabel={answerLabel}
              singleAnswer={singleAnswer}
            />
          </div>
        );

      case "graph":
        return (
          <div className="graph-container">
            <Graph additionalData={additionalData} />
            <TextInput
              singleAnswer={singleAnswer}
              handleAnswerChange={handleAnswerChange}
            />
            <button onClick={handleCheckAnswer} className="submit-button">
              Submit
            </button>
          </div>
        );

      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div className="question-card-container">
      <QuestionHeader question={question} className="question-header" />
      {renderQuestionContent()}

      {isCorrect !== null && (
        <div>
          {isCorrect ? (
            <p className="correct-answer-message">Correct!</p>
          ) : (
            <p className="incorrect-answer-message">
              Incorrect, the correct answer was: {question.answer}
            </p>
          )}
          <AnswerButton
            onClick={handleNextQuestion}
            className="answer-button"
          />
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
