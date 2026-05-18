"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (status) params.append("status", status);
      if (search) params.append("search", search);

      const res = await fetch(`${API_URL}/jobs?${params.toString()}`);
      const data = await res.json();

      setJobs(data.data || []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, status, search]);

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mini Service Request Board
            </h1>
            <p className="mt-2 text-gray-600">
              Browse homeowner service requests and manage job status.
            </p>
          </div>

          <Link
            href="/jobs/new"
            className="rounded-xl bg-black px-5 py-3 text-center font-medium text-white hover:bg-gray-800"
          >
            + New Request
          </Link>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl bg-white p-5 shadow md:grid-cols-3">
          <input
            type="text"
            placeholder="Search title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 p-3 text-gray-800"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 p-3 text-gray-800"
          >
            <option value="">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Joinery">Joinery</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 p-3 text-gray-800"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <p className="text-gray-600">Loading service requests...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            <p className="text-gray-600">No job requests found.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Link
                key={job._id}
                href={`/jobs/${job._id}`}
                className="rounded-2xl bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                    {job.category}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                    {job.status}
                  </span>
                </div>

                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {job.title}
                </h2>

                <p className="mb-4 line-clamp-3 text-gray-600">
                  {job.description}
                </p>

                <p className="text-sm text-gray-500">
                  📍 {job.location || "Location not provided"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}