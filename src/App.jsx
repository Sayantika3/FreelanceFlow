// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobPage from './pages/JobPage';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-gray-800 p-4 hidden md:block shadow-lg">
            <h2 className="text-2xl font-bold mb-6">🪙 CryptoJobs</h2>
            <nav>
              <ul className="space-y-4">
                <li><a href="/" className="hover:text-blue-500">Dashboard</a></li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-4">
            <header className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Dashboard</h1>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </header>

            <Routes>
              <Route path="/" element={<JobPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
