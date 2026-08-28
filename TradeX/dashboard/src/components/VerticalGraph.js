/**
 * ============================================================================
 * Vertical Bar Chart Component (VerticalGraph.js)
 * ============================================================================
 * Purpose:
 *   Wraps Chart.js `Bar` component to render comparative vertical bar charts
 *   for equity holdings valuations.
 * ============================================================================
 */

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Holdings",
    },
  },
};

export function VerticalGraph({ data }) {
  return <Bar options={options} data={data} />;
}
