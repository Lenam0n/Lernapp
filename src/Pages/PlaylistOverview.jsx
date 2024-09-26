import React, { useState, useEffect } from "react";
import axios from "axios"; // Importiere axios für API-Aufrufe
import Swal from "sweetalert2";
import { useUser } from "../utils/UserProvider";
import { useApi } from "../utils/APIprovider";
import "./PlaylistOverview.css";

const PlaylistOverview = () => {
  const { removePlaylistFromUser, removeQuestionFromPlaylist } = useUser(); // Verwende den User Context
  const [groupedPlaylists, setGroupedPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl = useApi();

  // Funktion zum Abrufen aller Fragen mit Kategorien von der /playlists/all/categories Route
  const fetchPlaylistsWithCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${apiBaseUrl}/playlists/all/categories`
      );

      // Sortiere die Playlists nach playlistName alphabetisch
      const sortedPlaylists = response.data.sort((a, b) =>
        a.playlistName.localeCompare(b.playlistName)
      );

      setGroupedPlaylists(sortedPlaylists); // Setze die abgerufenen Playlists und Fragen
      setLoading(false);
    } catch (err) {
      console.error("Fehler beim Abrufen der Playlists:", err);
      setError("Fehler beim Abrufen der Playlists");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistsWithCategories(); // Hole die Playlists beim Laden der Komponente
  }, []);

  // Entfernen von Playlist
  const handleRemovePlaylist = async (playlistId, playlistName) => {
    try {
      await removePlaylistFromUser(playlistName, playlistId);
      Swal.fire("Erfolgreich", "Die Playlist wurde entfernt.", "success");
      fetchPlaylistsWithCategories(); // Lade die Playlists erneut nach dem Entfernen
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Fehler beim Entfernen der Playlist",
        text: error.message,
        confirmButtonText: "Ok",
      });
    }
  };

  // Entfernen einer Frage aus der Playlist
  const handleRemoveQuestion = async (playlistId, playlistName, questionId) => {
    try {
      await removeQuestionFromPlaylist(playlistId, playlistName, questionId);
      Swal.fire(
        "Erfolgreich",
        "Die Frage wurde erfolgreich aus der Playlist entfernt.",
        "success"
      );
      fetchPlaylistsWithCategories(); // Lade die Playlists erneut nach dem Entfernen der Frage
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Fehler beim Entfernen der Frage",
        text: error.message,
        confirmButtonText: "Ok",
      });
    }
  };

  if (loading) {
    return <p>Lade Playlists...</p>; // Ladeanzeige
  }

  if (error) {
    return <p>{error}</p>; // Fehleranzeige
  }

  return (
    <div className="playlist-overview-container">
      {groupedPlaylists.length > 0 ? (
        groupedPlaylists.map((playlist, playlistIndex) => (
          <div key={playlistIndex}>
            <div className="playlist-section">
              {/* Playlist Name als Hauptüberschrift */}
              <div className="playlist-title-button">
                <h1 className="playlist-title">{playlist.playlistName}</h1>
                {/* Button zum Entfernen der gesamten Playlist */}
                <button
                  className="remove-from-playlist"
                  onClick={() =>
                    handleRemovePlaylist(playlist._id, playlist.playlistName)
                  }
                >
                  Playlist entfernen
                </button>
              </div>

              {/* Kategorien der Playlist */}
              {Array.isArray(playlist.categories) &&
                playlist.categories.length > 0 &&
                playlist.categories[0].map((category, categoryIndex) => (
                  <div key={categoryIndex} className="category-section">
                    {/* Kategorie als Unterüberschrift */}
                    {category && category.category ? (
                      <h2 className="category-title">{category.category}</h2>
                    ) : (
                      <h2 className="category-title">Unbekannte Kategorie</h2>
                    )}

                    {/* Subkategorien in der Kategorie */}
                    {Array.isArray(category.subCategories) &&
                      category.subCategories.length > 0 &&
                      category.subCategories.map(
                        (subCategory, subCategoryIndex) => (
                          <div
                            key={subCategoryIndex}
                            className="subcategory-section"
                          >
                            <h3 className="subcategory-title">
                              {subCategory && subCategory.name
                                ? subCategory.name
                                : "Unbekannte Subkategorie"}
                            </h3>

                            {/* Fragen in der Subkategorie */}
                            {subCategory.questions ? (
                              Array.isArray(subCategory.questions) ? (
                                subCategory.questions.map(
                                  (question, qIndex) => (
                                    <div key={qIndex} className="question-row">
                                      <span className="question-text">
                                        {question && question.question
                                          ? question.question
                                          : "Keine Frage verfügbar"}
                                      </span>
                                      <button
                                        className="remove-question"
                                        onClick={() =>
                                          handleRemoveQuestion(
                                            playlist.Id,
                                            playlist.playlistName,
                                            question._id
                                          )
                                        }
                                      >
                                        Frage entfernen
                                      </button>
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="question-row">
                                  <span className="question-text">
                                    {subCategory.questions.question
                                      ? subCategory.questions.question
                                      : "Keine Frage verfügbar"}
                                  </span>
                                  <button
                                    className="remove-question"
                                    onClick={() =>
                                      handleRemoveQuestion(
                                        playlist.Id,
                                        playlist.playlistName,
                                        subCategory.questions._id
                                      )
                                    }
                                  >
                                    Frage entfernen
                                  </button>
                                </div>
                              )
                            ) : (
                              <p>Keine Fragen in dieser Subkategorie</p>
                            )}
                          </div>
                        )
                      )}
                  </div>
                ))}
            </div>
            {/* Füge nur ein <hr> hinzu, wenn es nicht die letzte Playlist ist */}
            {playlistIndex !== groupedPlaylists.length - 1 && (
              <hr className="playlist-spacer" />
            )}
          </div>
        ))
      ) : (
        <p>Es gibt keine benutzerdefinierten Playlists.</p>
      )}
    </div>
  );
};

export default PlaylistOverview;
