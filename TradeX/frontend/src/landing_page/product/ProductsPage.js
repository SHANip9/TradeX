/**
 * ============================================================================
 * Products Showcase Page Container (ProductsPage.js)
 * ============================================================================
 * Purpose:
 *   Catalog showcase of all platforms in the TradeX technological ecosystem:
 *     1. Hero: Intro banner.
 *     2. LeftSection (TradeX Terminal): Web & mobile trading engine with demo link.
 *     3. RightSection (Console): Reporting & analytics portal.
 *     4. LeftSection (Coin): Commission-free direct mutual funds.
 *     5. RightSection (TradeX Connect API): Developer trading APIs.
 *     6. LeftSection (Varsity Mobile): Mobile financial education.
 *     7. Universe: 3rd-party partner fintech apps (smallcase, streak, sensibull, etc.).
 * ============================================================================
 */

import React from "react";
import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

function ProductsPage() {
  return (
    <>
      <Hero />

      {/* Flagship Web & Mobile Trading Platform */}
      <LeftSection
        imageURL="/media/images/kite.png"
        productName="TradeX Terminal"
        productDescription="Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the TradeX experience seamlessly on your Android and iOS devices."
        tryDemo="http://localhost:3001"
        learnMore="#kite"
        googlePlay="#tradex-android"
        appStore="#tradex-ios"
      />

      {/* Reporting & Portfolio Central Portal */}
      <RightSection
        imageURL="/media/images/console.png"
        productName="Console"
        productDescription="The central dashboard for your TradeX account. Gain insights into your trades and investments with in-depth reports and visualisation."
        tryDemo="#console"
        learnMore="#console-learn"
      />

      {/* Direct Mutual Funds Investing */}
      <LeftSection
        imageURL="/media/images/coin.png"
        productName="Coin"
        productDescription="Buy direct mutual funds online, commission-free, delivered directly to your Demat account. Enjoy the investment experience on your Android and iOS devices."
        tryDemo="#coin"
        learnMore="#coin-learn"
        googlePlay="#coin-android"
        appStore="#coin-ios"
      />

      {/* Developer Connect REST APIs */}
      <RightSection
        imageURL="/media/images/kiteconnect.png"
        productName="TradeX Connect API"
        productDescription="Build powerful trading platforms and experiences using the TradeX Connect APIs. A robust set of REST APIs built for developers."
        tryDemo="#connect"
        learnMore="#connect-learn"
      />

      {/* Mobile Financial Literacy */}
      <LeftSection
        imageURL="/media/images/varsity.png"
        productName="Varsity Mobile"
        productDescription="An easy-to-grasp collection of stock market lessons with in-depth coverage and illustrations. Content is broken down into bite-sized cards to help you learn on the go."
        tryDemo="#varsity"
        learnMore="#varsity-learn"
        googlePlay="#varsity-android"
        appStore="#varsity-ios"
      />

      {/* 3rd-Party Partner Ecosystem */}
      <Universe />
    </>
  );
}

export default ProductsPage;
