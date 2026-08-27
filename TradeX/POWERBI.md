# Power BI Dashboard — Prerequisites & Setup

Everything you need to build the TradeX BI dashboard in Power BI.

## Prerequisites

1. **Power BI Desktop** (free) — https://powerbi.microsoft.com/desktop/
2. **TradeX API running** — `npm start` (API at `http://localhost:3002`).
3. **MongoDB running** (recommended) so analytics use real aggregation pipelines:
   - `backend/.env` → `MONGO_URL=mongodb://localhost:27017/tradex`
4. **Data to visualise** — generate trades first:
   - In the dashboard UI: Analytics tab → "Simulate 500 trades", or
   - `curl -X POST http://localhost:3002/simulate -H "Content-Type: application/json" -d '{"events":500}'`, or
   - `node backend/scripts/simulate-trades.js 500`

## Option A — Web connector (simplest)

In Power BI Desktop: **Get Data → Web** and add these URLs:

| Dataset | URL |
| --- | --- |
| Holdings | `http://localhost:3002/export/holdings.csv` |
| Orders / trades | `http://localhost:3002/export/orders.csv` |
| Trade analytics | `http://localhost:3002/export/trade-analytics.csv` |

JSON alternatives (Get Data → Web → same host): `/allOrders`,
`/analytics/trades`, `/analytics/summary`, `/analytics/timeline`,
`/portfolio/history`.

Use **Refresh** in Power BI to pull the latest data at any time.

## Option B — MongoDB connector (direct)

1. Install the **MongoDB BI Connector** or use **ODBC** (MongoDB ODBC driver).
2. Connect to `mongodb://localhost:27017`, database `tradex`.
3. Collections: `orders`, `holdings`, `positions`.

## Suggested visuals

- **Card**: total trades, total turnover, realized P&L (`trade-analytics.csv`).
- **Line chart**: portfolio value over time (`/portfolio/history` → `time` vs `currentValue`).
- **Bar chart**: realized P&L by `symbol` (`trade-analytics.csv`).
- **Donut**: turnover share by `symbol`.
- **Table**: orders with `symbol`, `mode`, `qty`, `price`, `value`, `realizedPnl`, `createdAt`.
- **Slicer**: `mode` (BUY/SELL) and `symbol`.

## Field reference

`orders.csv`: `orderId, symbol, mode, qty, price, value, avgCost, realizedPnl, createdAt`

`holdings.csv`: `symbol, qty, avgCost, lastPrice, currentValue, investment, unrealizedPnl, netChange, dayChange`

`trade-analytics.csv`: `symbol, totalTrades, buyQty, sellQty, buyValue, sellValue, avgBuyPrice, avgSellPrice, realizedPnl, turnover, lastTradeAt`
