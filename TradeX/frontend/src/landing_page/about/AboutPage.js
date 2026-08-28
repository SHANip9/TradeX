/**
 * ============================================================================
 * About Page Container (AboutPage.js)
 * ============================================================================
 * Purpose:
 *   Assembles the About page structure:
 *     - Hero: "What is TradeX" project overview, architecture diagram, feature cards, tech stack.
 *     - Team: Creator profile — Souradeep Ghosh, B.Tech student.
 * ============================================================================
 */

import React from "react";
import Hero from "./Heros";
import Team from "./Team";

function AboutPage() {
  return (
    <>
      <Hero />
      <Team />
    </>
  );
}

export default AboutPage;
