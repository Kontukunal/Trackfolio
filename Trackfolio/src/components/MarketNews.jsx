import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const MarketNews = () => {
  const { theme, themeConfig } = useTheme();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("business");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.mediastack.com/v1/news?access_key=1f42334800259608e8c6dadff3543c89&categories=${category}&languages=en&limit=10`
        );
        const data = await response.json();

        if (data.data) {
          setNews(data.data);
        } else {
          setError(data.error?.message || "Failed to fetch news");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  return (
    <div className={`${themeConfig[theme].card} rounded-lg shadow-sm p-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${themeConfig[theme].textPrimary}`}>
          Market News
        </h2>
        <div className="flex space-x-2">
          {["business", "technology", "general"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-md text-sm capitalize ${
                category === cat
                  ? `${themeConfig[theme].accent} text-white`
                  : `${themeConfig[theme].bgTertiary} ${themeConfig[theme].textSecondary}`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${themeConfig[theme].card} rounded-lg overflow-hidden shadow-sm`}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=No+Image";
                  }}
                />
              )}
              <div className="p-4">
                <h3
                  className={`font-bold text-lg ${themeConfig[theme].textPrimary} mb-2 line-clamp-2`}
                >
                  {item.title}
                </h3>
                <p
                  className={`${themeConfig[theme].textSecondary} text-sm mb-3 line-clamp-3`}
                >
                  {item.description}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs ${themeConfig[theme].textTertiary}`}
                  >
                    {new Date(item.published_at).toLocaleDateString()}
                  </span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm flex items-center ${themeConfig[theme].accentText} hover:${themeConfig[theme].accentTextHover}`}
                  >
                    Read more <FiExternalLink className="ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketNews;
