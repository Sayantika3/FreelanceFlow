// JobList.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI  from "../abi/ABI.json"; // EscrowFactory ABI

const FACTORY_ADDRESS = "0x82507E91953Fc45a043141f0B592F1E2C213C682";

function JobList({ onJobClick }) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const loadJobs = async () => {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const factory = new ethers.Contract(FACTORY_ADDRESS, ABI, provider);

      try {
        const addresses = await factory.getAllJobs();
        //console.log("Fetched job addresses:", addresses);
        setJobs(addresses);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    loadJobs();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No jobs available yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((address, index) => (
            <li
              key={index}
              onClick={() => onJobClick(address)}
              className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 cursor-pointer transition"
            >
              <h3 className="text-md font-semibold text-blue-700 dark:text-blue-400">Job #{index + 1}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 break-words">
                Contract: {address}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;