import React, { useState } from 'react';

function CreateJobForm({ onCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company || !formData.description) return;
    onCreate(formData);
    setFormData({ title: '', company: '', description: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">Create New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <textarea
          name="description"
          placeholder="Job Description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}

export default CreateJobForm;
