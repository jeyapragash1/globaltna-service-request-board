"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchJob = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Job request not found");
      }

      setJob(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setError("");

      const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }

      setJob(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteJob = async () => {
    try {
      setError("");

      const res = await fetch(`${API_URL}/jobs/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete job request");
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (error && !job) {
    return (
      <main className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
          <p className="text-red-600">{error}</p>
          <Link href="/" className="mt-4 inline-block text-blue-600">
            ← Back to jobs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to jobs
        </Link>

        {error && (
          <div className="mt-5 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {job.category}
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {job.status}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>

          <p className="mt-4 whitespace-pre-line text-gray-700">
            {job.description}
          </p>

          <div className="mt-6 grid gap-3 rounded-xl bg-gray-50 p-4 text-gray-700">
            <p>
              <strong>Location:</strong> {job.location || "Not provided"}
            </p>
            <p>
              <strong>Contact Name:</strong> {job.contactName || "Not provided"}
            </p>
            <p>
              <strong>Contact Email:</strong>{" "}
              {job.contactEmail || "Not provided"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(job.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block font-medium text-gray-800">
              Update Status
            </label>
            <select
              value={job.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-6 rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
          >
            Delete Request
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Delete Request?
            </h2>

            <p className="mt-3 text-gray-600">
              This action cannot be undone. Are you sure you want to delete this
              service request?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowDeleteModal(false);
                  await deleteJob();
                }}
                className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}