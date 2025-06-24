import React, { useState } from 'react';
import CreateJobForm from '../components/CreateJobForm';
import JobList from '../components/JobList';
import JobDetails from '../components/JobDetails';

const dummyJobs = [
  {
    id: 1,
    title: 'Smart Contract Developer',
    company: 'CryptoCorp',
    description: 'Build and maintain Solidity smart contracts for DeFi apps.',
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    company: 'Web3X',
    description: 'Develop sleek React dashboards with web3 integration.',
  },
];

function JobPage() {
  const [jobs, setJobs] = useState(dummyJobs);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleCreateJob = (newJob) => {
    const jobWithId = { ...newJob, id: Date.now() };
    setJobs([jobWithId, ...jobs]);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <CreateJobForm onCreate={handleCreateJob} />
      </div>
      <div className="md:col-span-1">
        <JobList jobs={jobs} onJobClick={handleJobClick} />
      </div>
      <div className="md:col-span-1">
        <JobDetails job={selectedJob} />
      </div>
    </div>
  );
}

export default JobPage;
