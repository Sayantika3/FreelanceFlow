const { ethers } = require("ethers");
require("dotenv").config(); // Load environment variables from .env file
const factoryAbi = require("../frontend/freelanceflow-frontend/src/abi/ABI.json"); // EscrowFactory ABI
const jobAbi = require("../frontend/freelanceflow-frontend/src/abi/FreelanceEscrow.json"); // Job contract ABI

// Replace with your actual values
const FACTORY_ADDRESS = "0xDFA958d74fa779088080F5911409D14d95fb9fc0" ; // EscrowFactory contract address
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL); // Or Alchemy or localhost
const signer = new ethers.Wallet( process.env.PRIVATE_KEY , provider);
const factory = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, signer);

// Helper to handle a single job
const handleJob = async (jobAddress) => {
  const job = new ethers.Contract(jobAddress, jobAbi, signer);
  try {
    const [isDeposited, isCompleted, client, freelancer, amount] = await Promise.all([
      job.isDeposited(),
      job.isCompleted(),
      job.client(),
      job.freelancer(),
      job.amount()
    ]);

    if (!isDeposited || isCompleted) return;

    // 👇 Example logic: auto release if conditions met
    const now = Math.floor(Date.now() / 1000);
    const depositTime = await job.depositTime?.(); // optional if tracked
    const elapsed = depositTime ? now - depositTime : 999999;

    if (elapsed > 900) {
      const tx = await job.releasePayment(); // or job.refund()
      await tx.wait();
      console.log(`✅ Payment released for job: ${jobAddress}`);
    }

  } catch (err) {
    console.error(`❌ Error handling job ${jobAddress}:`, err.message);
  }
};

// 📦 Poll all jobs every 15 minutes
const pollJobs = async () => {
  console.log(`[${new Date().toLocaleString()}] ⏳ Polling jobs...`);
  try {
    const jobs = await factory.getAllJobs();
    for (const jobAddress of jobs) {
      await handleJob(jobAddress);
    }
  } catch (err) {
    console.error("❌ Agent poll error:", err.message);
  }
};

// 🔔 Event-based job trigger
factory.on("JobCreated", async (jobAddress) => {
  console.log(`[${new Date().toLocaleString()}] 📥 New JobCreated at ${jobAddress}`);
  await handleJob(jobAddress);
});

// Start polling every 15 min
setInterval(pollJobs, 15 * 60 * 1000);

// Initial start
console.log(`[${new Date().toLocaleString()}] ⏳ Agent starting...`);
pollJobs();
