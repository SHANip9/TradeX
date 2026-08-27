function Team() {
  return (
    <div
      className="row p-5 mt-5 text-muted"
      style={{ lineHeight: "1.8", fontSize: "1.2em" }}
    >
      {/* Image Column */}
      <div className="col-6 p-5 text-center">
        <img
          src="media/images/nithinKamath.jpg"
          alt="Nithin Kamath"
          className="rounded-circle"
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
        <h5 className="mt-3 mb-1 fw-bold">Nithin Kamath</h5>
        <p className="text-secondary">Founder, CEO</p>
      </div>

      {/* Text Column */}
      <div className="col-6 p-5">
        <p>
          Nithin bootstrapped and founded TradeX in 2010 to overcome the
          hurdles he faced during his decade long stint as a trader. Today,
          TradeX has changed the landscape of the Indian broking industry.
        </p>
        <p>
          He is a member of the SEBI Secondary Market Advisory Committee (SMAC)
          and the Market Data Advisory Committee (MDAC).
        </p>
        <p>Playing basketball is his zen.</p>
        <p>
          Connect on{" "}
          <a href="#homepage" className="text-primary fw-semibold">
            Homepage
          </a>{" "}
          /{" "}
          <a href="#tradingqna" className="text-primary fw-semibold">
            TradingQnA
          </a>{" "}
          /{" "}
          <a href="#twitter" className="text-primary fw-semibold">
            Twitter
          </a>
        </p>
      </div>
    </div>
  );
}

export default Team;
