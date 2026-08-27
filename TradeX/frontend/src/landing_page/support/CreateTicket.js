import React from "react";

const ticketTopics = [
  {
    icon: "fa-plus-circle",
    title: "Account Opening",
    links: [
      "Online Account Opening",
      "Offline Account Opening",
      "NRI Account Opening",
      "Company, Partnership and HUF Account Opening",
      "Charges at Zerodha",
      "Getting Started",
    ],
  },
  {
    icon: "fa-user",
    title: "Your Zerodha Account",
    links: ["Login credentials", "Your profile", "Account modification", "Client master report"],
  },
  {
    icon: "fa-line-chart",
    title: "Trading and Markets",
    links: ["Trading FAQs", "Margins", "Product and order types", "Kite alerts"],
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
