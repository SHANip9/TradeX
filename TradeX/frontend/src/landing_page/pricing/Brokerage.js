/**
 * ============================================================================
 * Pricing Fee Schedule & Brokerage Details (Brokerage.js)
 * ============================================================================
 * Purpose:
 *   Details supplementary charges: Call & Trade, RMS auto-squareoff, contract notes,
 *   NRI fee structures, and debit balances.
 * ============================================================================
 */

import React from "react";

function Brokerage() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 text-center border-top">
        {/* Fine Print / Statutory Disclosures */}
        <div className="col-md-8 p-4">
          <h3 className="fs-5">Brokerage calculator</h3>

          <ul className="text-muted brokerage-list">
            <li>Call &amp; Trade and RMS auto-squareoff: Additional charges of Rs. 50 + GST per order.</li>
            <li>Digital contract notes will be sent via e-mail.</li>
            <li>Physical copies of contract notes are charged Rs. 20 per contract note. Courier charges apply.</li>
            <li>For NRI account (non-PIS), 0.5% or Rs. 100 per executed order for equity, whichever is lower.</li>
            <li>For NRI account (PIS), 0.5% or Rs. 200 per executed order for equity, whichever is lower.</li>
            <li>If the account is in debit balance, any order placed will be charged Rs. 40 per executed order.</li>
          </ul>
        </div>

        {/* List of Charges Reference */}
        <div className="col-md-4 p-4">
          <h3 className="fs-5">List of charges</h3>
        </div>
      </div>
    </div>
  );
}

export default Brokerage;
