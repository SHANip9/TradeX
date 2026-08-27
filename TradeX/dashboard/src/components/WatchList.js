import React, { useContext, useEffect, useState } from "react";

import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";
import api from "../api";

const WatchList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [liveWatchlist, setLiveWatchlist] = useState(watchlist);

  useEffect(() => {
    const fetchQuotes = () => {
      api
        .get("/quotes")
        .then((res) => {
          const quoteMap = new Map(
            res.data.map((quote) => [quote.symbol, quote])
          );
          setLiveWatchlist(
            watchlist.map((stock) => {
              const quote = quoteMap.get(stock.name);
              if (!quote) return stock;
              const sign = quote.dayChangePercent >= 0 ? "+" : "";
              return {
                ...stock,
                price: quote.price,
                percent: `${sign}${quote.dayChangePercent.toFixed(2)}%`,
                isDown: quote.dayChangePercent < 0,
              };
            })
          );
        })
        .catch(() => {
          setLiveWatchlist(watchlist);
        });
    };

    fetchQuotes();
    const timer = setInterval(fetchQuotes, 3000);
    return () => clearInterval(timer);
  }, []);

  const labels = liveWatchlist.map((subArray) => subArray["name"]);
  const filteredWatchlist = liveWatchlist.filter((stock) =>
    stock.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: liveWatchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <span className="counts"> {filteredWatchlist.length} / 50</span>
      </div>

      <ul className="list">
        {filteredWatchlist.map((stock) => {
          return <WatchListItem stock={stock} key={stock.name} />;
        })}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="item-info">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions stock={stock} />}
    </li>
  );
};

const WatchListActions = ({ stock }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(stock.name, stock.price, "BUY");
  };

  const handleSellClick = () => {
    generalContext.openBuyWindow(stock.name, stock.price, "SELL");
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy" type="button">
            Buy
          </button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleSellClick}
        >
          <button className="sell" type="button">
            Sell
          </button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
        >
          <button className="action" type="button">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" type="button">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
