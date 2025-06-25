// src/pages/JobPage.jsx
import React, { useState } from "react";
import CreateJobForm from "../components/CreateJobForm";
import JobList from "../components/JobList";
import JobDetails from "../components/JobDetails";

function JobPage() {
  const [selectedJobAddress, setSelectedJobAddress] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Create Job Form */}
      <div className="md:col-span-1">
        <CreateJobForm />
      </div>

      {/* Job List */}
      <div className="md:col-span-1">
        <JobList onJobClick={setSelectedJobAddress} />
      </div>

      {/* Job Details */}
      <div className="md:col-span-1">
        <JobDetails jobAddress={selectedJobAddress} />
      </div>
    </div>
  );
}

export default JobPage;
