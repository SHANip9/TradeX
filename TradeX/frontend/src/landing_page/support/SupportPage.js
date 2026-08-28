/**
 * ============================================================================
 * Support & Helpdesk Page Container (SupportPage.js)
 * ============================================================================
 * Purpose:
 *   Assembles the Customer Support and Help Center page:
 *     - Hero: Instant search bar, featured updates, and quick track links.
 *     - CreateTicket: Categorized directory of help topics to submit tickets.
 * ============================================================================
 */

import React from "react";
import Hero from "./Hero";
import CreateTicket from "./CreateTicket";

function SupportPage() {
  return (
    <>
      <Hero />
      <CreateTicket />
    </>
  );
}

export default SupportPage;
