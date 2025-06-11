// src/components/MobileNav.jsx
import { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiPieChart,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Menu</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <FiX size={20} />
            </button>
          </div>

          <nav>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiHome size={18} />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiPieChart size={18} />
                  <span>Portfolio</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiDollarSign size={18} />
                  <span>Transactions</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <FiSettings size={18} />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          <FiMenu size={24} />
        </button>
      )}
    </div>
  );
};
