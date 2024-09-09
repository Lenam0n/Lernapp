import React, { useState, useEffect } from "react";
import "./AddQuestionTypePage.css";
import { useApi } from "../utils/APIprovider";

const AddQuestionTypePage = () => {
  const [questionTypes, setQuestionTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const apiBaseUrl = useApi();

  const fetchQuestionTypes = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/question-types`);
      const data = await response.json(); // "await" hinzufügen
      setQuestionTypes(data);
    } catch (error) {
      console.error("Error fetching question types:", error);
    }
  };

  useEffect(() => {
    if (apiBaseUrl) {
      console.log("API Base URL:", apiBaseUrl); // Hinzufügen
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
      const response = await fetch(`${apiBaseUrl}/question-types-add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuestionType),
      });

      if (response.ok) {
        setNewType("");
        setNewLabel("");
        alert("Fragetyp erfolgreich hinzugefügt");
        fetchQuestionTypes(); // Aktualisiere die Liste nach dem Hinzufügen
      } else {
        alert("Fehler beim Hinzufügen des Fragetypen");
      }
    } catch (error) {
      console.error("Error adding question type:", error);
    }
  };

  return (
    <div>
      <h1>Fragetyp hinzufügen</h1>
      <form onSubmit={handleAddType}>
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

        <button type="submit">Fragetyp hinzufügen</button>
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
          <p>Keine Fragetypen vorhanden.</p>
        )}
      </div>
    </div>
  );
};

export default AddQuestionTypePage;
