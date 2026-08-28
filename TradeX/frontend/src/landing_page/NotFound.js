/**
 * ============================================================================
 * 404 Page Not Found Component (NotFound.js)
 * ============================================================================
 * Purpose:
 *   Fallback route handler when the user navigates to an invalid URL path.
 *   Provides a clear error notice and a button linking back to the Homepage.
 * ============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5">404 Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
        <Link
          className="p-2 btn btn-primary fs-5 mb-5 signup-cta"
          style={{ width: "20%", margin: "0 auto" }}
          to="/"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
