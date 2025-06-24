import React from 'react';

function JobDetails({ job }) {
  if (!job) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 h-full">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Job Details</h2>
        <p className="text-gray-500 dark:text-gray-400">Select a job to view its details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 h-full">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-4">Job Details</h2>
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">{job.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Company: {job.company}</p>
        <p className="text-gray-700 dark:text-gray-200 mt-2">{job.description}</p>
      </div>
    </div>
  );
}

export default JobDetails;
