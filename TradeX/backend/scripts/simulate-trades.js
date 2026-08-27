// Fires N concurrent order events at the running API to load-test /newOrder.
// Usage: node scripts/simulate-trades.js [events] [apiUrl]
const events = Math.min(Math.max(Number(process.argv[2]) || 500, 1), 5000);
const apiUrl = process.argv[3] || process.env.API_URL || "http://localhost:3002";

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

const randomOrder = () => {
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  return {
    name: symbol,
    qty: 1 + Math.floor(Math.random() * 20),
    price: Number((100 + Math.random() * 3000).toFixed(2)),
    mode: Math.random() < 0.6 ? "BUY" : "SELL",
  };
};

const main = async () => {
  console.log(`Firing ${events} concurrent order events at ${apiUrl}/newOrder ...`);
  const startedAt = Date.now();

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
  console.error(error.message);
  process.exit(1);
});
