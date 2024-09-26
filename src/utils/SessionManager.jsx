import React, { useState } from "react";
import { useUser } from "./UserProvider";
import { useApi } from "../utils/APIprovider";
import Swal from "sweetalert2";
import axios from "axios";

// Diese Komponente verwaltet den Zustand der Session
const SessionManager = ({ children }) => {
  const { user } = useUser();
  const apiBaseUrl = useApi();

  const [session, setSession] = useState({
    startTime: null, // Startzeit der Session
    endTime: null, // Endzeit der Session
    questions: [], // Fragen der Session
    correctAnswers: [], // Richtige Antworten
    incorrectAnswers: [], // Falsche Antworten
    totalQuestions: 0, // Gesamtanzahl der Fragen
    totalCorrectAnswers: 0, // Gesamtanzahl der richtigen Antworten
    totalIncorrectAnswers: 0, // Gesamtanzahl der falschen Antworten
    learningType: null, // Lernmodus (Kategorie, Subkategorie, Playlist, Relevanz)
  });

  // Funktion zum Starten einer neuen Session
  const startSession = (type, data) => {
    setSession({
      startTime: new Date(), // Setzt die Startzeit auf die aktuelle Zeit
      endTime: null, // Endzeit wird noch nicht gesetzt
      questions: [], // Leeres Fragen-Array zu Beginn
      correctAnswers: [], // Leere korrekte Antworten zu Beginn
      incorrectAnswers: [], // Leere falsche Antworten zu Beginn
      totalQuestions: 0, // Setzt die Anzahl der Fragen auf 0
      totalCorrectAnswers: 0, // Setzt die Anzahl der richtigen Antworten auf 0
      totalIncorrectAnswers: 0, // Setzt die Anzahl der falschen Antworten auf 0
      learningType: { type, data }, // Setzt den Lernmodus (z.B. Kategorie, Subkategorie, Playlist, Relevanz)
    });
  };

  // Funktion zum Hinzufügen einer Frage zu den korrekten Antworten
  const addQuestionToCorrectAnswers = (
    questionId,
    givenAnswer,
    correctAnswer
  ) => {
    const formattedGivenAnswer = Array.isArray(givenAnswer)
      ? givenAnswer
      : [givenAnswer];
    const formattedCorrectAnswer = Array.isArray(correctAnswer)
      ? correctAnswer
      : [correctAnswer];

    setSession((prevSession) => ({
      ...prevSession,
      totalQuestions: prevSession.totalQuestions + 1,
      totalCorrectAnswers: prevSession.totalCorrectAnswers + 1,
      correctAnswers: [
        ...prevSession.correctAnswers,
        {
          questionId: questionId,
          givenAnswer: formattedGivenAnswer,
          correctAnswer: formattedCorrectAnswer,
        },
      ],
      questions: [...prevSession.questions, questionId],
    }));
  };

  // Funktion zum Hinzufügen einer Frage zu den falschen Antworten
  const addQuestionToIncorrectAnswers = (
    questionId,
    givenAnswer,
    correctAnswer
  ) => {
    const formattedGivenAnswer = Array.isArray(givenAnswer)
      ? givenAnswer
      : [givenAnswer];
    const formattedCorrectAnswer = Array.isArray(correctAnswer)
      ? correctAnswer
      : [correctAnswer];

    setSession((prevSession) => ({
      ...prevSession,
      totalQuestions: prevSession.totalQuestions + 1,
      totalIncorrectAnswers: prevSession.totalIncorrectAnswers + 1,
      incorrectAnswers: [
        ...prevSession.incorrectAnswers,
        {
          questionId: questionId,
          givenAnswer: formattedGivenAnswer,
          correctAnswer: formattedCorrectAnswer,
        },
      ],
      questions: [...prevSession.questions, questionId],
    }));
  };

  // Funktion zum Beenden der Session
  const endSession = async () => {
    try {
      const updatedSession = {
        ...session,
        endTime: new Date(), // Setze die Endzeit auf die aktuelle Zeit
      };

      // Sende die Session-Daten ans Backend
      const response = await axios.post(
        `${apiBaseUrl}/session/add`,
        updatedSession
      );

      if (response.status === 201) {
        Swal.fire({
          title: "Session gespeichert",
          text: "Deine Session wurde erfolgreich gespeichert.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Fehler",
        text: "Es gab einen Fehler beim Speichern der Session. Bitte versuche es später erneut.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        startSession,
        addQuestionToCorrectAnswers,
        addQuestionToIncorrectAnswers,
        endSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

// Context zum Zugriff auf SessionManager
export const SessionContext = React.createContext();

export default SessionManager;
