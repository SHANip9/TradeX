import React from "react";

const Apps = () => {
  return (
    <div className="apps-page">
      <h3 className="title">Apps</h3>
      <div className="app-grid">
        <div>
          <h4>Kite</h4>
          <p>Trading terminal and market watch.</p>
        </div>
        <div>
          <h4>Console</h4>
          <p>Reports, analytics, and account insights.</p>
        </div>
        <div>
          <h4>Coin</h4>
          <p>Direct mutual fund investing.</p>
        </div>
      </div>
    </div>
  );
};

export default Apps;
