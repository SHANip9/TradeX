/**
 * ============================================================================
 * Funds & Margin Management Component (Funds.js)
 * ============================================================================
 * Purpose:
 *   Simulates brokerage account funds, margin requirements, and cash ledger.
 *   - Displays available margin, used margin, opening balance, cash, and collateral.
 *   - Provides action buttons for "Add funds" and "Withdraw" (instant UPI transfer simulation).
 * ============================================================================
 */

import React from "react";

const Funds = () => {
  return (
    <>
      {/* Transfer Action Header */}
      <div className="funds">
        <p>Instant, zero-cost fund transfers with UPI </p>
        <button className="btn btn-green" type="button">
          Add funds
        </button>
        <button className="btn btn-blue" type="button">
          Withdraw
        </button>
      </div>

      <div className="row">
        {/* Equity Margin Breakdown Table */}
        <div className="col">
          <span>
            <p>Equity</p>
          </span>

          <div className="table">
            <div className="data">
              <p>Available margin</p>
              <p className="imp colored">4,043.10</p>
            </div>
            <div className="data">
              <p>Used margin</p>
              <p className="imp">3,757.30</p>
            </div>
            <div className="data">
              <p>Available cash</p>
              <p className="imp">4,043.10</p>
            </div>
            <hr />
            <div className="data">
              <p>Opening Balance</p>
              <p>4,043.10</p>
            </div>
            <div className="data">
              <p>Ledger balance</p>
              <p>3,736.40</p>
            </div>
            <div className="data">
              <p>Payin</p>
              <p>4,064.00</p>
            </div>
            <div className="data">
              <p>SPAN</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Delivery margin</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Exposure</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Options premium</p>
              <p>0.00</p>
            </div>
            <hr />
            <div className="data">
              <p>Collateral (Liquid funds)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Collateral (Equity)</p>
              <p>0.00</p>
            </div>
            <div className="data">
              <p>Total Collateral</p>
              <p>0.00</p>
            </div>
          </div>
        </div>

        {/* Commodity Margin Segment Notice */}
        <div className="col">
          <div className="commodity">
            <p>You don't have a commodity account</p>
            <button className="btn btn-blue" type="button">
              Open Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
