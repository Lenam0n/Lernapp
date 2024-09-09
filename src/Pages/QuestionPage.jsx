// QuestionPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../container/QuestionCard";
import { ReviewSection } from "../component/ReviewSection";

import { useApi } from "../utils/APIprovider";
import { corr } from "mathjs";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const QuestionPage = ({ category, subCategory }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [multipleAnswer, setmultipleAnswer] = useState(null);
  const [singleAnswer, setsingleAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl = useApi();
  const navigate = useNavigate(); // Hook für Navigation

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${apiBaseUrl}/questions?category=${category}&subCategory=${subCategory}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        if (
          !data.some((category) =>
            category.subCategories.some(
              (subCategory) => subCategory.questions.length > 0
            )
          )
        ) {
          alert("Keine Fragen verfügbar für diese Kategorie/Unterkategorie.");
          navigate("/categories");
          return;
        } else {
          setCurrentQuestion(0);
          // Extrahiere alle Fragen aus der API-Antwort (data)
          const allQuestions = data
            .flatMap((category) => category.subCategories) // Alle Subkategorien extrahieren
            .flatMap((subCategory) => subCategory.questions); // Alle Fragen aus den Subkategorien extrahieren

          setQuestions(shuffleArray(allQuestions));
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [category, subCategory, apiBaseUrl, navigate]);

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
        correct =
          singleAnswer.trim().toLowerCase() ===
          question.answer.trim().toLowerCase();
        if (!correct) {
          setIncorrectAnswers((prev) => [...prev, question]);
        } else {
          setIsCorrect(correct);
        }

        break;

      case "text_input":
        correct =
          singleAnswer.trim().toLowerCase() ===
          question.answer.trim().toLowerCase();
        if (!correct) {
          setIncorrectAnswers((prev) => [...prev, question]);
        } else {
          setIsCorrect(correct);
        }
        break;

      case "true_false":
        correct =
          singleAnswer.trim().toLowerCase() ===
          question.answer.trim().toLowerCase();
        if (!correct) {
          setIncorrectAnswers((prev) => [...prev, question]);
        } else {
          setIsCorrect(correct);
        }
        break;

      case "multiselect":
        correct =
          Array.isArray(multipleAnswer) &&
          multipleAnswer.every((item) => typeof item === "string") &&
          question.answer.every((answer) => multipleAnswer.includes(answer));
        if (!correct) {
          setIncorrectAnswers((prev) => [...prev, question]);
        } else {
          setIsCorrect(correct);
        }
        break;

      case "graph":
        correct =
          singleAnswer.trim().toLowerCase() ===
          question.answer.trim().toLowerCase();
        if (!correct) {
          setIncorrectAnswers((prev) => [...prev, question]);
        } else {
          setIsCorrect(correct);
        }
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
        if (!correct) {
          setIncorrectAnswers((prev) => [...prev, question]);
        } else {
          setIsCorrect(correct);
        }
        break;

      default:
        return;
    }
    handleNextQuestion();
  };

  const handleAnswerChange = (answer, label) => {
    if (typeof answer === "string") {
      // Bei singleAnswer bereits behandelt
      setsingleAnswer(answer);
    } else {
      // Prüfen, ob multipleAnswer ein Array von Strings ist
      if (
        Array.isArray(multipleAnswer) &&
        multipleAnswer.every((item) => typeof item === "string")
      ) {
        // Falls es ein Array von Strings ist, füge das neue String-Element hinzu
        setmultipleAnswer((prevAnswers) => {
          // Füge den neuen Wert nur hinzu, wenn er noch nicht vorhanden ist
          if (!prevAnswers.includes(answer)) {
            return [...prevAnswers, answer];
          }
          return prevAnswers; // Keine Änderung, wenn der Wert bereits existiert
        });
      } else {
        // Für multipleAnswer: Füge neuen Eintrag hinzu oder aktualisiere bestehenden
        setmultipleAnswer((prevAnswers) => {
          // Überprüfen, ob bereits ein Objekt mit diesem Label existiert
          const existingAnswerIndex = prevAnswers.findIndex(
            (entry) => entry[label] !== undefined
          );

          if (existingAnswerIndex >= 0) {
            // Existierendes Objekt aktualisieren
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[existingAnswerIndex] = { [label]: answer };
            return updatedAnswers;
          } else {
            // Neues Objekt hinzufügen
            return [...prevAnswers, { [label]: answer }];
          }
        });
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const question = questions[currentQuestion];

  return (
    <div>
      <h1>Quiz App</h1>
      <div>
        <h2>{`Category: ${category}, SubCategory: ${subCategory}`}</h2>
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
          answerLabel={
            Array.isArray(question.answers) && question.answers.length > 0
              ? question.answers.map((answer) => answer.label)
              : []
          }
        />
      )}
      {currentQuestion >= questions.length && (
        <ReviewSection incorrectAnswers={incorrectAnswers} />
      )}
    </div>
  );
};

export default QuestionPage;
