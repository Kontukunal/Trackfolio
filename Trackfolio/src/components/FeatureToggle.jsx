// src/components/FeatureToggle.jsx
import { useState } from "react";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";

const FeatureToggle = ({ featureName, isEnabled, onToggle, description }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-2">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-white">
          {featureName}
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        onClick={onToggle}
        className="ml-4 relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-pressed={isEnabled}
      >
        <span className="sr-only">Toggle {featureName}</span>
        <span
          className={`${
            isEnabled ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-600"
          } inline-block w-11 h-6 rounded-full transition-colors ease-in-out duration-200`}
        />
        <span
          className={`${
            isEnabled ? "translate-x-6" : "translate-x-1"
          } absolute left-0 inline-block w-4 h-4 transform bg-white rounded-full transition-transform ease-in-out duration-200`}
        />
      </button>
    </div>
  );
};

export default FeatureToggle;
