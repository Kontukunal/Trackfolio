// src/hooks/useMarketData.js
import { useState, useEffect, useCallback } from "react";

export const useMarketData = (symbols) => {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Generate random price movement
  const randomMovement = (basePrice, volatility) => {
    return basePrice + (Math.random() * volatility * 2 - volatility);
  };

  const generateDummyData = useCallback(() => {
    const basePrices = {
      AAPL: 175,
      TSLA: 250,
      GOOGL: 135,
      BTC: 28500,
      ETH: 1800,
      SPY: 415,
      QQQ: 350,
      DIA: 340,
      GLD: 185,
    };

    const volatility = {
      AAPL: 5,
      TSLA: 8,
      GOOGL: 4,
      BTC: 1000,
      ETH: 100,
      SPY: 2.5,
      QQQ: 2.5,
      DIA: 2.5,
      GLD: 1,
    };

    const newData = {};

    symbols.forEach((symbol) => {
      if (basePrices[symbol]) {
        const price = randomMovement(basePrices[symbol], volatility[symbol]);
        const change = randomMovement(0, volatility[symbol] / 2);
        const changePercent = (change / price) * 100;

        newData[symbol] = {
          price: parseFloat(price.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          symbol: symbol,
        };
      }
    });

    return newData;
  }, [symbols]);

  const fetchData = useCallback(async () => {
    try {
      const newData = generateDummyData();
      setMarketData(newData);
      setLastUpdated(new Date());
      return newData;
    } catch (error) {
      console.error("Error generating dummy data:", error);
      return {};
    } finally {
      setLoading(false);
    }
  }, [generateDummyData]);

  const refreshData = useCallback(async () => {
    return await fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Initial load
    fetchData();

    // Set up different intervals for different components
    const mainInterval = setInterval(fetchData, 30000); // 30 seconds for most data

    // Faster updates for Market Overview and Watchlist (10 seconds)
    const fastUpdateInterval = setInterval(() => {
      setMarketData((prev) => {
        const updatedData = { ...prev };
        const watchlistSymbols = ["AAPL", "TSLA", "GOOGL", "BTC", "ETH"];

        watchlistSymbols.forEach((symbol) => {
          if (updatedData[symbol]) {
            const price = randomMovement(
              updatedData[symbol].price,
              updatedData[symbol].price * 0.01
            );
            const change = randomMovement(
              updatedData[symbol].change,
              Math.abs(updatedData[symbol].change) * 0.5
            );

            updatedData[symbol] = {
              ...updatedData[symbol],
              price: parseFloat(price.toFixed(2)),
              change: parseFloat(change.toFixed(2)),
              changePercent: parseFloat(((change / price) * 100).toFixed(2)),
            };
          }
        });
        return updatedData;
      });
    }, 60000); // 10 seconds for watchlist and market overview

    return () => {
      clearInterval(mainInterval);
      clearInterval(fastUpdateInterval);
    };
  }, [fetchData]);

  return { marketData, loading, lastUpdated, refreshData };
};

export default useMarketData;
