/**
 * ============================================================================
 * Home Pricing Snapshot Component (Pricing.js)
 * ============================================================================
 * Purpose:
 *   Summary pricing card showcase on the homepage highlighting Rs. 0 delivery
 *   and flat Rs. 20 intraday / F&O charges.
 * ============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <div className="container my-5">
      <div className="row align-items-center">
        {/* Value Proposition Description */}
        <div className="col-md-6">
          <h1 className="fw-bold">Unbeatable pricing</h1>
          <p>
            We pioneered the concept of discount broking and price transparency
            in India. Flat fees and no hidden charges.
          </p>
          <Link to="/pricing" className="text-decoration-none">
            See pricing <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </Link>
        </div>

        {/* Pricing Cards */}
        <div className="col-md-6">
          <div className="d-flex border rounded overflow-hidden">
            <div className="col p-4 text-center border-end">
              <h1 className="mb-3">Rs. 0</h1>
              <p>
                Free equity delivery and <br /> direct mutual funds
              </p>
            </div>

            <div className="col p-4 text-center">
              <h1 className="mb-3">Rs. 20</h1>
              <p>Intraday and F&amp;O</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
