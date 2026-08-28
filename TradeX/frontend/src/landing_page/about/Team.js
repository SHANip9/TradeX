/**
 * ============================================================================
 * About Page — Creator Profile Section (Team.js)
 * ============================================================================
 * Purpose:
 *   Profiles the creator of TradeX — Souradeep Ghosh.
 *   - Displays a formal photo, name, designation, and a short bio.
 *   - Includes social/connect links for GitHub, LinkedIn, and Twitter.
 * ============================================================================
 */

import React from "react";

function Team() {
  return (
    <div
      className="row p-5 mt-5 text-muted"
      style={{ lineHeight: "1.8", fontSize: "1.2em" }}
    >
      {/* Creator Avatar & Title */}
      <div className="col-6 p-5 text-center">
        <img
          src="media/images/Souradeep Ghosh Formal Photo.jpg"
          alt="Souradeep Ghosh"
          className="rounded-circle"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
        <h5 className="mt-3 mb-1 fw-bold">Souradeep Ghosh</h5>
        <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
          B.Tech Student &bull; Creator of TradeX
        </p>
      </div>

      {/* Creator Bio & Social Links */}
      <div className="col-6 p-5">
        <p>
          Souradeep conceptualized and built TradeX as a full-stack stock
          exchange simulation platform to demonstrate real-world trading
          workflows — from live watchlists and portfolio analytics to order
          management and fund tracking.
        </p>
        <p>
          As a B.Tech student passionate about fintech and web development,
          he designed TradeX to bridge the gap between textbook knowledge and
          hands-on market experience, making it accessible for learners and
          enthusiasts alike.
        </p>
        <p>
          The project showcases proficiency in React, Node.js, MongoDB, and
          real-time data handling — built entirely from the ground up.
        </p>
        <p>
          Connect on{" "}
          <a href="https://github.com/" className="text-primary fw-semibold">
            GitHub
          </a>{" "}
          /{" "}
          <a href="https://linkedin.com/" className="text-primary fw-semibold">
            LinkedIn
          </a>{" "}
          /{" "}
          <a href="https://twitter.com/" className="text-primary fw-semibold">
            Twitter
          </a>
        </p>
      </div>
    </div>
  );
}

export default Team;
