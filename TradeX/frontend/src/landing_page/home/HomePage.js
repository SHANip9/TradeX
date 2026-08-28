/**
 * ============================================================================
 * Home Landing Page Container (HomePage.js)
 * ============================================================================
 * Purpose:
 *   Assembles the main landing page sections:
 *     - Hero: Headline, banner image, and signup CTA.
 *     - Awards: Market share and broking accomplishments.
 *     - Stats: Customer trust metrics, philosophy, and ecosystem links.
 *     - Pricing: Value proposition summary (Rs 0 delivery, Rs 20 intraday).
 *     - Education: Varsity market educational resources.
 *     - OpenAccount: Final bottom registration CTA.
 * ============================================================================
 */

import React from "react";
import Hero from "./Hero";
import Awards from "./Awards";
import Stats from "./Stats";
import Pricing from "./Pricing";
import Education from "./Education";
import OpenAccount from "../OpenAccount";

function HomePage() {
  return (
    <>
      <Hero />
      <Awards />
      <Stats />
      <Pricing />
      <Education />
      <OpenAccount />
    </>
  );
}

export default HomePage;
