import React, { useState } from 'react';
import ABI from '../abi/ABI.json'; // Import the factory ABI
import jobAbi from '../abi/FreelanceEscrow.json'; // Import the job contract ABI
import { BrowserProvider, Contract, parseEther } from 'ethers';
import toast from 'react-hot-toast';

const FACTORY_ADDRESS = '0x82507E91953Fc45a043141f0B592F1E2C213C682';

function CreateJobForm({ onCreate }) {
  const [formData, setFormData] = useState({
    freelancer: '',
    client: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreate = async () => {
    const { freelancer, client } = formData;

    if (!window.ethereum || !freelancer || !client) {
      toast.error('Missing required fields or wallet not found.');
      return;
    }

    setLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const factory = new Contract(FACTORY_ADDRESS, ABI, signer);

      toast.loading('Creating job on blockchain...');
      
      const tx = await factory.createJob(freelancer, client);
      const receipt = await tx.wait();
      toast.dismiss();
     
      toast.success("Job created");


      const jobContract = new Contract(jobAddress, jobAbi, signer);

      toast.loading('Depositing 0.1 ETH...');
      const depositTx = await jobContract.deposit({
        value: parseEther('0.1'),
      });
      await depositTx.wait();
      toast.dismiss();

      toast.success('Deposit successful!');

      

      // Optionally clear form
      setFormData({ freelancer: '', client: '', description: '' });

    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error('Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 space-y-3">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100">
        Create New Job
      </h2>

      <input
        type="text"
        name="client"
        placeholder="Client Address"
        value={formData.client}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        disabled={loading}
      />

      <input
        type="text"
        name="freelancer"
        placeholder="Freelancer Address"
        value={formData.freelancer}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        disabled={loading}
      />

      <textarea
        name="description"
        placeholder="Description"
        rows={4}
        value={formData.description}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
        disabled={loading}
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white transition ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : 'Create Job & Deposit 0.1 ETH'}
      </button>
    </div>
  );
}

export default CreateJobForm;
