/**
 * ============================================================================
 * Support Ticket Category Matrix (CreateTicket.js)
 * ============================================================================
 * Purpose:
 *   Displays a structured 6-category grid for customer assistance:
 *     1. Account Opening
 *     2. Your TradeX Account
 *     3. Trading and Markets
 *     4. Funds
 *     5. Console
 *     6. Coin
 * ============================================================================
 */

import React from "react";

// Categorized Help Topics Configuration
const ticketTopics = [
  {
    icon: "fa-plus-circle",
    title: "Account Opening",
    links: [
      "Online Account Opening",
      "Offline Account Opening",
      "NRI Account Opening",
      "Company, Partnership and HUF Account Opening",
      "Charges at TradeX",
      "Getting Started",
    ],
  },
  {
    icon: "fa-user",
    title: "Your TradeX Account",
    links: ["Login credentials", "Your profile", "Account modification", "Client master report"],
  },
  {
    icon: "fa-line-chart",
    title: "Trading and Markets",
    links: ["Trading FAQs", "Margins", "Product and order types", "TradeX alerts"],
  },
  {
    icon: "fa-credit-card",
    title: "Funds",
    links: ["Add money", "Withdraw money", "UPI", "Ledger and statement"],
  },
  {
    icon: "fa-pie-chart",
    title: "Console",
    links: ["Portfolio", "Reports", "Tax P&L", "Verified P&L"],
  },
  {
    icon: "fa-ticket",
    title: "Coin",
    links: ["Mutual funds", "SIP", "Orders", "Holdings"],
  },
];

function CreateTicket() {
  return (
    <div className="container" id="tickets">
      <div className="row p-5 mt-5 mb-5">
        <h1 className="fs-2">To create a ticket, select a relevant topic</h1>
        {/* Render 6 category blocks */}
        {ticketTopics.map((topic) => (
          <div className="col-md-4 p-5 mt-2 mb-2" key={topic.title}>
            <h4>
              <i className={`fa ${topic.icon}`} aria-hidden="true"></i> {topic.title}
            </h4>
            {topic.links.map((link) => (
              <React.Fragment key={link}>
                <a href={`#${link.replace(/\s+/g, "-").toLowerCase()}`} className="ticket-link">
                  {link}
                </a>
                <br />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateTicket;
