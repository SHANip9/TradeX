/**
 * ============================================================================
 * Right-Aligned Product Showcase Card (RightSection.js)
 * ============================================================================
 * Purpose:
 *   Reusable layout showing product details and action buttons on the left,
 *   and product screenshot/mockup on the right.
 * ============================================================================
 */

import React from "react";

function RightSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Left Side: Product Description & Action Links */}
        <div className="col-md-6 p-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>

          <div className="mt-3">
            {tryDemo && (
              <a href={tryDemo} className="btn btn-primary">
                Try Demo
              </a>
            )}
            {learnMore && (
              <a
                href={learnMore}
                className="btn btn-outline-secondary ms-3"
              >
                Learn More
              </a>
            )}
          </div>

          {/* Optional App Store / Google Play Badges */}
          <div className="mt-4 d-flex">
            {googlePlay && (
              <a href={googlePlay}>
                <img
                  src="/media/images/googlePlayBadge.svg"
                  alt="Google Play"
                  height="50"
                />
              </a>
            )}
            {appStore && (
              <a href={appStore} className="ms-3">
                <img
                  src="/media/images/appstoreBadge.svg"
                  alt="App Store"
                  height="50"
                />
              </a>
            )}
          </div>
        </div>

        {/* Right Side: Product Graphic Illustration */}
        <div className="col-md-6 text-center">
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
