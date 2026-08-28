/**
 * ============================================================================
 * Dashboard API Client Instance (api.js)
 * ============================================================================
 * Purpose:
 *   Configures and exports a centralized Axios instance configured with the
 *   backend base URL (configured via `REACT_APP_API_URL` or defaulting to http://localhost:3002).
 * ============================================================================
 */

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3002",
});

export default api;
