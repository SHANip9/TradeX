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
        {/* Text Section */}
        <div className="col-md-6 p-5">
          <h1>{productName}</h1>
          <p>{productDescription}</p>

          {/* Buttons */}
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

          {/* Store Badges */}
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

        {/* Image */}
        <div className="col-md-6 text-center">
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
