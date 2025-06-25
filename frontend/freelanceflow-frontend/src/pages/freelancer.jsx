// src/pages/FreelancerPage.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import escrowAbi from "../abi/FreelanceEscrow.json";
import factoryAbi from "../abi/ABI.json";
import toast from "react-hot-toast";

const FACTORY_ADDRESS = "0x82507E91953Fc45a043141f0B592F1E2C213C682";

function FreelancerPage({ account }) {
  const [assignedJobs, setAssignedJobs] = useState([]);
  const [links, setLinks] = useState({});
  const [uploading, setUploading] = useState({});

  useEffect(() => {
    const loadJobs = async () => {
      if (!window.ethereum || !account) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, provider);
        const jobAddresses = await factory.getAllJobs();

        const filtered = [];

        for (let addr of jobAddresses) {
          const contract = new ethers.Contract(addr, escrowAbi, provider);
          const freelancer = await contract.freelancer();
          const isCompleted = await contract.isCompleted();

          if (
            freelancer.toLowerCase() === account.toLowerCase() &&
            !isCompleted
          ) {
            filtered.push(addr);
          }
        }

        setAssignedJobs(filtered);
      } catch (err) {
        console.error("Error loading freelancer jobs", err);
        toast.error("Failed to load assigned jobs.");
      }
    };

    loadJobs();
  }, [account]);

  const handleLinkChange = (e, jobAddress) => {
    setLinks((prev) => ({ ...prev, [jobAddress]: e.target.value }));
  };

  const uploadToPinata = async (githubUrl) => {
    const body = JSON.stringify({
      type: "submission",
      url: githubUrl,
    });

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
      },
      body,
    });

    const data = await res.json();
    return `ipfs://${data.IpfsHash}`;
  };

  const handleSubmit = async (jobAddress) => {
    const githubUrl = links[jobAddress];
    if (!githubUrl || !githubUrl.startsWith("http")) {
      toast.error("Please enter a valid GitHub link.");
      return;
    }

    try {
      setUploading((prev) => ({ ...prev, [jobAddress]: true }));
      const loadingId = toast.loading("Uploading metadata to IPFS...");

      const ipfsUrl = await uploadToPinata(githubUrl);
      toast.success("✅ Metadata uploaded!", { id: loadingId });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(jobAddress, escrowAbi, signer);

      toast.loading("Submitting work on-chain...");
      const tx = await contract.submitWork(ipfsUrl);
      await tx.wait();
      toast.dismiss();
      toast.success("🎉 Work submitted successfully!");

      // Remove the submitted job from the list
      setAssignedJobs((prev) => prev.filter((addr) => addr !== jobAddress));
    } catch (err) {
      console.error("Submission failed:", err);
      toast.dismiss();
      toast.error("❌ Submission failed");
    } finally {
      setUploading((prev) => ({ ...prev, [jobAddress]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">📁 My Assigned Jobs</h2>

      {assignedJobs.length === 0 ? (
        <p className="text-gray-500">No jobs assigned yet.</p>
      ) : (
        assignedJobs.map((job) => (
          <div key={job} className="mb-6 border-b pb-4 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Contract: {job}</p>

            <input
              type="text"
              placeholder="Enter GitHub project link"
              value={links[job] || ""}
              onChange={(e) => handleLinkChange(e, job)}
              className="mt-2 w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 text-sm"
            />

            <button
              onClick={() => handleSubmit(job)}
              disabled={uploading[job]}
              className={`mt-2 px-4 py-2 rounded text-white ${
                uploading[job] ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              } transition`}
            >
              {uploading[job] ? "Submitting..." : "Submit Project"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default FreelancerPage;
