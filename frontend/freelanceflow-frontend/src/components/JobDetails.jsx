import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import jobAbi from "../abi/FreelanceEscrow.json";

function JobDetails({ jobAddress }) {
  const [jobInfo, setJobInfo] = useState(null);
  const [isDepositing, setIsDepositing] = useState(false);
  const [submission, setSubmission] = useState(null);

  const fetchJobData = async () => {
    if (!jobAddress || !window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(jobAddress, jobAbi, provider);

      const [client, freelancer, agent, amount, isDeposited, isCompleted] = await Promise.all([
        contract.client(),
        contract.freelancer(),
        contract.agent(),
        contract.amount(),
        contract.isDeposited(),
        contract.isCompleted(),
      ]);

      const jobDetails = {
        client,
        freelancer,
        agent,
        amount: ethers.formatEther(amount),
        isDeposited,
        isCompleted,
      };

      setJobInfo(jobDetails);

      // Fetch submission link from smart contract if completed
      if (isCompleted && contract.submissionLink) {
        const ipfsUrl = await contract.submissionLink();
        if (ipfsUrl.startsWith("ipfs://")) {
          const cid = ipfsUrl.replace("ipfs://", "");
          const response = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
          const data = await response.json();
          setSubmission(data.url); // GitHub link from Pinata JSON
        }
      }

    } catch (err) {
      console.error("Failed to load job data:", err);
      toast.error("Failed to fetch job details.");
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [jobAddress]);

  const handleDeposit = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(jobAddress, jobAbi, signer);

      setIsDepositing(true);
      toast.loading("Depositing 0.1 ETH...");

      const tx = await contract.deposit({
        value: ethers.parseEther("0.1"),
      });
      await tx.wait();

      toast.dismiss();
      toast.success("Deposit successful!");
      fetchJobData();
    } catch (err) {
      console.error("Deposit failed:", err);
      toast.dismiss();
      toast.error("Deposit failed. Make sure you're the client.");
    } finally {
      setIsDepositing(false);
    }
  };

  if (!jobAddress) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 h-full">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Job Details</h2>
        <p className="text-gray-500 dark:text-gray-400">Select a job to view its details.</p>
      </div>
    );
  }

  if (!jobInfo) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 h-full">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Job Details</h2>
        <p className="text-gray-500 dark:text-gray-400">Loading job data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 h-full">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Job Contract Details</h2>
      <div className="space-y-2 text-sm text-gray-800 dark:text-gray-100">
        <p><strong>Client:</strong> {jobInfo.client}</p>
        <p><strong>Freelancer:</strong> {jobInfo.freelancer}</p>
        <p><strong>Agent:</strong> {jobInfo.isCompleted ? "Agent Deactivated" : "Agent Active"}</p>
        <p><strong>Deposited:</strong> {jobInfo.isDeposited ? "✅ Yes" : "❌ No"}</p>
        <p><strong>Completed:</strong> {jobInfo.isCompleted ? "✅ Yes" : "❌ No"}</p>

        {submission && (
          <p>
            <strong>Submitted Work:</strong>{" "}
            <a
              href={submission}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View Submission ↗
            </a>
          </p>
        )}

        {!jobInfo.isDeposited && (
          <button
            onClick={handleDeposit}
            disabled={isDepositing}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isDepositing ? "Depositing..." : "Deposit 0.1 ETH"}
          </button>
        )}
      </div>
    </div>
  );
}

export default JobDetails;
