import React from "react";

import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

function ProductsPage() {
  return (
    <>
      <Hero />

      <LeftSection
        imageURL="/media/images/kite.png"
        productName="Kite"
        productDescription="Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices."
        tryDemo="http://localhost:3001"
        learnMore="#kite"
        googlePlay="https://play.google.com/store/apps/details?id=com.zerodha.kite"
        appStore="https://apps.apple.com/in/app/kite-zerodha/id1449453802"
      />

      <RightSection
        imageURL="/media/images/console.png"
        productName="Console"
        productDescription="The central dashboard for your Zerodha account. Gain insights into your trades and investments with in-depth reports and visualisation."
        tryDemo="#console"
        learnMore="#console-learn"
      />

      <LeftSection
        imageURL="/media/images/coin.png"
        productName="Coin"
        productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices."
        tryDemo="#coin"
        learnMore="#coin-learn"
        googlePlay="https://play.google.com/store/apps/details?id=com.zerodha.coin"
        appStore="https://apps.apple.com/in/app/coin-by-zerodha/id1392892554"
      />

      <RightSection
        imageURL="/media/images/kiteconnect.png"
        productName="Kite Connect API"
        productDescription="Build powerful trading platforms and experiences using the Kite Connect APIs. A robust set of REST APIs built for developers."
        tryDemo="#connect"
        learnMore="#connect-learn"
      />

      <LeftSection
        imageURL="/media/images/varsity.png"
        productName="Varsity Mobile"
        productDescription="An easy-to-grasp collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-sized cards to help you learn on the go."
        tryDemo="#varsity"
        learnMore="#varsity-learn"
        googlePlay="https://play.google.com/store/apps/details?id=com.zerodha.varsity"
        appStore="https://apps.apple.com/in/app/varsity-by-zerodha/id1474610753"
      />

      <Universe />
    </>
  );
}

export default ProductsPage;
