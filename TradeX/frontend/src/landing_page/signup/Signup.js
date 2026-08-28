/**
 * ============================================================================
 * Demo Account Onboarding & Signup Component (Signup.js)
 * ============================================================================
 * Purpose:
 *   Handles client account registration flow for the TradeX demo.
 *   - Captures User Full Name, Email, and Phone Number.
 *   - On form submission, displays confirmation feedback and automatically
 *     redirects the user to the interactive Trading Dashboard (http://localhost:3001).
 * ============================================================================
 */

import React, { useState } from "react";

// Dashboard target redirect URL (default: http://localhost:3001)
const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL || "http://localhost:3001";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [message, setMessage] = useState("");

  /**
   * Form field change handler
   */
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  /**
   * Form submit handler: confirms creation and redirects to Trading Dashboard
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Account created for demo. Opening TradeX dashboard...");

    // Smooth redirect transition to dashboard
    window.setTimeout(() => {
      window.location.href = dashboardUrl;
    }, 700);
  };

  return (
    <div className="container my-5">
      <div className="row align-items-center">
        {/* Signup Illustration */}
        <div className="col-md-6 text-center">
          <img src="/media/images/signup.png" alt="Signup" className="img-fluid" />
        </div>

        {/* Registration Form */}
        <div className="col-md-6">
          <h1>Open a free demat and trading account online</h1>
          <p className="text-muted">
            Start your investment journey with a simple demo signup flow.
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              name="name"
              onChange={handleChange}
              placeholder="Full name"
              required
              value={formData.name}
            />
            <input
              className="form-control mb-3"
              name="email"
              onChange={handleChange}
              placeholder="Email address"
              required
              type="email"
              value={formData.email}
            />
            <input
              className="form-control mb-3"
              name="phone"
              onChange={handleChange}
              placeholder="Mobile number"
              required
              value={formData.phone}
            />
            <button className="btn btn-primary fs-5 px-4" type="submit">
              Continue
            </button>
          </form>

          {/* Feedback Message */}
          {message && <p className="text-success mt-3">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default Signup;
