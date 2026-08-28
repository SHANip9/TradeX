/**
 * ============================================================================
 * Trading General Context & Order Modal Manager (GeneralContext.js)
 * ============================================================================
 * Purpose:
 *   Provides React Context API state management for the `BuyActionWindow` order modal.
 *   Enables any nested component (e.g. WatchList items, quotes) to trigger the BUY or
 *   SELL order popup with pre-populated stock ticker, price, and action mode.
 * ============================================================================
 */

import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

// Initialize Context with default signature
const GeneralContext = React.createContext({
  openBuyWindow: (uid, price, mode) => {},
  closeBuyWindow: () => {},
});

/**
 * Context Provider Component:
 * Tracks open/closed modal state and currently selected stock transaction details.
 */
export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({
    uid: "",
    price: 0,
    mode: "BUY",
  });

  /**
   * Opens order execution window with specified stock details
   */
  const handleOpenBuyWindow = (uid, price = 0, mode = "BUY") => {
    setSelectedStock({ uid, price, mode });
    setIsBuyWindowOpen(true);
  };

  /**
   * Closes order execution modal and resets selected stock
   */
  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStock({ uid: "", price: 0, mode: "BUY" });
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
      }}
    >
      {props.children}
      {/* Floating Order Execution Modal */}
      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStock.uid}
          initialPrice={selectedStock.price}
          mode={selectedStock.mode}
          onClose={handleCloseBuyWindow}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
