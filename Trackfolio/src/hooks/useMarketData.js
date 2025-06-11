// src/hooks/useMarketData.js
import { useState, useEffect, useCallback } from "react";

export const useMarketData = (symbols) => {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // In a real app, replace with actual API calls to Alpha Vantage, CoinGecko, etc.
      const mockData = {
        AAPL: { price: 175.25, change: 1.25, changePercent: 0.72 },
        BTC: { price: 28500, change: -320, changePercent: -1.11 },
        ETH: { price: 1800, change: 25, changePercent: 1.41 },
        SPY: { price: 415.32, change: 2.15, changePercent: 0.52 },
      };

      setMarketData(mockData);
      setLoading(false);

      return mockData; // Return the initial data for the interval function
    } catch (error) {
      console.error("Error fetching market data:", error);
      setLoading(false);
      return {};
    }
  }, [symbols]); // Add symbols as dependency

  useEffect(() => {
    let intervalId;

    const loadData = async () => {
      const initialData = await fetchData();

      // Only set up the interval if we got initial data
      if (Object.keys(initialData).length > 0) {
        intervalId = setInterval(() => {
          const updatedData = { ...initialData };
          Object.keys(updatedData).forEach((symbol) => {
            const randomChange = (Math.random() - 0.5) * 10;
            updatedData[symbol] = {
              price: parseFloat(
                (updatedData[symbol].price + randomChange).toFixed(2)
              ),
              change: parseFloat(
                (updatedData[symbol].change + randomChange).toFixed(2)
              ),
              changePercent: parseFloat(
                (
                  ((updatedData[symbol].price +
                    randomChange -
                    (updatedData[symbol].price - updatedData[symbol].change)) /
                    (updatedData[symbol].price - updatedData[symbol].change)) *
                  100
                ).toFixed(2)
              ),
            };
          });
          setMarketData(updatedData);
        }, 5000);
      }
    };

    loadData();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData]); // Only depend on fetchData which is memoized

  return { marketData, loading };
};

export default useMarketData;
