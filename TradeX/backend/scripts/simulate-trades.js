/**
 * ============================================================================
 * Trade Simulation & Concurrency Load Tester (simulate-trades.js)
 * ============================================================================
 * Purpose:
 *   Stress tests the TradeX REST API by dispatching N concurrent synthetic order
 *   events (BUY/SELL) against the `/newOrder` endpoint.
 *
 * Usage:
 *   node backend/scripts/simulate-trades.js [eventsCount] [apiUrl]
 *   Example: node backend/scripts/simulate-trades.js 500 http://localhost:3002
 *
 * Output:
 *   Reports total elapsed duration, succeeded/failed orders, and overall throughput (orders/sec).
 * ============================================================================
 */

// Parse number of simulation events (clamped between 1 and 5000, default 500)
const events = Math.min(Math.max(Number(process.argv[2]) || 500, 1), 5000);
// Target API endpoint (default: http://localhost:3002)
const apiUrl = process.argv[3] || process.env.API_URL || "http://localhost:3002";

// Available ticker symbols for synthetic generation
const symbols = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "SBIN",
  "ITC",
  "WIPRO",
  "ONGC",
  "TATAPOWER",
  "BHARTIARTL",
];

/**
 * Generates a random simulated order with realistic quantity, price, and mode
 */
const randomOrder = () => {
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  return {
    name: symbol,
    qty: 1 + Math.floor(Math.random() * 20),
    price: Number((100 + Math.random() * 3000).toFixed(2)),
    mode: Math.random() < 0.6 ? "BUY" : "SELL",
  };
};

/**
 * Main concurrency runner
 */
const main = async () => {
  console.log(`Firing ${events} concurrent order events at ${apiUrl}/newOrder ...`);
  const startedAt = Date.now();

  // Execute all HTTP POST requests in parallel using Promise.allSettled
  const results = await Promise.allSettled(
    Array.from({ length: events }, () =>
      fetch(`${apiUrl}/newOrder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(randomOrder()),
      }).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
    )
  );

  const durationMs = Date.now() - startedAt;
  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  console.log(
    `Done: ${succeeded}/${events} succeeded in ${durationMs}ms ` +
      `(${((succeeded / Math.max(durationMs, 1)) * 1000).toFixed(1)} events/sec)`
  );
};

main().catch((error) => {
  console.error("Simulation error:", error.message);
  process.exit(1);
});
