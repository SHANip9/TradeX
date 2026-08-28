/**
 * ============================================================================
 * Pricing Page Container (PricingPage.js)
 * ============================================================================
 * Purpose:
 *   Assembles the full pricing disclosure page:
 *     - Hero: Major fee structures (Equity delivery, Intraday/F&O, Direct Mutual Funds).
 *     - OpenAccount: Account opening registration CTA.
 *     - Brokerage: Detailed breakdown of statutory charges, NRI rules, and contract notes.
 * ============================================================================
 */

import React from "react";
import Hero from "./Hero";
import Brokerage from "./Brokerage";
import OpenAccount from "../OpenAccount";

function PricingPage() {
  return (
    <>
      <Hero />
      <OpenAccount />
      <Brokerage />
    </>
  );
}

export default PricingPage;