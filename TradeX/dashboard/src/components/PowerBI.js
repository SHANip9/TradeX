/**
 * ============================================================================
 * Power BI Financial Intelligence Dashboard (PowerBI.js)
 * ============================================================================
 * Purpose:
 *   Interactive Business Intelligence workspace displaying:
 *     1. Power BI Report Insights (Portfolio & Holdings, Trade Analysis).
 *     2. Embedded High-Resolution PDF Report Viewer with fallback & full-screen view.
 *     3. Download center for the raw Power BI (.pbix) template, PDF report, and CSVs.
 *     4. Real-time KPI summaries mirroring the Power BI DAX calculations.
 * ============================================================================
 */

import React, { useState } from "react";

const PowerBI = () => {
  const [activeTab, setActiveTab] = useState("report"); // "report", "insights", "datasets"
  const pdfZoom = "page-fit";

  const pdfUrl = `${process.env.PUBLIC_URL || ""}/doc/TradeX.pdf`;
  const pbixUrl = `${process.env.PUBLIC_URL || ""}/doc/TradeX.pbix`;

  return (
    <div className="powerbi-page">
      {/* Header & Title Section */}
      <div className="powerbi-header">
        <div>
          <div className="powerbi-badge-container">
            <span className="powerbi-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "6px" }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2V7h2v10z"/>
              </svg>
              Microsoft Power BI
            </span>
            <span className="powerbi-status-pill">Interactive BI Model</span>
          </div>
          <h3 className="title" style={{ margin: "6px 0 4px", fontSize: "1.5rem" }}>
            Power BI Financial Analytics
          </h3>
          <p className="powerbi-subtitle">
            Executive portfolio intelligence, high-frequency trade breakdowns, and cross-instrument P&amp;L analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="powerbi-actions">
          <a
            href={pbixUrl}
            download="TradeX.pbix"
            className="btn btn-pbix"
            title="Download original Power BI Desktop project file (.pbix)"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            Download .PBIX
          </a>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-blue"
            title="Open Power BI PDF report in a new tab"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
            </svg>
            Open Full PDF
          </a>
        </div>
      </div>

      {/* KPI Cards Row (from Power BI DAX metrics) */}
      <div className="powerbi-kpi-grid">
        <div className="powerbi-kpi-card">
          <span className="kpi-label">TOTAL INVESTMENT</span>
          <h4 className="kpi-val">₹3.54M</h4>
          <span className="kpi-sub text-muted">Aggregated principal</span>
        </div>
        <div className="powerbi-kpi-card">
          <span className="kpi-label">PORTFOLIO VALUE</span>
          <h4 className="kpi-val">₹3.55M</h4>
          <span className="kpi-sub profit">+0.02% Net Return</span>
        </div>
        <div className="powerbi-kpi-card">
          <span className="kpi-label">TOTAL TURNOVER</span>
          <h4 className="kpi-val">₹13.57M</h4>
          <span className="kpi-sub text-muted">1,000+ Executed orders</span>
        </div>
        <div className="powerbi-kpi-card">
          <span className="kpi-label">TOP GAINER (UNREALIZED)</span>
          <h4 className="kpi-val profit">M&amp;M (+₹12.1K)</h4>
          <span className="kpi-sub profit">+5.09% instrument return</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="powerbi-tabs">
        <button
          className={`powerbi-tab-btn ${activeTab === "report" ? "active" : ""}`}
          onClick={() => setActiveTab("report")}
        >
          📄 Live PDF Report Viewer
        </button>
        <button
          className={`powerbi-tab-btn ${activeTab === "insights" ? "active" : ""}`}
          onClick={() => setActiveTab("insights")}
        >
          📊 Report Visuals &amp; Structure
        </button>
      </div>

      {/* Tab 1: Live PDF Embed Viewer */}
      {activeTab === "report" && (
        <div className="powerbi-pdf-container">
          <div className="pdf-toolbar">
            <div className="toolbar-left">
              <span className="toolbar-title">📄 TradeX Power BI Report (2 Pages)</span>
            </div>
            <div className="toolbar-right">
              <a
                href={pdfUrl}
                download="TradeX.pdf"
                className="btn-toolbar"
                title="Download local copy of PDF report"
              >
                ⬇ Download PDF
              </a>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-toolbar"
                title="View Fullscreen"
              >
                ⛶ Fullscreen
              </a>
            </div>
          </div>

          <div className="pdf-embed-wrapper">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&view=${pdfZoom}`}
              className="pdf-object"
              title="TradeX Power BI PDF Report"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Visual Breakdown & DAX Architecture */}
      {activeTab === "insights" && (
        <div className="powerbi-insights-container">
          <div className="insight-card">
            <div className="insight-header">
              <span className="page-number-pill">Page 1</span>
              <h4>Portfolio &amp; Holdings Overview</h4>
            </div>
            <p className="insight-desc">
              Comprehensive asset allocation and live valuation monitoring across equity and commodity instruments.
            </p>
            <div className="insight-grid">
              <div className="insight-subbox">
                <h5>📈 Valuation &amp; PnL Trend</h5>
                <p>Time-series curve plotting current product value against capital invested over active market hours.</p>
              </div>
              <div className="insight-subbox">
                <h5>🍩 Symbol Allocation Donut</h5>
                <p>Breakdown of unrealized P&amp;L count and equity exposure across all 16 portfolio instruments.</p>
              </div>
              <div className="insight-subbox">
                <h5>📊 Unrealized P&amp;L by Instrument</h5>
                <p>Real-time unrealized gains (led by M&amp;M, Reliance, HINDUNILVR) vs unrealized corrections.</p>
              </div>
              <div className="insight-subbox">
                <h5>🎯 Buy vs Sell Weighted Pricing</h5>
                <p>Scatter and bar comparisons of average entry points against current market closing prices.</p>
              </div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-header">
              <span className="page-number-pill">Page 2</span>
              <h4>Trade Analysis &amp; High-Frequency Execution</h4>
            </div>
            <p className="insight-desc">
              Order aggregation analytics processing 1,000+ simulated order executions and turnover volumes.
            </p>
            <div className="insight-grid">
              <div className="insight-subbox">
                <h5>💰 Turnover Distribution</h5>
                <p>Total turnover by instrument, led by SGBMAY29 (₹3.11M), JUBLFOOD (₹1.65M), and TCS (₹1.63M).</p>
              </div>
              <div className="insight-subbox">
                <h5>⚖️ Buy vs Sell Volume Parity</h5>
                <p>Dual-bar comparisons of total buy value against sell value for liquidity analysis.</p>
              </div>
              <div className="insight-subbox">
                <h5>💹 Realized Profit &amp; Loss Waterfall</h5>
                <p>Net realized trading gains (TCS, SBIN, WIPRO) and realized loss mitigation metrics.</p>
              </div>
              <div className="insight-subbox">
                <h5>🔄 Order Frequency Share</h5>
                <p>Pie chart of total order distribution ranging from 5.0% to 6.8% volume per stock.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerBI;
