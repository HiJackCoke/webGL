import { useState } from "react";
import "./App.css";

const App = () => {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => prevCount - 1);
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          React + Vite + TypeScript
        </h1>

        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-primary-600 mb-4">
            {count}
          </div>
          <p className="text-gray-600">Click the buttons below to interact</p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleDecrement}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Decrease count"
          >
            -
          </button>

          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Reset count"
          >
            Reset
          </button>

          <button
            onClick={handleIncrement}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label="Increase count"
          >
            +
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Edit{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">src/App.tsx</code>{" "}
            and save to test HMR
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
