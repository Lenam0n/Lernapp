import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Verwende useParams, um den listName-Parameter zu extrahieren
import QuestionCard from "../container/QuestionCard";
import { ReviewSection } from "../component/ReviewSection";
import Swal from "sweetalert2";
import "./QuestionPage.css";
import { useApi } from "../utils/APIprovider";
import { SessionContext } from "../utils/SessionManager";
import TitleProvider from "../utils/TitleProvider";
import axios from "axios";

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const QuestionPage = ({ title }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [multipleAnswer, setmultipleAnswer] = useState(null);
  const [singleAnswer, setsingleAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category, subCategory, listName } = useParams(); // Verwende useParams, um den listName aus der URL zu holen
  const apiBaseUrl = useApi();
  const navigate = useNavigate();
  const {
    addQuestionToIncorrectAnswers,
    addQuestionToCorrectAnswers,
    startSession,
  } = useContext(SessionContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        let response;
        let learningType;

        if (listName) {
          // API-Aufruf für benutzerdefinierte Liste basierend auf listName
          response = await axios.get(`${apiBaseUrl}/playlists/${listName}`);
          learningType = { type: "playlist", data: listName }; // Lernmodus: Playlist
        } else if (category && subCategory) {
          // API-Aufruf für Kategorie und Subkategorie
          response = await axios.get(
            `${apiBaseUrl}/questions?category=${category}&subCategory=${subCategory}`
          );
          learningType = {
            type: "category",
            data: `${category} - ${subCategory}`,
          }; // Lernmodus: Kategorie und Subkategorie
        } else if (window.location.pathname === "/questions/relevant") {
          // API-Aufruf für relevante Fragen
          response = await axios.get(`${apiBaseUrl}/questions/relevant`);
          learningType = { type: "relevant", data: "true" }; // Lernmodus: Relevanz
        } else {
          Swal.fire({
            title: "Ungültiger Pfad oder Auswahl",
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Go Back to Questions",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/questions-overview");
            }
          });
          throw new Error("Ungültiger Pfad oder Auswahl");
        }

        // Fehlerbehandlung für API-Aufruf
        if (!response || response.status !== 200) {
          throw new Error("Network response was not ok");
        }

        const data = await response.data;

        if (data.length === 0) {
          Swal.fire({
            title: "Es gibt keine Fragen für die Kategorie",
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Go Back to Questions",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/categories");
            }
          });
          return;
        }

        // Kategorien und Subkategorien für jede Frage setzen
        for (let index = 0; index < data.length; index++) {
          const e = data[index];

          for (let o = 0; o < e.subCategories.length; o++) {
            const sub = e.subCategories[o];

            for (let j = 0; j < sub.questions.length; j++) {
              const element = sub.questions[j];
              element.category = e.category;
              element.subCategory = sub.name;
            }
          }
        }

        // Mische die Fragen und setze sie in den State
        const allQuestions = data.flatMap((obj) =>
          obj.subCategories.flatMap((sub) => sub.questions)
        );
        setCurrentQuestion(0);
        setQuestions(shuffleArray(allQuestions));
        setLoading(false);

        // Session starten und Lernmodus setzen
        startSession(learningType.type, learningType.data); // Startet die Session und setzt den Lernmodus
      } catch (error) {
        console.log(error);
        if (
          error.response.status === 404 ||
          error.response.message === "Keine Fragen in dieser Playlist gefunden"
        ) {
          Swal.fire({
            title: "Es gibt keine Fragen in der Playlist",
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Go Back to Questions",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/categories");
            }
            setError(error.message);
            setLoading(false);
          });
        }
      }
    };

    fetchQuestions();
  }, [category, subCategory, listName, apiBaseUrl, navigate]);

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
      addQuestionToIncorrectAnswers(
        question._id,
        singleAnswer || multipleAnswer,
        question.answer
      );
      handleNotification(
        question.explanation,
        question.question,
        false,
        question.answer
      );
    } else {
      handleNotification(
        question.explanation,
        question.question,
        true,
        question.answer
      );
      setIsCorrect(correct);
      addQuestionToCorrectAnswers(
        question._id,
        singleAnswer || multipleAnswer,
        question.answer
      );
    }
    document
      .querySelector(".answer-options-container")
      ?.querySelectorAll("input, textarea")
      .forEach((input) => (input.value = ""));
  };

  // Diese Funktion sorgt dafür, dass die Antwortänderungen korrekt verarbeitet werden
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

  const handleNotification = (
    explanation,
    question,
    correct,
    correct_answer
  ) => {
    const htmlContent = `
      <h2>Frage:</h2>
      <h3>${question}</h3>
      <h3>Richtige Antwort ist:<h3>
      <p>${correct_answer}<p>
      <hr/>
      <p>${explanation || "Keine Erklärung verfügbar"}</p>
    `;
    let icon = "";
    if (correct) {
      icon = "success";
    } else {
      icon = "error";
    }
    Swal.fire({
      title: "Erklärung",
      html: htmlContent,
      icon: icon,
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

  // Dynamische Titel-Logik basierend auf dem Modus
  const getTitle = () => {
    if (listName) {
      return `Fragen aus Liste: ${listName} - Meine Website`;
    } else if (category && subCategory) {
      return `Fragen zu ${category} - ${subCategory} - Meine Website`;
    } else if (window.location.pathname === "/questions/relevant") {
      return `Relevante Fragen - Meine Website`;
    }
    return "Fragen - Meine Website"; // Fallback-Titel
  };

  const getDescription = () => {
    if (listName) {
      return `Hier sind alle Fragen aus der Liste: ${listName} - ${title}`;
    } else if (category && subCategory) {
      return `Hier sind alle Fragen zu ${subCategory} aus ${category} - ${title}`;
    } else if (window.location.pathname === "/questions/relevant") {
      return `Hier sind alle Prüfungsrelevanten Fragen - ${title}`;
    }
    return `Fragen - ${title} `; // Fallback-Beschreibung
  };

  return (
    <TitleProvider title={getTitle()} description={getDescription()}>
      <div className="question-page-container">
        <h1 className="question-page-title">Quiz App</h1>
        <div className="category-subcategory-container">
          {question !== undefined && (
            <h2>
              {listName
                ? `Fragen aus Liste: ${listName}`
                : `Category: ${question.category}, SubCategory: ${question.subCategory}`}
            </h2>
          )}
        </div>
        {question !== undefined && (
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
            handleAnswerChange={handleAnswerChange} // Hier verwenden wir die handleAnswerChange Funktion
            handleCheckAnswer={handleCheckAnswer}
            handleNextQuestion={handleNextQuestion}
            isCorrect={isCorrect}
          />
        )}
        {currentQuestion >= questions.length && (
          <ReviewSection incorrectAnswers={incorrectAnswers} />
        )}
      </div>
    </TitleProvider>
  );
};

export default QuestionPage;
