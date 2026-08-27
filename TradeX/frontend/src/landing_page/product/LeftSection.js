import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5 mb-5">
      <div className="row align-items-center">
        <div className="col-md-6 p-3 text-center">
          <img src={imageURL} alt={productName} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h1>{productName}</h1>
          <p>{productDescription}</p>

          <div>
            <a href={tryDemo} className="text-decoration-none">
              Try Demo
            </a>
            <a href={learnMore} className="text-decoration-none ms-5">
              Learn More
            </a>
          </div>

          <div className="mt-3 d-flex gap-2">
            {googlePlay && (
              <a href={googlePlay} target="_blank" rel="noreferrer">
                <img src="/media/images/googlePlayBadge.svg" alt="Google Play" height="40" />
              </a>
            )}
            {appStore && (
              <a href={appStore} target="_blank" rel="noreferrer">
                <img src="/media/images/appstoreBadge.svg" alt="App Store" height="40" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
