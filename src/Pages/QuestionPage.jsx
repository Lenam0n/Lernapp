import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../container/QuestionCard";
import { ReviewSection } from "../component/ReviewSection";
import Swal from "sweetalert2";
import "./QuestionPage.css";
import { useApi } from "../utils/APIprovider";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const QuestionPage = ({ category, subCategory, selectedList }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [multipleAnswer, setmultipleAnswer] = useState(null);
  const [singleAnswer, setsingleAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl = useApi();
  const navigate = useNavigate();

  // Fragen basierend auf Kategorie/SubKategorie oder benutzerdefinierter Liste abrufen
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        let response;

        if (selectedList) {
          // API-Aufruf für benutzerdefinierte Liste
          response = await fetch(`${apiBaseUrl}/custom-list/${selectedList}`);
        } else {
          // API-Aufruf für Kategorie und Subkategorie
          response = await fetch(
            `${apiBaseUrl}/questions?category=${category}&subCategory=${subCategory}`
          );
        }

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        if (data.length === 0) {
          alert("Keine Fragen verfügbar für diese Auswahl.");
          navigate("/categories");
          return;
        }

        setCurrentQuestion(0);
        setQuestions(shuffleArray(data));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, subCategory, selectedList, apiBaseUrl, navigate]);

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    setmultipleAnswer(null);
    setsingleAnswer("");
    setIsCorrect(null);
  };

  const handleCheckAnswer = () => {
    const question = questions[currentQuestion];
    let correct = false;

    switch (question.type) {
      case "multiple_choice":
      case "text_input":
      case "true_false":
        correct =
          singleAnswer.trim().toLowerCase() ===
          question.answer.trim().toLowerCase();
        break;
      case "multiselect":
        correct =
          Array.isArray(multipleAnswer) &&
          question.answer.every((answer) => multipleAnswer.includes(answer));
        break;
      case "multiple_graph_answers":
        correct = question.answer
          .filter(({ label }) =>
            multipleAnswer.some((entry) => entry[label] !== undefined)
          )
          .every(({ label, correct_answer }) => {
            const answerEntry = multipleAnswer.find(
              (entry) => entry[label] !== undefined
            );
            return answerEntry && answerEntry[label] === correct_answer;
          });
        break;
      default:
        break;
    }

    if (!correct) {
      setIncorrectAnswers((prev) => [...prev, question]);
    }
    setIsCorrect(correct);
    handleNotification(question.explanation, question.question);
  };

  const handleAnswerChange = (answer, label) => {
    if (typeof answer === "string") {
      setsingleAnswer(answer);
    } else {
      if (
        Array.isArray(multipleAnswer) &&
        multipleAnswer.every((item) => typeof item === "string")
      ) {
        setmultipleAnswer((prevAnswers) =>
          prevAnswers.includes(answer) ? prevAnswers : [...prevAnswers, answer]
        );
      } else {
        setmultipleAnswer((prevAnswers) => {
          const existingAnswerIndex = prevAnswers.findIndex(
            (entry) => entry[label] !== undefined
          );
          if (existingAnswerIndex >= 0) {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[existingAnswerIndex] = { [label]: answer };
            return updatedAnswers;
          } else {
            return [...prevAnswers, { [label]: answer }];
          }
        });
      }
    }
  };

  const handleNotification = (explanation, question) => {
    const htmlContent = `
      <h2>Frage:</h2>
      <h3>${question}</h3>
      <p>${explanation || "Keine Erklärung verfügbar"}</p>
    `;
    Swal.fire({
      title: "Erklärung",
      html: htmlContent,
      icon: "info",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Nächste Frage",
    }).then((result) => {
      if (result.isConfirmed) {
        handleNextQuestion();
      }
    });
  };

  if (loading) return <p className="loading-message">Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const question = questions[currentQuestion];

  return (
    <div className="question-page-container">
      <h1 className="question-page-title">Quiz App</h1>
      <div className="category-subcategory-container">
        <h2>
          {selectedList
            ? `Fragen aus Liste: ${selectedList}`
            : `Category: ${category}, SubCategory: ${subCategory}`}
        </h2>
      </div>
      {question && (
        <QuestionCard
          question={question.question}
          questionType={question.type}
          options={
            Array.isArray(question.options) && question.options.length > 0
              ? shuffleArray(question.options.concat(question.answer))
              : []
          }
          multipleAnswer={multipleAnswer}
          singleAnswer={singleAnswer}
          additionalData={question.additional_data}
          handleAnswerChange={handleAnswerChange}
          handleCheckAnswer={handleCheckAnswer}
          handleNextQuestion={handleNextQuestion}
          isCorrect={isCorrect}
        />
      )}
      {currentQuestion >= questions.length && (
        <ReviewSection incorrectAnswers={incorrectAnswers} />
      )}
    </div>
  );
};

export default QuestionPage;
