import React from "react";

function Education() {
  return (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-md-6 text-center">
          <img
            src="/media/images/education.svg"
            style={{ width: "70%" }}
            alt="Varsity illustration"
            className="img-fluid"
          />
        </div>

        <div className="col-md-6">
          <h1 className="mb-3 fw-bold">Free and open market education</h1>
          <p>
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>
          <a href="#varsity" className="text-primary fw-medium text-decoration-none">
            Varsity <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>

          <p className="mt-4">
            TradingQ&amp;A, the most active trading and investment community in
            India for all your market related queries.
          </p>
          <a href="#tradingqna" className="text-primary fw-medium text-decoration-none">
            TradingQ&amp;A <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Education;
