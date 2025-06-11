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
import Dashboard from "./components/Dashboard";
import {Login} from "./components/Login";
import {Signup} from "./components/Signup";
import ErrorBoundary from "./components/ErrorBoundary";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
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
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div
        className={`min-h-screen ${
          theme === "dark"
            ? "bg-gray-900 text-gray-100"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        {user ? (
          <>
            <header
              className={`${
                theme === "dark" ? "bg-gray-800" : "bg-indigo-600 text-white"
              } p-4 shadow-md sticky top-0 z-10`}
            >
              <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Trackfolio</h1>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "bg-gray-700 text-yellow-400"
                        : "bg-indigo-700 text-white"
                    }`}
                  >
                    {theme === "dark" ? (
                      <FiSun size={20} />
                    ) : (
                      <FiMoon size={20} />
                    )}
                  </button>
                  <div className="hidden md:flex items-center space-x-2">
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-full ${
                      theme === "dark"
                        ? "hover:bg-gray-700"
                        : "hover:bg-indigo-700"
                    }`}
                  >
                    <FiLogOut size={20} />
                  </button>
                </div>
              </div>
            </header>

            <main className="container mx-auto py-8 px-4">
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
    <AppContent />
  </ThemeProvider>
);

export default App;
