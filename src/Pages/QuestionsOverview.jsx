import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./QuestionsOverview.css";
import { useApi } from "../utils/APIprovider";
import { useUser } from "../utils/UserProvider";

const QuestionsOverview = () => {
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [hasQuestions, setHasQuestions] = useState(false);
  const [availablePlaylists, setAvailablePlaylists] = useState([]);
  const { user, updateUser, addQuestionToPlaylist, addPlaylistToUser } =
    useUser(); // Verwende den User Context, um updateUser zu bekommen
  const apiBaseUrl = useApi();
  // Fragen aus dem Backend abrufen
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/questions/overview`);
      if (response.data.length === 0) {
        setHasQuestions(false);
      } else {
        const grouped = groupQuestionsByCategory(response.data);
        setGroupedQuestions(grouped);
        setHasQuestions(true);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Fragen:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [user]); // Der User muss überwacht werden, um den Zustand richtig zu laden

  // Gruppiere Fragen nach Kategorie und Subkategorie
  const groupQuestionsByCategory = (questions) => {
    const grouped = {};
    questions.forEach((question) => {
      const { category, subCategory } = question;
      if (!grouped[category]) {
        grouped[category] = {};
      }
      if (!grouped[category][subCategory]) {
        grouped[category][subCategory] = [];
      }
      grouped[category][subCategory].push(question);
    });
    return grouped;
  };

  // Toggle für Prüfungsrelevanz
  const toggleRelevant = async (questionId) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/relevant/toggle`, {
        userId: user.userId, // Verwende die userId aus dem User Provider
        questionId, // Sende die Frage-ID korrekt
      });

      if (response.status === 200) {
        // Aktualisiere den Benutzerzustand lokal für die angeklickte Frage
        updateUser(questionId); // Rufe updateUser mit der spezifischen Frage-ID auf
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Hinzufügen zu Prüfungsrelevant fehlgeschlagen",
        text: error,
        confirmButtonText: "Ok",
      });
      console.error("Fehler beim Umschalten der Prüfungsrelevanz:", error);
    }
  };
  // useEffect, um die verfügbaren Playlisten zu filtern, wenn sich die Playlisten ändern und user geladen ist
  useEffect(() => {
    if (user && user.playlists) {
      const filteredPlaylists = user.playlists.filter((playlist) =>
        Array.isArray(playlist.question_ids)
      );
      setAvailablePlaylists(filteredPlaylists);
    }
  }, [user]); // Abhängigkeit nur von `user`

  const addToPlaylist = async (questionId) => {
    if (availablePlaylists.length === 0) {
      const result = await Swal.fire({
        title: "Keine Playlisten verfügbar",
        text: "Du kannst die Frage zu keiner deiner aktuellen Listen hinzufügen. Möchtest du eine neue Playlist erstellen?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Neue Playlist erstellen",
        cancelButtonText: "Abbrechen",
      });

      if (result.isConfirmed) {
        const { value: newPlaylistName } = await Swal.fire({
          title: "Neue Playlist erstellen",
          input: "text",
          inputLabel: "Playlist-Name",
          inputPlaceholder: "Gib den Namen der neuen Playlist ein",
          showCancelButton: true,
          confirmButtonText: "Erstellen",
          cancelButtonText: "Abbrechen",
          inputValidator: (value) => {
            if (!value) {
              return "Bitte gib einen Namen für die Playlist ein!";
            }
          },
        });

        if (newPlaylistName) {
          try {
            // Playlist zu den Benutzerdaten hinzufügen
            await addPlaylistToUser(newPlaylistName);

            // Neue Playlists in die Liste einfügen
            const newPlaylistResponse = await axios.get(
              `${apiBaseUrl}/playlists`
            );
            setAvailablePlaylists(newPlaylistResponse.data);

            Swal.fire(
              "Erstellt!",
              `Die Playlist "${newPlaylistName}" wurde erstellt.`,
              "success"
            );
          } catch (error) {
            Swal.fire(
              "Fehler!",
              "Die Playlist konnte nicht erstellt werden.",
              "error"
            );
            return;
          }
        }
      } else {
        return; // Benutzer hat Abbrechen geklickt
      }
    }

    // Wenn Playlisten verfügbar sind, Dropdown-Menü erstellen
    const options = availablePlaylists.map(
      (playlist) => `<option value="${playlist.name}">${playlist.name}</option>`
    );

    const { value: selectedPlaylistName } = await Swal.fire({
      title: "Zu Playlist hinzufügen",
      html: `
    <select id="playlistSelect" class="swal2-input">
      <option value="" disabled selected>Wähle eine Playlist</option>
      ${options.join("")}
    </select>
    <button id="newPlaylistButton" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Neue Playlist erstellen</button>
  `,
      showCancelButton: true,
      confirmButtonText: "Hinzufügen",
      cancelButtonText: "Abbrechen",
      didRender: () => {
        // Funktion für den neuen Playlist-Button
        document
          .getElementById("newPlaylistButton")
          .addEventListener("click", async () => {
            const { value: newPlaylistName } = await Swal.fire({
              title: "Neue Playlist erstellen",
              input: "text",
              inputLabel: "Playlist-Name",
              inputPlaceholder: "Gib den Namen der neuen Playlist ein",
              showCancelButton: true,
              confirmButtonText: "Erstellen",
              cancelButtonText: "Abbrechen",
              inputValidator: (value) => {
                if (!value) {
                  return "Bitte gib einen Namen für die Playlist ein!";
                }
              },
            });

            if (newPlaylistName) {
              try {
                await addPlaylistToUser(newPlaylistName);

                Swal.fire(
                  "Erstellt!",
                  `Die Playlist "${newPlaylistName}" wurde erstellt.`,
                  "success"
                );
              } catch (error) {
                console.error("Fehler bei der Playlisten-Erstellung:", error);
                Swal.fire(
                  "Fehler!",
                  "Die Playlist konnte nicht erstellt werden.",
                  "error"
                );
              }
            }
          });
      },
      preConfirm: () => {
        const selectedValue = document.getElementById("playlistSelect").value;
        if (!selectedValue) {
          Swal.showValidationMessage(
            "Bitte wähle eine Playlist aus oder erstelle eine neue"
          );
        }
        return selectedValue; // Hier wird der Name der Playlist zurückgegeben
      },
    });

    if (selectedPlaylistName) {
      try {
        // Füge die Frage zur ausgewählten Playlist hinzu
        await addQuestionToPlaylist(selectedPlaylistName, questionId);

        Swal.fire(
          "Erfolgreich",
          `Die Frage wurde zur Playlist hinzugefügt`,
          "success"
        );
      } catch (error) {
        // Prüfen, ob eine Antwort vorhanden ist (HTTP-Fehler)
        if (error.response && error.response.status === 405) {
          Swal.fire("Fehler", "Die Frage ist schon in der Playliste", "error");
        } else {
          Swal.fire(
            "Fehler",
            "Die Frage konnte nicht zur Playlist hinzugefügt werden",
            "error"
          );
        }
      }
    }
  };

  // Verarbeitung und Anzeige der Fragen
  return (
    <div className="questions-overview-container">
      {!hasQuestions ? (
        <p>Es gibt keine Fragen.</p>
      ) : (
        Object.keys(groupedQuestions).map((category, index) => (
          <div key={index} className="category-section">
            <h2 className="category-title">{category}</h2>
            {Object.keys(groupedQuestions[category]).map(
              (subCategory, subIndex) => (
                <div key={subIndex} className="subcategory-section">
                  <h3 className="subcategory-title">{subCategory}</h3>
                  {groupedQuestions[category][subCategory].map(
                    (question, qIndex) => (
                      <div key={qIndex} className="question-row">
                        <span className="question-text">
                          {question.question}
                        </span>
                        <div className="button-group">
                          <button
                            className={
                              user.relevant_questions?.includes(
                                question.questionId
                              )
                                ? "relevant"
                                : "not-relevant"
                            }
                            onClick={() => toggleRelevant(question.questionId)}
                          >
                            {user.relevant_questions?.includes(
                              question.questionId
                            )
                              ? "Als nicht relevant markieren"
                              : "Als relevant markieren"}
                          </button>
                          {/* Button zum Hinzufügen zur Playlist */}
                          <button
                            className="add-to-playlist"
                            onClick={() => addToPlaylist(question.questionId)}
                          >
                            Zur Playlist hinzufügen
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionsOverview;
