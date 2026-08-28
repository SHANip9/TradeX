/**
 * ============================================================================
 * About Page — Project Overview Hero (Heros.js)
 * ============================================================================
 * Purpose:
 *   Introduces TradeX as an original full-stack project.
 *   - "What is TradeX" overview with feature highlights.
 *   - Architecture breakdown showing Frontend → Backend → Database flow.
 *   - Tech stack badges and key feature cards.
 * ============================================================================
 */

import React from "react";

function Hero() {
  return (
    <div className="container mt-5 mb-5">
      {/* ── Page Title ── */}
      <div className="row justify-content-center text-center mb-5">
        <div className="col-lg-10">
          <h1 className="fs-2 fw-bold" style={{ color: "#1a1a2e" }}>
            What is TradeX?
          </h1>
          <p className="text-muted fs-5 mt-3" style={{ lineHeight: "1.8" }}>
            TradeX is a <strong>full-stack stock exchange simulation platform</strong> built
            from scratch as a B.Tech project. It replicates real-world trading workflows —
            live watchlists, real-time price engines, portfolio analytics, order management,
            and fund tracking — all running on a modern web stack.
          </p>
        </div>
      </div>

      {/* ── Architecture Flow Diagram ── */}
      <div className="row justify-content-center mb-5">
        <div className="col-lg-10">
          <div
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              borderRadius: "16px",
              padding: "40px 30px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            <h4 className="fw-bold mb-4" style={{ color: "#60a5fa" }}>
              System Architecture
            </h4>
            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
              {/* Flow nodes */}
              {[
                { label: "React Frontend", sub: "Landing Pages + Dashboard", icon: "⚛️" },
                { label: "→", sub: "", icon: "" },
                { label: "Node.js + Express API", sub: "REST Endpoints + Price Engine", icon: "🖥️" },
                { label: "→", sub: "", icon: "" },
                { label: "MongoDB Atlas", sub: "Holdings, Orders, Funds", icon: "🗄️" },
              ].map((node, i) =>
                node.icon ? (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(96,165,250,0.3)",
                      borderRadius: "12px",
                      padding: "20px 24px",
                      minWidth: "170px",
                    }}
                  >
                    <div style={{ fontSize: "2rem" }}>{node.icon}</div>
                    <p className="fw-semibold mb-1 mt-2" style={{ fontSize: "0.95rem" }}>
                      {node.label}
                    </p>
                    <small style={{ color: "#94a3b8", fontSize: "0.8rem" }}>
                      {node.sub}
                    </small>
                  </div>
                ) : (
                  <span
                    key={i}
                    style={{ fontSize: "1.5rem", color: "#60a5fa", fontWeight: "bold" }}
                  >
                    →
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Feature Cards ── */}
      <div className="row border-top pt-5">
        <div className="col-lg-12 text-center mb-4">
          <h3 className="fw-bold" style={{ color: "#1a1a2e" }}>
            How It Works
          </h3>
          <p className="text-muted">
            TradeX covers the complete trading lifecycle in three layers
          </p>
        </div>

        {/* Feature Card 1 */}
        <div className="col-md-4 mb-4">
          <div
            className="p-4 h-100"
            style={{
              background: "#f0f5ff",
              borderRadius: "12px",
              borderLeft: "4px solid #2563eb",
            }}
          >
            <h5 className="fw-bold" style={{ color: "#2563eb" }}>
              📊 Real-Time Watchlist
            </h5>
            <p className="text-muted mt-3" style={{ fontSize: "0.95rem", lineHeight: "1.7" }}>
              A custom <strong>PriceEngine</strong> (Node.js EventEmitter) generates live
              price ticks every second with random walk simulation. The dashboard
              polls this data and renders real-time NIFTY 50 &amp; SENSEX values along
              with per-stock price changes.
            </p>
          </div>
        </div>

        {/* Feature Card 2 */}
        <div className="col-md-4 mb-4">
          <div
            className="p-4 h-100"
            style={{
              background: "#f0fdf4",
              borderRadius: "12px",
              borderLeft: "4px solid #16a34a",
            }}
          >
            <h5 className="fw-bold" style={{ color: "#16a34a" }}>
              💹 Order & Portfolio Engine
            </h5>
            <p className="text-muted mt-3" style={{ fontSize: "0.95rem", lineHeight: "1.7" }}>
              Users place <strong>BUY/SELL</strong> orders via the dashboard. The backend
              processes each order through validation, updates MongoDB holdings
              with an upsert strategy, adjusts fund balances, and records
              order history — all with proper average-price recalculation.
            </p>
          </div>
        </div>

        {/* Feature Card 3 */}
        <div className="col-md-4 mb-4">
          <div
            className="p-4 h-100"
            style={{
              background: "#fef3f2",
              borderRadius: "12px",
              borderLeft: "4px solid #dc2626",
            }}
          >
            <h5 className="fw-bold" style={{ color: "#dc2626" }}>
              📈 Analytics & Insights
            </h5>
            <p className="text-muted mt-3" style={{ fontSize: "0.95rem", lineHeight: "1.7" }}>
              A dedicated analytics service runs <strong>MongoDB aggregation pipelines</strong> to
              compute sector distribution, top performers, profit/loss breakdowns,
              and portfolio value over time — rendered as interactive Chart.js
              graphs on the dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* ── Tech Stack Badges ── */}
      <div className="row justify-content-center mt-4 mb-3">
        <div className="col-lg-10 text-center">
          <h5 className="fw-bold mb-3" style={{ color: "#1a1a2e" }}>
            Built With
          </h5>
          <div className="d-flex justify-content-center flex-wrap gap-2">
            {[
              "React.js",
              "Node.js",
              "Express.js",
              "MongoDB Atlas",
              "Mongoose",
              "Chart.js",
              "Bootstrap 5",
              "Axios",
              "REST APIs",
            ].map((tech) => (
              <span
                key={tech}
                style={{
                  background: "#e8f0fe",
                  color: "#2563eb",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;

