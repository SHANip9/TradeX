# TradeX Data Files for Power BI

All data files are exported and ready in the [`data/`](file:///f:/Major%20Projects/TradeX/TradeX/data/) folder. You can import these directly into Power BI Desktop (or Excel / Python) to build your custom reports and dashboards.

---

## 📂 Available Datasets in `data/`

| File | Description | Key Fields |
| :--- | :--- | :--- |
| [`data/holdings.csv`](file:///f:/Major%20Projects/TradeX/TradeX/data/holdings.csv) | Current stock portfolio holdings | `symbol`, `qty`, `avgCost`, `lastPrice`, `currentValue`, `investment`, `unrealizedPnl`, `netChange`, `dayChange` |
| [`data/orders.csv`](file:///f:/Major%20Projects/TradeX/TradeX/data/orders.csv) | Individual order executions & trade logs | `orderId`, `symbol`, `mode` (BUY/SELL), `qty`, `price`, `value`, `avgCost`, `realizedPnl`, `createdAt` |
| [`data/trade_analytics.csv`](file:///f:/Major%20Projects/TradeX/TradeX/data/trade_analytics.csv) | Aggregated trade metrics per instrument | `symbol`, `totalTrades`, `buyQty`, `sellQty`, `buyValue`, `sellValue`, `avgBuyPrice`, `avgSellPrice`, `realizedPnl`, `turnover`, `lastTradeAt` |
| [`data/portfolio_history.csv`](file:///f:/Major%20Projects/TradeX/TradeX/data/portfolio_history.csv) | Time-series portfolio valuation tick history | `time`, `investment`, `currentValue`, `pnl`, `pnlPercent` |

---

## 📥 How to Import into Power BI Desktop

1. Open **Power BI Desktop**.
2. Click **Get Data → Text/CSV**.
3. Browse to `f:\Major Projects\TradeX\TradeX\data\` and select:
   - `holdings.csv`
   - `orders.csv`
   - `trade_analytics.csv`
   - `portfolio_history.csv`
4. Click **Load** (or **Transform Data** to inspect types).

---

## 🔄 How to Export Fresh / More Trade Data

When TradeX backend is running (`http://localhost:3002`):

1. **Simulate more trades** (e.g. 500 new trades):
   ```powershell
   Invoke-RestMethod -Uri "http://localhost:3002/simulate" -Method POST -ContentType "application/json" -Body '{"events":500}'
   ```
2. **Download updated CSV files into `data/`**:
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3002/export/holdings.csv" -OutFile "data\holdings.csv"
   Invoke-WebRequest -Uri "http://localhost:3002/export/orders.csv" -OutFile "data\orders.csv"
   Invoke-WebRequest -Uri "http://localhost:3002/export/trade-analytics.csv" -OutFile "data\trade_analytics.csv"
   (Invoke-RestMethod -Uri "http://localhost:3002/portfolio/history") | Export-Csv -Path "data\portfolio_history.csv" -NoTypeInformation
   ```
3. In Power BI Desktop, click **Home → Refresh** to load the updated files.
