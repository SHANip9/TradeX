import React from "react";
import { Link } from "react-router-dom";

function Stats() {
  return (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1 className="mb-4">Trust with confidence</h1>

          <h5 className="mb-2">Customer-first always</h5>
          <p className="text-muted">
            That's why 1.3+ crore customers trust Zerodha with Rs. 3.5+ lakh
            crores worth of equity investments.
          </p>

          <h5 className="mt-4 mb-2">No spam or gimmicks</h5>
          <p className="text-muted">
            No gimmicks, spam, gamification, or annoying push notifications.
            High quality apps that you use at your pace, the way you like.
          </p>

          <h5 className="mt-4 mb-2">The Zerodha universe</h5>
          <p className="text-muted">
            Not just an app, but a whole ecosystem. Our investments in 30+
            fintech startups offer you tailored services specific to your needs.
          </p>

          <h5 className="mt-4 mb-2">Do better with money</h5>
          <p className="text-muted">
            With initiatives like Nudge and Kill Switch, we don't just
            facilitate transactions, but actively help you do better with your
            money.
          </p>
        </div>

        <div className="col-md-6 text-center">
          <img
            src="/media/images/ecosystem.png"
            alt="Zerodha ecosystem"
            style={{ width: "90%" }}
          />
          <div className="text-center mt-4">
            <Link className="mx-5 text-decoration-none" to="/product">
              Explore our products <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </Link>
            <a className="text-decoration-none" href="http://localhost:3001">
              Try Kite demo <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stats;
