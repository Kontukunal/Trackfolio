import { useState, useEffect, useCallback } from "react";

export const useMarketData = (symbols) => {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // Simulate API call with mock data
      const mockData = {
        AAPL: {
          price: 175.25 + (Math.random() * 10 - 5),
          change: 1.25 + (Math.random() * 2 - 1),
          changePercent: 0.72 + (Math.random() * 2 - 1),
          symbol: "AAPL",
        },
        BTC: {
          price: 28500 + (Math.random() * 2000 - 1000),
          change: -320 + (Math.random() * 200 - 100),
          changePercent: -1.11 + (Math.random() * 2 - 1),
          symbol: "BTC",
        },
        ETH: {
          price: 1800 + (Math.random() * 200 - 100),
          change: 25 + (Math.random() * 20 - 10),
          changePercent: 1.41 + (Math.random() * 2 - 1),
          symbol: "ETH",
        },
        SPY: {
          price: 415.32 + (Math.random() * 5 - 2.5),
          change: 2.15 + (Math.random() * 1 - 0.5),
          changePercent: 0.52 + (Math.random() * 1 - 0.5),
          symbol: "SPY",
        },
        QQQ: {
          price: 350.75 + (Math.random() * 5 - 2.5),
          change: 3.25 + (Math.random() * 1 - 0.5),
          changePercent: 0.93 + (Math.random() * 1 - 0.5),
          symbol: "QQQ",
        },
        DIA: {
          price: 340.5 + (Math.random() * 5 - 2.5),
          change: 1.75 + (Math.random() * 1 - 0.5),
          changePercent: 0.52 + (Math.random() * 1 - 0.5),
          symbol: "DIA",
        },
        GLD: {
          price: 185.2 + (Math.random() * 2 - 1),
          change: 0.45 + (Math.random() * 0.5 - 0.25),
          changePercent: 0.24 + (Math.random() * 0.5 - 0.25),
          symbol: "GLD",
        },
      };

      // Filter to only include requested symbols
      const filteredData = {};
      symbols.forEach((symbol) => {
        if (mockData[symbol]) {
          filteredData[symbol] = mockData[symbol];
        }
      });

      setMarketData((prev) => {
        // Only update if data has actually changed
        if (JSON.stringify(prev) !== JSON.stringify(filteredData)) {
          return filteredData;
        }
        return prev;
      });
      setLoading(false);
      setLastUpdated(new Date());
      return filteredData;
    } catch (error) {
      console.error("Error fetching market data:", error);
      setLoading(false);
      return {};
    }
  }, [symbols]);

  const refreshData = useCallback(async () => {
    return await fetchData();
  }, [fetchData]);

  useEffect(() => {
    let intervalId;

    const loadData = async () => {
      await fetchData();

      // Set up interval only after initial load
      intervalId = setInterval(() => {
        fetchData();
      }, 30000); // Update every 30 seconds
    };

    loadData();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData]);

  return { marketData, loading, lastUpdated, refreshData };
};

export default useMarketData;
