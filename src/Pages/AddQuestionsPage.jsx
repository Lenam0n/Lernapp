import React, { useState, useEffect } from "react";
import { useApi } from "../utils/APIprovider";
import "./AddQuestionPage.css";
import axios from "axios";

const AddQuestionPage = () => {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
  const [answer, setAnswer] = useState([]);
  const [additionalData, setAdditionalData] = useState("");
  const [questionTypes, setQuestionTypes] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [subQuestionCount, setSubQuestionCount] = useState(1);
  const [subQuestions, setSubQuestions] = useState([]);

  const apiBaseUrl = useApi();

  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/types`);
        const data = await response.data;
        setQuestionTypes(data);
      } catch (error) {
        console.error("Error fetching question types:", error);
      }
    };

    fetchQuestionTypes();
  }, [apiBaseUrl]);

  useEffect(() => {
    setOptions([]);
    setNewOption("");
    setAnswer([]);
    setAdditionalData("");
  }, [type]);

  const handleAddOption = () => {
    if (newOption.trim() === "") {
      alert("Option darf nicht leer sein.");
      return;
    }

    if (options.includes(newOption.trim())) {
      alert("Diese Option wurde bereits hinzugefügt.");
      return;
    }

    setOptions((prev) => [...prev, newOption.trim()]);
    setNewOption("");
  };

  const handleAddCorrectAnswer = (option) => {
    if (type === "multiple_choice") {
      if (answer.length > 0 && !answer.includes(option)) {
        alert("Du kannst nur eine korrekte Antwort auswählen.");
      } else if (answer.includes(option)) {
        setAnswer([]);
      } else {
        setAnswer([option]);
      }
    } else if (type === "multiselect") {
      if (answer.includes(option)) {
        setAnswer((prev) => prev.filter((ans) => ans !== option));
      } else {
        setAnswer((prev) => [...prev, option]);
      }
    }
  };

  const handleRemoveOption = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubQuestionChange = (index, field, value) => {
    const updatedSubQuestions = [...subQuestions];
    updatedSubQuestions[index][field] = value;
    setSubQuestions(updatedSubQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionData = {
      category,
      subCategory,
      question,
      type,
      options:
        type === "multiple_choice" || type === "multiple_answers"
          ? options
          : [],
      answer:
        Array.isArray(subQuestions) && subQuestions.length > 0
          ? subQuestions.map((sub) => ({
              label: sub.label,
              correct_answer: sub.correct_answer,
              explanation: sub.explanation,
            }))
          : answer || "",
      additional_data: additionalData !== "" ? additionalData : "",
    };

    try {
      const response = await axios.post(
        `${apiBaseUrl}/questions/add`,
        questionData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setMessage("Frage erfolgreich hinzugefügt");
        setError("");
        setCategory("");
        setSubCategory("");
        setQuestion("");
        setOptions([]);
        setAnswer([]);
        setAdditionalData("");
        setType("");
        setSubQuestionCount(1);
        setSubQuestions([]);
      } else {
        setMessage("Fehler beim Hinzufügen der Frage");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      setMessage("Server-Fehler. Versuche es später noch einmal.");
    }
  };

  const renderQuestionFields = () => {
    switch (type) {
      case "multiple_choice":
        return (
          <div className="multiple-choice-container">
            <label className="multiple-choice-label">
              Antwortmöglichkeiten:
            </label>
            <div className="multiple-choice-cards">
              {options.map((option, index) => (
                <div key={index} className="multiple-choice-card">
                  <div className="multiple-choice-option">{option}</div>
                  <button
                    type="button"
                    className="multiple-choice-remove-button"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Entfernen
                  </button>
                  <button
                    type="button"
                    className={`multiple-choice-correct-button ${
                      answer.includes(option) ? "correct" : "not-correct"
                    }`}
                    onClick={() => handleAddCorrectAnswer(option)}
                  >
                    {answer.includes(option)
                      ? "Nicht als korrekte Antwort"
                      : "Als korrekte Antwort hinzufügen"}
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              className="multiple-choice-new-option-input"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Neue Option hinzufügen"
            />
            <button
              type="button"
              className="multiple-choice-add-option-button"
              onClick={handleAddOption}
            >
              Option hinzufügen
            </button>
          </div>
        );
      case "multiselect":
        return (
          <div className="multiselect-container">
            <label className="multiselect-label">Antwortmöglichkeiten:</label>
            <div className="multiselect-cards">
              {options.map((option, index) => (
                <div key={index} className="multiselect-card">
                  <div className="multiselect-option">{option}</div>
                  <button
                    type="button"
                    className="multiselect-remove-button"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Entfernen
                  </button>
                  <button
                    type="button"
                    className={`multiselect-correct-button ${
                      answer.includes(option) ? "correct" : "not-correct"
                    }`}
                    onClick={() => handleAddCorrectAnswer(option)}
                  >
                    {answer.includes(option)
                      ? "Nicht als korrekte Antwort"
                      : "Als korrekte Antwort hinzufügen"}
                  </button>
                </div>
              ))}
            </div>
            <input
              type="text"
              className="multiselect-new-option-input"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="Neue Option hinzufügen"
            />
            <button
              type="button"
              className="multiselect-add-option-button"
              onClick={handleAddOption}
            >
              Option hinzufügen
            </button>
          </div>
        );
      case "multiple_graph_answers":
        return (
          <div>
            <div>
              <label>Gewollter Graph</label>
              <textarea
                value={additionalData}
                onChange={(e) => setAdditionalData(e.target.value)}
                placeholder="Funktion des Graphes"
                required
                className="graph-answer-input"
              />
            </div>
            <div>
              <label>Anzahl der Subfragen:</label>
              <input
                type="range"
                min="1"
                max="10"
                value={subQuestionCount}
                onChange={(e) => {
                  setSubQuestionCount(e.target.value);
                  setSubQuestions(
                    Array.from(
                      { length: e.target.value },
                      (_, i) =>
                        subQuestions[i] || {
                          label: "",
                          correct_answer: "",
                          explanation: "",
                        }
                    )
                  );
                }}
                className="subquestion-range-input"
              />
              <span>{subQuestionCount}</span>
            </div>
            <div className="subquestion-container">
              {subQuestions.map((sub, index) => (
                <div key={index}>
                  <h4>Subfrage {index + 1}</h4>
                  <label>Label:</label>
                  <input
                    type="text"
                    value={sub.label}
                    onChange={(e) =>
                      handleSubQuestionChange(index, "label", e.target.value)
                    }
                    placeholder="Label der Subfrage"
                    required
                  />
                  <label>Korrekte Antwort:</label>
                  <input
                    type="text"
                    value={sub.correct_answer}
                    onChange={(e) =>
                      handleSubQuestionChange(
                        index,
                        "correct_answer",
                        e.target.value
                      )
                    }
                    placeholder="Korrekte Antwort"
                    required
                  />
                  <label>Erklärung:</label>
                  <textarea
                    value={sub.explanation}
                    onChange={(e) =>
                      handleSubQuestionChange(
                        index,
                        "explanation",
                        e.target.value
                      )
                    }
                    placeholder="Erklärung"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "graph":
        return (
          <div>
            <label>Gleichung des Graphen:</label>
            <input
              type="text"
              value={additionalData}
              onChange={(e) => setAdditionalData(e.target.value)}
              placeholder="z.B. f(x) = sin(x)"
              required
              className="graph-equation-input"
            />
            <label>Erwartete Antwort:</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Erwartete Antwort"
              required
              className="graph-answer-input"
            />
          </div>
        );
      case "text_input":
        return (
          <div>
            <label>Erwartete Antwort:</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Erwartete Antwort"
              required
              className="text-answer-input"
            />
          </div>
        );
      case "true_false":
        return (
          <div>
            <label>Korrekte Antwort:</label>
            <select
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="true-false-select"
            >
              <option value="">Wahr/Falsch wählen</option>
              <option value="true">Wahr</option>
              <option value="false">Falsch</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="add-question-page-container">
      <h1 className="add-question-page-title">Frage hinzufügen</h1>
      {message && <p className="add-question-success-message">{message}</p>}
      {error && <p className="add-question-error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-question-form">
        <div>
          <label>Kategorie:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Kategorie"
            required
          />
        </div>
        <div>
          <label>Subkategorie:</label>
          <input
            type="text"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            placeholder="Subkategorie"
            required
          />
        </div>
        <div>
          <label>Frage:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Frage"
            required
          />
        </div>
        <div>
          <label>Fragetyp:</label>
          <select
            required
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setError("");
            }}
          >
            <option value="">Fragetyp wählen</option>
            {questionTypes.map((qt) => (
              <option key={qt.type} value={qt.type}>
                {qt.label === "" ? qt.type : qt.label}
              </option>
            ))}
          </select>
        </div>

        {renderQuestionFields()}

        <button type="submit" className="add-question-submit-button">
          Frage hinzufügen
        </button>
      </form>
    </div>
  );
};

export default AddQuestionPage;
