import React from "react";

function Hero() {
  return (
    <div className="container">
      <div className="row p-5 mt-5 border-bottom text-center">
        <h1>Pricing</h1>
        <h3 className="text-muted mt-3 fs-5">
          Free equity investments and flat Rs. 20 intraday and F&amp;O trades
        </h3>
      </div>
      <div className="row p-5 mt-5 text-center">
        <div className="col-md-4 p-4">
          <img src="/media/images/pricingEquity.svg" alt="Equity delivery" />
          <h1 className="fs-1">Free equity delivery</h1>
          <p className="text-muted">
            All equity delivery investments (NSE, BSE) are absolutely free:
            Rs. 0 brokerage.
          </p>
        </div>

        <div className="col-md-4 p-5">
          <img src="/media/images/intradayTrades.svg" alt="Intraday trades" />
          <h1>Intraday and F&amp;O trades</h1>
          <p className="text-muted">
            Flat Rs. 20 or 0.03% (whichever is lower) per executed order on
            intraday trades across equity, currency, and commodity trades.
          </p>
        </div>

        <div className="col-md-4 p-5">
          <img src="/media/images/pricingMF.svg" alt="Direct mutual funds" />
          <h1>Free direct MF</h1>
          <p className="text-muted">
            All direct mutual fund investments are absolutely free: Rs. 0
            commission.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
