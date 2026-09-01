# TradeX — a stock exchange platform

Scalable MERN-stack stock exchange platform with MongoDB aggregation pipelines for
trade-level analytics, real-time portfolio management, and P&L dashboards for
financial data visualisation.

- Public landing site: `http://localhost:3000`
- Trading dashboard: `http://localhost:3001`
- Express REST API: `http://localhost:3002`

## Features

- **Real-time portfolio management** — a price tick engine streams simulated live
  quotes; holdings, watchlist prices, and portfolio value update live in the UI.
- **Trade-level analytics** — MongoDB aggregation pipelines power per-instrument
  trade stats (turnover, buy/sell volume, average prices, realized P&L) and
  minute-by-minute trade timelines.
- **P&L dashboard** — live portfolio value chart, realized/unrealized P&L, and
  per-instrument P&L bar chart under the dashboard's **Analytics** tab.
- **Trade simulation** — fire 500+ concurrent order events via
  `POST /simulate` or `node backend/scripts/simulate-trades.js 500` to load-test
  the API and generate analytics data.
- **Power BI Intelligence & Reporting** — complete business intelligence suite with
  `TradeX.pbix` desktop data model, executive PDF reports (`TradeX_PowerBI_Report.pdf`),
  and live CSV/JSON export endpoints for BI dashboards (data in `data/`).

## Run

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
npm --prefix dashboard install
npm start
```

This starts backend, frontend, and dashboard together.

## Build

```bash
npm run build
```

## API overview

| Endpoint | Description |
| --- | --- |
| `GET /allHoldings` | Current holdings (live prices) |
| `GET /allPositions` | Positions |
| `GET /allOrders` | Order history |
| `POST /newOrder` | Place a BUY/SELL order (updates holdings and realized P&L) |
| `GET /quotes` | Live simulated quotes |
| `GET /portfolio/summary` | Investment, current value, unrealized P&L |
| `GET /portfolio/history` | Time series of portfolio value (for live charts) |
| `GET /analytics/trades` | Per-instrument trade analytics (aggregation pipeline) |
| `GET /analytics/summary` | Overall trade totals, top traded, by-mode split |
| `GET /analytics/timeline` | Per-minute trade timeline (aggregation pipeline) |
| `POST /simulate` | Fire N concurrent simulated order events (default 500) |
| `GET /export/holdings.csv` | Holdings export for Power BI |
| `GET /export/orders.csv` | Orders export for Power BI |
| `GET /export/trade-analytics.csv` | Trade analytics export for Power BI |
| `GET /health` | API + database status |

## Notes

- Backend uses `backend/.env` for `MONGO_URL`
  (e.g. `MONGO_URL=mongodb://localhost:27017/tradex`).
- Test MongoDB with `npm --prefix backend run check:db`.
- If MongoDB is unavailable, the API falls back to in-memory holdings, positions,
  orders, and analytics so the app still runs.
- Dashboard routes use hash URLs, for example `http://localhost:3001/#/analytics` or `http://localhost:3001/#/powerbi`.

## Power BI Integration

The project includes pre-built Power BI business intelligence assets:
- **`data/TradeX.pbix`**: Complete Power BI Desktop report and data model.
- **`data/TradeX_PowerBI_Report.pdf`**: Multi-page executive PDF report.
- **Datasets**:
  - `data/holdings.csv` (Active portfolio snapshots)
  - `data/orders.csv` (1,000+ trade order records)
  - `data/trade_analytics.csv` (Aggregated turnover & weighted prices)
  - `data/portfolio_history.csv` (Valuation time series)
- **Interactive UI**: Navigate to the **Power BI** tab in the dashboard (`/powerbi`) to view the embedded report, KPIs, visual structure, and download datasets.

