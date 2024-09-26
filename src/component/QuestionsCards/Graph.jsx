import React from "react";
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
import "./Graph.css"; // Importiere die CSS-Datei

// Registriere die notwendigen Komponenten von Chart.js
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title);

// Eine generische Komponente für verschiedene Funktionstypen
export const Graph = ({ additionalData }) => {
  if (!additionalData) {
    return <p className="no-data-message">Keine Funktionsdaten vorhanden</p>;
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
        pointRadius: 5,
        pointBackgroundColor: "#007bff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        ticks: {
          callback: function (value) {
            return value;
          },
          color: "#555",
        },
        title: {
          display: true,
          text: "X-Achse",
          color: "#666",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        type: "linear",
        position: "left",
        ticks: {
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : "";
          },
          color: "#555",
        },
        title: {
          display: true,
          text: "Y-Achse",
          color: "#666",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        min: Math.min(0, Math.floor(Math.min(...yValues))),
        max: Math.max(10, Math.ceil(Math.max(...yValues))),
      },
    },
    plugins: {
      title: {
        display: true,
        text: `Funktionsgraph für ${functionType}`,
        color: "#333",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
  };

  return (
    <div className="graph-container">
      <h2 className="chart-title">Graphische Darstellung</h2>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

// Funktion zur Bestimmung des Funktionstyps
const detectFunctionType = (functionString) => {
  if (functionString.includes("^")) {
    if (functionString.includes("^2")) return "quadratisch";
    if (functionString.includes("^3")) return "kubisch";
    return "polynomisch";
  }
  if (
    functionString.includes("sin") ||
    functionString.includes("cos") ||
    functionString.includes("tan")
  ) {
    return "trigonometrisch";
  }
  if (functionString.includes("log")) {
    return "logarithmisch";
  }
  if (functionString.includes("sqrt")) {
    return "wurzelfunktion";
  }
  if (functionString.includes("/")) {
    return "rational";
  }
  if (functionString.includes("|")) {
    return "betragsfunktion";
  }
  if (functionString.includes("*") || functionString.includes("+")) {
    return "linear";
  }
  return "unbekannt";
};
