import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserProvider";
import { useApi } from "../utils/APIprovider";
import "./Account.css";
import Swal from "sweetalert2";
import TitleProvider from "../utils/TitleProvider";

const Account = ({ title }) => {
  const { user } = useUser();
  const apiBaseUrl = useApi();
  const navigate = useNavigate();

  const [accountData, setAccountData] = useState({
    createdAt: "2024-01-01", // Beispiel-Daten, sollten durch echte Daten ersetzt werden
    totalStudyTime: 0, // In Minuten oder Stunden
    totalQuizzes: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    completedCategories: 0,
    averageScore: 0,
  });

  // Funktion zum Generieren des Passwort-Hashes
  const handlePasswordChange = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/auth/generate-password-hash`
      );
      const { hash } = response.data;

      // Weiterleitung zur Passwort ändern Seite mit dem generierten Hash
      navigate(`/change-password/${hash}`);
    } catch (error) {
      Swal.fire("Fehler", "Fehler beim Erstellen des Passwort-Hashes", "error");
    }
  };

  // Funktion zum Generieren des Delete-Hashes und Weiterleitung zur Account-Löschen-Seite
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/auth/generate-delete-hash`
      );
      const { hash } = response.data;

      // Weiterleitung zur Account löschen Seite mit dem generierten Hash
      navigate(`/delete-account/${hash}`);
    } catch (error) {
      Swal.fire(
        "Fehler",
        "Fehler beim Erstellen des Lösch-Hashes. Bitte versuche es später erneut.",
        "error"
      );
    }
  };

  useEffect(() => {
    // API-Aufruf, um die Account-Daten zu holen
    const fetchAccountData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/stats/account-data`);
        setAccountData(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der Account-Daten", error);
      }
    };

    fetchAccountData();
  }, [apiBaseUrl]);

  return (
    <TitleProvider
      title={`${title} - ${user.name}`}
      description="Alle Fragen im Überblick"
    >
      <div className="account-container">
        <h1>Willkommen, {user?.name}</h1>

        <div className="account-info">
          <h2>Account Details</h2>
          <p>
            <strong>Account erstellt am:</strong>{" "}
            {new Date(accountData.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Gesamtzeit gelernt:</strong>{" "}
            {accountData.totalStudyTime.hours} Stunden {"\n"}
            {accountData.totalStudyTime.minutes} Minuten und{"\n"}
            {accountData.totalStudyTime.seconds} Sekunden
          </p>
          <p>
            <strong>Absolvierte Fragenblöcke:</strong>{" "}
            {accountData.totalQuizzes}
          </p>
          <p>
            <strong>Korrekte Antworten:</strong> {accountData.correctAnswers}
          </p>
          <p>
            <strong>Falsche Antworten:</strong> {accountData.incorrectAnswers}
          </p>
        </div>

        <div className="account-progress">
          <h2>Deine Fortschritte</h2>
          <p>
            <strong>Absolvierte Kategorien:</strong>{" "}
            {accountData.completedCategories}
          </p>
          <p>
            <strong>Durchschnittliche Punktzahl:</strong>{" "}
            {accountData.averageScore}%
          </p>
        </div>

        <div className="account-settings">
          <h2>Kontoeinstellungen</h2>
          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <button onClick={handlePasswordChange}>Passwort ändern</button>

            <button onClick={handleDeleteAccount}>Account löschen</button>
          </div>
        </div>
      </div>
    </TitleProvider>
  );
};

export default Account;
