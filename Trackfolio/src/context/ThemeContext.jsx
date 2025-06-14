import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  const themeConfig = {
    light: {
      bgPrimary: "bg-white",
      bgSecondary: "bg-gray-50",
      bgTertiary: "bg-gray-100",
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-600",
      textTertiary: "text-gray-500",
      borderPrimary: "border-gray-200",
      borderSecondary: "border-gray-300",
      accent: "bg-indigo-600",
      accentHover: "hover:bg-indigo-700",
      accentText: "text-indigo-600",
      accentTextHover: "hover:text-indigo-700",
      card: "bg-white border-gray-200",
      chartBg: "bg-white",
      inputBg: "bg-white",
      button: "bg-indigo-600 text-white hover:bg-indigo-700",
      buttonSecondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    },
    dark: {
      bgPrimary: "bg-gray-900",
      bgSecondary: "bg-gray-800",
      bgTertiary: "bg-gray-700",
      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      textTertiary: "text-gray-400",
      borderPrimary: "border-gray-700",
      borderSecondary: "border-gray-600",
      accent: "bg-indigo-500",
      accentHover: "hover:bg-indigo-600",
      accentText: "text-indigo-400",
      accentTextHover: "hover:text-indigo-300",
      card: "bg-gray-800 border-gray-700",
      chartBg: "bg-gray-700",
      inputBg: "bg-gray-700",
      button: "bg-indigo-500 text-white hover:bg-indigo-600",
      buttonSecondary: "bg-gray-700 text-gray-300 hover:bg-gray-600",
    },
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Set CSS variables
    if (theme === "dark") {
      root.style.setProperty("--chart-bg", "#1F2937");
      root.style.setProperty("--chart-text", "#F3F4F6");
      root.style.setProperty("--chart-grid", "#4B5563");
    } else {
      root.style.setProperty("--chart-bg", "#FFFFFF");
      root.style.setProperty("--chart-text", "#111827");
      root.style.setProperty("--chart-grid", "#E5E7EB");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
