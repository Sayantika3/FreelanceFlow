import React from 'react';

function JobList({ jobs, onJobClick }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No jobs available yet.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li
              key={job.id}
              onClick={() => onJobClick(job)}
              className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 cursor-pointer transition"
            >
              <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400">{job.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{job.company}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;
