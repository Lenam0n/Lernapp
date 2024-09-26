import React, { useEffect, useState } from "react";
import { useUser } from "../utils/UserProvider";
import AnalysisGraph from "../component/AnalysisGraph"; // Verwende den Graphen
import axios from "axios";
import { useApi } from "../utils/APIprovider";
import "./Dashboard.css"; // Für professionelles Design

const Dashboard = () => {
  const { user } = useUser();
  const apiBaseUrl = useApi();

  // Zustand für die Graphen und Statistiken
  const [graphData, setGraphData] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicGraphData, setTopicGraphData] = useState(null);

  // Zustand für Lernzeit und Fragenstatistiken
  const [learningTime, setLearningTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  // Daten für den Trendgraphen zu prüfungsrelevanten Fragen laden
  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/stats/relevant`);
        const { correctAnswers, incorrectAnswers, labels } = response.data;

        const data = {
          labels,
          datasets: [
            {
              label: "Richtige Antworten",
              data: correctAnswers,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
              label: "Falsche Antworten",
              data: incorrectAnswers,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
          ],
        };

        setGraphData(data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Statistiken", error);
      }
    };

    const fetchLearningTime = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/stats/time`);
        const { totalLearningTime, sessionCount } = response.data;

        setLearningTime(totalLearningTime);
        setTotalQuestions(sessionCount);
      } catch (error) {
        console.error("Fehler beim Abrufen der Lernzeit", error);
      }
    };

    if (user) {
      fetchGraphData();
      fetchLearningTime();
    }
  }, [apiBaseUrl, user]);

  // Lade alle Kategorien, Subkategorien und Playlists des Benutzers
  useEffect(() => {
    if (user) {
      const categories = user.relevant_questions.map((q) => ({
        label: `${q.category} - ${q.subCategory}`,
        value: `${q.category}:${q.subCategory}`,
      }));

      const playlists = user.playlists.map((p) => ({
        label: `Playlist: ${p.name}`,
        value: `playlist:${p.name}`, // Nutze den Namen statt der ID
      }));

      setTopics([...categories, ...playlists]);
    }
  }, [user]);

  // Lade die Statistiken zu einem bestimmten Thema (Kategorie, Subkategorie oder Playlist)
  const handleTopicChange = async (event) => {
    const topic = event.target.value;
    setSelectedTopic(topic);

    try {
      let response;
      if (topic.startsWith("playlist:")) {
        const playlistName = topic.split(":")[1]; // Nehme den Namen der Playlist
        response = await axios.get(
          `${apiBaseUrl}/stats/playlist?playlist=${playlistName}` // Verwende den Namen für den API-Aufruf
        );
      } else {
        const [category, subCategory] = topic.split(":");
        response = await axios.get(
          `${apiBaseUrl}/stats/category?category=${category}&subCategory=${subCategory}` // Verwende Kategorie und Subkategorie als Namen
        );
      }

      const { correctAnswers, incorrectAnswers, labels } = response.data;

      if (correctAnswers.length === 0 && incorrectAnswers.length === 0) {
        setTopicGraphData(null); // Keine Daten vorhanden
      } else {
        const data = {
          labels,
          datasets: [
            {
              label: "Richtige Antworten",
              data: correctAnswers,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
              label: "Falsche Antworten",
              data: incorrectAnswers,
              borderColor: "rgb(255, 99, 132)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
          ],
        };
        setTopicGraphData(data);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Statistiken für das Thema", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Willkommen, {user?.name || "Gast"}!</h1>

      <div className="dashboard-statistics">
        <div className="stat-card">
          <h3>Gesamte Lernzeit</h3>
          <p>
            {learningTime.hours} Stunden {learningTime.minutes} Minuten{" "}
            {learningTime.seconds} Sekunden
          </p>
        </div>
        <div className="stat-card">
          <h3>Gesamtfragen</h3>
          <p>{totalQuestions}</p>
        </div>
        <div className="stat-card">
          <h3>Richtige Antworten</h3>
          <p>{correctAnswers}</p>
        </div>
        <div className="stat-card">
          <h3>Falsche Antworten</h3>
          <p>{incorrectAnswers}</p>
        </div>
      </div>

      <div className="graph-section">
        <h2>Statistiken für prüfungsrelevante Fragen</h2>
        {graphData ? (
          <AnalysisGraph data={graphData} title="Prüfungsrelevante Antworten" />
        ) : (
          <p>Laden der Daten...</p>
        )}
      </div>

      <div className="topic-selector">
        <h2>Statistiken nach Kategorie/Playlist</h2>
        <div className="custom-dropdown">
          <select value={selectedTopic} onChange={handleTopicChange}>
            <option value="">Wähle ein Thema</option>
            {topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
          <span className="custom-dropdown-arrow">▼</span>
        </div>

        {selectedTopic && (
          <div className="graph-section">
            <h3>Entwicklung zu: {selectedTopic}</h3>
            {topicGraphData ? (
              <AnalysisGraph
                data={topicGraphData}
                title={`Statistik zu ${selectedTopic}`}
              />
            ) : (
              <p>Keine Daten für dieses Thema vorhanden.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
