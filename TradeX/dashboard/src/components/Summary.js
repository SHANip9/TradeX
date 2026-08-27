import React, { useEffect, useState } from "react";
import api from "../api";
import { holdings } from "../data/data";

const Summary = () => {
  const [allHoldings, setAllHoldings] = useState(holdings);

  useEffect(() => {
    api
      .get("/allHoldings")
      .then((res) => setAllHoldings(res.data))
      .catch(() => {
        setAllHoldings(holdings);
      });
  }, []);

  const investment = allHoldings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0
  );
  const pnl = currentValue - investment;
  const pnlPercent = investment ? (pnl / investment) * 100 : 0;

  return (
    <>
      <div className="username">
        <h6>Hi, User!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>3.74k</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Margins used <span>0</span>{" "}
            </p>
            <p>
              Opening balance <span>3.74k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({allHoldings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnl >= 0 ? "profit" : "loss"}>
              {(pnl / 1000).toFixed(2)}k{" "}
              <small>{pnlPercent.toFixed(2)}%</small>{" "}
            </h3>
            <p>P&amp;L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{(currentValue / 1000).toFixed(2)}k</span>{" "}
            </p>
            <p>
              Investment <span>{(investment / 1000).toFixed(2)}k</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
