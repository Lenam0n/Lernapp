import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registriere die Chart.js-Komponenten
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AnalysisGraph = ({ data, title }) => {
  // Konfiguriere die Optionen für den Graphen
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title || "Trend der richtigen und falschen Antworten",
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default AnalysisGraph;
