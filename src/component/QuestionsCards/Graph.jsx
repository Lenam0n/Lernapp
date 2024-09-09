import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
} from "chart.js";
import { evaluate, range } from "mathjs";

// Registriere die notwendigen Komponenten von Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title);

// Eine generische Komponente für verschiedene Funktionstypen
export const Graph = ({
  additionalData,
  correctAnswer,
  handleAnswerChange,
}) => {
  const [answer, setAnswer] = useState(correctAnswer || "");

  if (!additionalData) {
    return <p>Keine Funktionsdaten vorhanden</p>;
  }

  const parsedFunction = additionalData.split("=")[1] || "x^2"; // Parsen der Funktionsgleichung
  const functionType = detectFunctionType(parsedFunction); // Typ der Funktion ermitteln

  // X-Wertebereich definieren
  const xValues = range(-5, 5, 0.1).toArray();

  // Y-Werte berechnen
  const yValues = xValues.map((x) => {
    try {
      return evaluate(parsedFunction, { x });
    } catch (error) {
      console.error("Fehler beim Auswerten der Funktion", error);
      return 0;
    }
  });

  const data = {
    labels: xValues,
    datasets: [
      {
        label: `Graph von ${additionalData}`,
        data: yValues.map((y, index) => ({ x: xValues[index], y })),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
      y: {
        type: "linear",
        position: "left",
        ticks: {
          stepSize: 1, // Setzt die Schrittgröße der Y-Achse auf 1
          callback: function (value) {
            // Gibt sicher, dass alle Y-Achsen-Ticks angezeigt werden
            return Number.isInteger(value) ? value : "";
          },
        },
        // Setzt den minimalen und maximalen Wert der Y-Achse
        min: 0,
        // Die max-Einstellung kann auch hilfreich sein, um den Bereich zu bestimmen
        // Hier wird empfohlen, etwas höher zu gehen als der Maximalwert der Daten
        max: Math.max(10, Math.ceil(Math.max(...yValues))),
        // Optionale Einstellung, um zu verhindern, dass Chart.js die Werte aufrundet
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return value % 1 === 0 ? value : "";
          },
        },
      },
    },
  };

  const handleInputChange = (e) => {
    const newAnswer = e.target.value;
    setAnswer(newAnswer);
    handleAnswerChange(newAnswer);
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

// Funktion zur Bestimmung des Funktionstyps
const detectFunctionType = (functionString) => {
  if (functionString.includes("^")) {
    if (functionString.includes("^2")) return "quadratic";
    if (functionString.includes("^3")) return "cubic";
    return "polynomial";
  }
  if (
    functionString.includes("sin") ||
    functionString.includes("cos") ||
    functionString.includes("tan")
  ) {
    return "trigonometric";
  }
  if (functionString.includes("log")) {
    return "logarithmic";
  }
  if (functionString.includes("sqrt")) {
    return "root";
  }
  if (functionString.includes("/")) {
    return "rational";
  }
  if (functionString.includes("|")) {
    return "absolute";
  }
  if (functionString.includes("*") || functionString.includes("+")) {
    return "linear";
  }
  return "unknown";
};
