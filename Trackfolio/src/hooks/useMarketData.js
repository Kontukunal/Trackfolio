// src/hooks/useMarketData.js

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

export const useMarketData = (symbols) => {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const isMountedRef = useRef(true);

  // Memoize base prices and volatility to prevent unnecessary recalculations
  const basePrices = useMemo(
    () => ({
      AAPL: 175,
      TSLA: 250,
      GOOGL: 135,
      BTC: 28500,
      ETH: 1800,
      SPY: 415,
      QQQ: 350,
      DIA: 340,
      GLD: 185,
    }),
    []
  );

  const volatility = useMemo(
    () => ({
      AAPL: 5,
      TSLA: 8,
      GOOGL: 4,
      BTC: 1000,
      ETH: 100,
      SPY: 2.5,
      QQQ: 2.5,
      DIA: 2.5,
      GLD: 1,
    }),
    []
  );

  // Generate random price movement - stable reference
  const randomMovement = useCallback((basePrice, vol) => {
    return basePrice + (Math.random() * vol * 2 - vol);
  }, []);

  // Stable reference for generateDummyData
  const generateDummyData = useCallback(() => {
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
  }, [symbols, basePrices, volatility, randomMovement]);

  // Stable reference for fetchData
  const fetchData = useCallback(async () => {
    try {
      const newData = generateDummyData();
      setMarketData((prev) => {
        // Only update if data has actually changed
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
      setLastUpdated(new Date());
      return newData;
    } catch (error) {
      console.error("Error generating dummy data:", error);
      return {};
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [generateDummyData]);

  const refreshData = useCallback(async () => {
    return await fetchData();
  }, [fetchData]);

  useEffect(() => {
    isMountedRef.current = true;

    const mainInterval = setInterval(fetchData, 30000); // 30 seconds for most data
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
    }, 10000);

    // Initial data fetch
    fetchData();

    return () => {
      isMountedRef.current = false;
      clearInterval(mainInterval);
      clearInterval(fastUpdateInterval);
    };
  }, []); // Empty dependency array - functions are stable

  return { marketData, loading, lastUpdated, refreshData };
};

export default useMarketData;
