import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./QuestionsOverview.css";
import { useApi } from "../utils/APIprovider";
import { useUser } from "../utils/UserProvider";

const QuestionsOverview = () => {
  const [groupedQuestions, setGroupedQuestions] = useState({});
  const [hasQuestions, setHasQuestions] = useState(false);
  const { user } = useUser(); // Verwende den User Context
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
  }, []);

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
                          <button className="edit-button">Edit</button>
                          <button className="delete-button">Delete</button>
                          <button className="view-button">View</button>
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
