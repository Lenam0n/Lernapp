import React, { useState, useEffect } from "react";
import "./AddQuestionTypePage.css";
import { useApi } from "../utils/APIprovider";
import axios from "axios";

const AddQuestionTypePage = () => {
  const [questionTypes, setQuestionTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const apiBaseUrl = useApi();

  const fetchQuestionTypes = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/types`);
      const data = await response.data;
      setQuestionTypes(data);
    } catch (error) {
      console.error("Error fetching question types:", error);
    }
  };

  useEffect(() => {
    if (apiBaseUrl) {
      fetchQuestionTypes();
    }
  }, [apiBaseUrl]);

  const handleAddType = async (e) => {
    e.preventDefault();

    const newQuestionType = {
      type: newType,
      label: newLabel,
    };

    try {
      const response = await axios.post(
        `${apiBaseUrl}/types/add`,
        newQuestionType,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setNewType("");
        setNewLabel("");
        alert("Fragetyp erfolgreich hinzugefügt");
        fetchQuestionTypes();
      } else {
        alert("Fehler beim Hinzufügen des Fragetypen");
      }
    } catch (error) {
      console.error("Error adding question type:", error);
    }
  };

  return (
    <div className="add-question-type-page-container">
      <h1 className="add-question-type-page-title">Fragetyp hinzufügen</h1>
      <form onSubmit={handleAddType} className="add-question-type-form">
        <div>
          <label>Fragetyp:</label>
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="Fragetyp (z.B. multiple_choice)"
            required
          />
        </div>
        <div>
          <label>Label:</label>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Label (z.B. Multiple Choice)"
            required
          />
        </div>

        <button type="submit" className="add-question-type-submit-button">
          Fragetyp hinzufügen
        </button>
      </form>

      <h2>Vorhandene Fragetypen</h2>
      <div className="card-list-container">
        {questionTypes.length > 0 ? (
          questionTypes.map((type) => (
            <div key={type.type} className="card-item">
              <div className="card-type-text">{type.type}</div>
              <div className="card-label-text">{type.label}</div>
            </div>
          ))
        ) : (
          <p className="empty-message">Keine Fragetypen vorhanden.</p>
        )}
      </div>
    </div>
  );
};

export default AddQuestionTypePage;
