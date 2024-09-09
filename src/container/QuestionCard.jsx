import React from "react";
import answerButton from "../component/answerButton";
import QuestionHeader from "../component/questionHeader";
import { MultipleChoice } from "../component/QuestionsCards/MultibleChoise";
import { TextInput } from "../component/QuestionsCards/TextInput";
import { TrueFalse } from "../component/QuestionsCards/TrueFalse";
import { MultiSelect } from "../component/QuestionsCards/MultiSelect";
import { Graph } from "../component/QuestionsCards/Graph";
import { MultipleAnswers_Input } from "../component/QuestionsCards/MultibleAnswers_Input";

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
          <>
            <MultipleChoice
              options={options}
              handleAnswerChange={handleAnswerChange}
            />
            <button onClick={handleCheckAnswer}>Submit</button>
          </>
        );

      case "text_input":
        return (
          <>
            <TextInput
              singleAnswer={singleAnswer}
              handleAnswerChange={handleAnswerChange}
            />
            <button onClick={handleCheckAnswer}>Submit</button>
          </>
        );

      case "true_false":
        return <TrueFalse handleAnswerChange={handleAnswerChange} />;

      case "multiselect":
        return (
          <MultiSelect options={options} multipleAnswer={multipleAnswer} />
        );

      case "multiple_graph_answers":
        return (
          <div>
            <Graph additionalData={additionalData} />
            <MultipleAnswers_Input
              handleAnswerChange={handleAnswerChange}
              answerLabel={answerLabel}
              singleAnswer={singleAnswer}
            />
          </div>
        );

      case "graph":
        return (
          <div>
            {/* muss noch geflext werden das es nebeneinander ist */}
            <Graph additionalData={additionalData} />
            <TextInput
              singleAnswer={singleAnswer}
              handleAnswerChange={handleAnswerChange}
            />
            <button onClick={handleCheckAnswer}>Submit</button>
          </div>
        );

      /*       case "picture_question":
        return <div></div>; */

      // Add additional cases here for new question types
      // Example:
      // case 'true_false':
      //   return (
      //     <div>
      //       <button onClick={() => handleAnswerChange('true')}>True</button>
      //       <button onClick={() => handleAnswerChange('false')}>False</button>
      //     </div>
      //   );

      default:
        return <p>Unknown question type</p>;
    }
  };

  return (
    <div>
      <QuestionHeader question={question} />
      {renderQuestionContent()}

      {isCorrect !== null && (
        <div>
          {isCorrect ? (
            <p>Correct!</p>
          ) : (
            <p>Incorrect, the correct answer was: {question.Antwort}</p>
          )}
          <answerButton onClick={handleNextQuestion} />
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
