import React from "react";
import { Link } from "react-router-dom";

function Universe() {
  const platforms = [
    {
      img: "/media/images/smallcaseLogo.png",
      name: "smallcase",
      description: "Thematic investment platform",
    },
    {
      img: "/media/images/streakLogo.png",
      name: "Streak",
      description: "Algo & strategy platform",
    },
    {
      img: "/media/images/sensibullLogo.svg",
      name: "Sensibull",
      description: "Options trading platform",
    },
    {
      img: "/media/images/zerodhaFundhouse.png",
      name: "TradeX Fund House",
      description: "Asset management",
    },
    {
      img: "/media/images/goldenpiLogo.png",
      name: "GoldenPi",
      description: "Bonds trading platform",
    },
    {
      img: "/media/images/dittoLogo.png",
      name: "Ditto",
      description: "Insurance",
    },
  ];

  return (
    <div className="container text-center my-5">
      <h2>The TradeX Universe</h2>
      <p className="text-muted">
        Extend your trading and investment experience even further with our partner platforms
      </p>

      <div className="row mt-5">
        {platforms.map((platform) => (
          <div className="col-md-4 col-sm-6 mb-5" key={platform.name}>
            <img src={platform.img} alt={platform.name} style={{ height: "60px" }} />
            <p className="mt-3 mb-1 fw-bold">{platform.name}</p>
            <p className="text-muted">{platform.description}</p>
          </div>
        ))}
      </div>

      <Link className="btn btn-primary fs-5 p-2 signup-cta" to="/signup">
        Sign up now
      </Link>
    </div>
  );
}

export default Universe;
