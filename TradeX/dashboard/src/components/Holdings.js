import React, { useEffect, useState } from "react";
import { VerticalGraph } from "./VerticalGraph";
import api from "../api";
import { holdings } from "../data/data";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [isOfflineData, setIsOfflineData] = useState(false);

  useEffect(() => {
    api
      .get("/allHoldings")
      .then((res) => {
        setAllHoldings(res.data);
        setIsOfflineData(false);
      })
      .catch(() => {
        setAllHoldings(holdings);
        setIsOfflineData(true);
      });
  }, []);

  const labels = allHoldings.map((subArray) => subArray["name"]);
  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0
  );
  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0
  );
  const pnl = currentValue - totalInvestment;
  const pnlPercent = totalInvestment ? (pnl / totalInvestment) * 100 : 0;

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      {isOfflineData && (
        <p className="inline-note">Showing starter holdings because the API is unavailable.</p>
      )}

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={stock._id || stock.name}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {totalInvestment.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {currentValue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>
            {pnl.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ({pnlPercent.toFixed(2)}%)
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
