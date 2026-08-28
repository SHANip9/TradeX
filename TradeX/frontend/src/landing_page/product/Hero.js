/**
 * ============================================================================
 * Products Page Hero Header (Hero.js)
 * ============================================================================
 * Purpose:
 *   Introduction header on the Technology & Products page.
 * ============================================================================
 */

import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="text-center mt-5 p-3">
        <h1>Technology</h1>
        <h3 className="text-muted mt-3 fs-4">
          Sleek, modern and intuitive trading platforms
        </h3>
        <p className="mt-3">
          Check out our{" "}
          <a href="#offerings" className="text-decoration-none">
            investment offerings <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </p>
      </div>
    </div>
  );
}

export default Hero;
