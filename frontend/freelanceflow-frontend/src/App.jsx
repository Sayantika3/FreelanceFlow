// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JobPage from './pages/JobPage';
import { Moon, Sun } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import FreelancerPage from './pages/freelancer'; // Import the new FreelancerPage component

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0] || '');
          });
        } catch (err) {
          console.error("Connection rejected", err);
        }
      } else {
        alert("Please install MetaMask.");
      }
    };

    connectWallet();
  }, []);

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
          
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-gray-800 p-4 hidden md:block shadow-lg">
            <h2 className="text-2xl font-bold mb-6">🪙 FreelanceFlow</h2>
            <nav>
              <ul className="space-y-4">
                <li><Link to="/" className="hover:text-blue-500">Dashboard</Link></li>
                <li><Link to="/freelancer" className="hover:text-blue-500">Freelancer Panel</Link></li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-4">
            <header className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Wallet: {account || "Not connected"}
                </p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </header>

            <Routes>
              <Route path="/" element={<JobPage account={account} />} />
              <Route path="/freelancer" element={<FreelancerPage account={account} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
