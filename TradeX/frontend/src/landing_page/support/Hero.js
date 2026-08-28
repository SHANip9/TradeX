/**
 * ============================================================================
 * Support Portal Hero & Search Section (Hero.js)
 * ============================================================================
 * Purpose:
 *   Search banner allowing users to search support articles, track open tickets,
 *   check segment activations, and view featured regulatory bulletins.
 * ============================================================================
 */

import React from "react";

function Hero() {
  return (
    <section className="container-fluid" id="supportHero">
      {/* Top Banner Navigation */}
      <div className="p-3" id="supportWrapper">
        <h4>Support Portal</h4>
        <a href="#tickets">Track Tickets</a>
      </div>

      <div className="row p-3 m-5">
        {/* Search Query Input & Quick Links */}
        <div className="col-md-6 p-5">
          <h1>Search for an answer or browse help topics to create a ticket</h1>
          <input placeholder="Eg. how do I activate F&O" />
          <div className="support-links">
            <a href="#account-opening">Track account opening</a>
            <a href="#segment">Track segment activation</a>
            <a href="#margins">Intraday margins</a>
            <a href="#manual">TradeX user manual</a>
          </div>
        </div>

        {/* Featured Regulatory & Market Announcements */}
        <div className="col-md-6 p-5 mt-5 mb-5">
          <h1>Featured</h1>
          <ol>
            <li>
              <a href="#takeovers">Current Takeovers and Delisting</a>
            </li>
            <li>
              <a href="#leverages">Latest Intraday leverages - MIS &amp; CO</a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export default Hero;
