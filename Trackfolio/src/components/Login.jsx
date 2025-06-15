import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "../firebase";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

export const Login = () => {
  const { theme, themeConfig } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(true);
  const [countdown, setCountdown] = useState(15);
  const navigate = useNavigate();

  useEffect(() => {
    if (showDemo) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowDemo(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showDemo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Login failed. Please try again.";

      switch (err.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    setEmail("tom@gmail.com");
    setPassword("123456");
    toast.info("Demo credentials auto-filled");
    setShowDemo(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${themeConfig[theme].bgPrimary}`}
    >
      {showDemo && (
        <div
          className={`fixed top-6 right-6 w-80 p-5 rounded-xl shadow-xl z-50 animate-fade-in-down
          ${
            theme === "light"
              ? "bg-white border border-gray-200"
              : "bg-gray-800 border border-gray-700"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div
                className={`p-2 rounded-lg mr-3 ${
                  theme === "light"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-blue-900 text-blue-200"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3
                className={`text-lg font-bold ${
                  theme === "light" ? "text-gray-800" : "text-white"
                }`}
              >
                Try Demo Account
              </h3>
            </div>
            <button
              onClick={() => setShowDemo(false)}
              className={`p-1 rounded-full ${
                theme === "light"
                  ? "text-gray-500 hover:bg-gray-100"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div
            className={`mb-4 text-sm ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            <p className="mb-2 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span className="font-mono">tom@gmail.com</span>
            </p>
            <p className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span className="font-mono">123456</span>
            </p>
          </div>

          <div className="flex items-center justify-between mb-2">
            <button
              onClick={copyCredentials}
              className={`py-2 px-4 rounded-lg font-medium text-sm flex items-center ${
                theme === "light"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-700 text-white hover:bg-blue-600"
              } transition duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              Auto-Fill
            </button>

            <div className="flex items-center">
              <span
                className={`text-xs mr-2 ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Disappears in:
              </span>
              <span
                className={`text-sm font-medium ${
                  countdown <= 5
                    ? "text-red-500"
                    : theme === "light"
                    ? "text-blue-600"
                    : "text-blue-400"
                }`}
              >
                {countdown}s
              </span>
            </div>
          </div>

          <div
            className={`w-full rounded-full h-1.5 ${
              theme === "light" ? "bg-gray-200" : "bg-gray-700"
            }`}
          >
            <div
              className={`h-1.5 rounded-full ${
                countdown <= 5
                  ? "bg-red-500"
                  : theme === "light"
                  ? "bg-blue-500"
                  : "bg-blue-400"
              }`}
              style={{ width: `${(countdown / 15) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div
        className={`w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg ${themeConfig[theme].card} transition-all duration-300`}
      >
        <div className="text-center">
          <h2
            className={`text-3xl font-extrabold ${themeConfig[theme].textPrimary} mb-2`}
          >
            Welcome Back
          </h2>
          <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
            Log in to manage your Trackfolio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${themeConfig[theme].textSecondary}`}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={`mt-1 block w-full px-4 py-3 ${themeConfig[theme].borderPrimary} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${themeConfig[theme].inputBg} transition duration-200`}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                className={`block text-sm font-medium ${themeConfig[theme].textSecondary}`}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className={`text-xs ${themeConfig[theme].accentText} hover:underline`}
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className={`mt-1 block w-full px-4 py-3 ${themeConfig[theme].borderPrimary} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${themeConfig[theme].inputBg} transition duration-200`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white ${themeConfig[theme].button} hover:${themeConfig[theme].buttonHover} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 disabled:opacity-70 transition duration-200`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div
            className={`flex-grow border-t ${themeConfig[theme].borderPrimary}`}
          ></div>
          <span
            className={`flex-shrink mx-4 text-sm ${themeConfig[theme].textTertiary}`}
          >
            OR
          </span>
          <div
            className={`flex-grow border-t ${themeConfig[theme].borderPrimary}`}
          ></div>
        </div>

        <div className="text-center">
          <p className={`text-sm ${themeConfig[theme].textTertiary}`}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              className={`font-medium ${themeConfig[theme].accentText} hover:underline`}
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
