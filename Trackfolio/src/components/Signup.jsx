import { useState } from "react";
import { createUserWithEmailAndPassword } from "../firebase";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

export const Signup = () => {
  const { theme, themeConfig } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Signup failed. Please try again.";

      switch (err.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${themeConfig[theme].bgPrimary}`}
    >
      <div
        className={`w-full max-w-md p-8 space-y-6 rounded-xl shadow-lg ${themeConfig[theme].card} transition-all duration-300 transform hover:shadow-xl`}
      >
        <div className="text-center">
          <h2
            className={`text-3xl font-extrabold ${themeConfig[theme].textPrimary} mb-2`}
          >
            Create Account
          </h2>
          <p className={`text-sm ${themeConfig[theme].textSecondary}`}>
            Join Trackfolio to get started
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
            <label
              className={`block text-sm font-medium ${themeConfig[theme].textSecondary}`}
            >
              Password
              <span className="text-xs text-gray-500 ml-1">
                (min 6 characters)
              </span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Create a password"
              className={`mt-1 block w-full px-4 py-3 ${themeConfig[theme].borderPrimary} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${themeConfig[theme].inputBg} transition duration-200`}
            />
          </div>

          <div className="space-y-2">
            <label
              className={`block text-sm font-medium ${themeConfig[theme].textSecondary}`}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Confirm your password"
              className={`mt-1 block w-full px-4 py-3 ${themeConfig[theme].borderPrimary} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 ${themeConfig[theme].inputBg} transition duration-200`}
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className={`focus:ring-2 focus:ring-opacity-50 h-4 w-4 ${themeConfig[theme].borderPrimary} rounded ${themeConfig[theme].inputBg}`}
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="terms"
                className={`${themeConfig[theme].textSecondary}`}
              >
                I agree to the{" "}
                <span
                  className={`${themeConfig[theme].accentText} hover:underline cursor-pointer`}
                >
                  Terms
                </span>{" "}
                and{" "}
                <span
                  className={`${themeConfig[theme].accentText} hover:underline cursor-pointer`}
                >
                  Privacy Policy
                </span>
              </label>
            </div>
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
                Creating account...
              </>
            ) : (
              "Sign up"
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
            Already have an account?{" "}
            <Link
              to="/login"
              className={`font-medium ${themeConfig[theme].accentText} hover:underline`}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
