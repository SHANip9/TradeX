import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price, mode) => {},
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState({
    uid: "",
    price: 0,
    mode: "BUY",
  });

  const handleOpenBuyWindow = (uid, price = 0, mode = "BUY") => {
    setSelectedStock({ uid, price, mode });
    setIsBuyWindowOpen(true);
  };

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
