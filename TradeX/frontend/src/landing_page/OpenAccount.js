/**
 * ============================================================================
 * Open Account Call-to-Action Component (OpenAccount.js)
 * ============================================================================
 * Purpose:
 *   Reusable promotional CTA banner placed at the bottom of marketing pages
 *   encouraging users to sign up for a TradeX trading account.
 * ============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <div className="container p-5 mb-5">
      <div className="row text-center">
        <h1 className="mt-5">Open a TradeX account</h1>
        <p>
          Modern platforms and apps, Rs. 0 investments, and flat Rs. 20 intraday and F&amp;O trades.
        </p>
        <Link
          className="p-2 btn btn-primary fs-5 mb-5 signup-cta"
          style={{ width: "20%", margin: "0 auto" }}
          to="/signup"
        >
          Sign up now
        </Link>
      </div>
    </div>
  );
}

export default OpenAccount;
