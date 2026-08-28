/**
 * ============================================================================
 * Doughnut Chart Component (DoughnoutChart.js)
 * ============================================================================
 * Purpose:
 *   Wraps Chart.js `Doughnut` component to render portfolio asset distributions.
 * ============================================================================
 */

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Register necessary Chart.js modules
ChartJS.register(ArcElement, Tooltip, Legend);

export function DoughnutChart({ data }) {
  return <Doughnut data={data} />;
}
