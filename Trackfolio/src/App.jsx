import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import ErrorBoundary from "./components/ErrorBoundary";
import { FiSun, FiMoon, FiLogOut, FiUser, FiPieChart } from "react-icons/fi";
import { BsGraphUp } from "react-icons/bs";
import { RiNewspaperLine } from "react-icons/ri";

const AppContent = () => {
  const { theme, toggleTheme, themeConfig } = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${themeConfig[theme].bgPrimary}`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div
        className={`min-h-screen ${themeConfig[theme].bgPrimary} ${themeConfig[theme].textPrimary} transition-colors duration-200`}
      >
        {user ? (
          <>
            <header
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } p-4 shadow-sm sticky top-0 z-10 border-b ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FiPieChart className="text-indigo-600" size={24} />
                  <h1 className="text-xl font-bold">Trackfolio</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    {theme === "dark" ? (
                      <FiSun size={20} />
                    ) : (
                      <FiMoon size={20} />
                    )}
                  </button>
                  <div className="hidden md:flex items-center space-x-2">
                    <div
                      className={`p-2 rounded-full ${
                        theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <FiUser
                        className={
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }
                        size={18}
                      />
                    </div>
                    <span
                      className={
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }
                    >
                      {user.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    <FiLogOut size={20} />
                  </button>
                </div>
              </div>
            </header>

            <main className="container mx-auto py-6 px-4">
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </ErrorBoundary>
            </main>
          </>
        ) : (
          <Routes>
            <Route
              path="/login"
              element={<Login onLogin={() => setUser(auth.currentUser)} />}
            />
            <Route
              path="/signup"
              element={<Signup onSignup={() => setUser(auth.currentUser)} />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
