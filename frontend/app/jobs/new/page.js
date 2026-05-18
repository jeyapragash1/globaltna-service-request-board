"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewJobPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Plumbing",
    location: "",
    contactName: "",
    contactEmail: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create job request");
      }

      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow">
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Back to jobs
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Create New Service Request
          </h1>
          <p className="mt-2 text-gray-600">
            Add a homeowner request for tradespeople to browse.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job title"
            className="rounded-lg border border-gray-300 p-3 text-gray-900"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue"
            rows="5"
            className="rounded-lg border border-gray-300 p-3 text-gray-900"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 p-3 text-gray-900"
          >
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Joinery">Joinery</option>
            <option value="Other">Other</option>
          </select>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location e.g. Glasgow"
            className="rounded-lg border border-gray-300 p-3 text-gray-900"
          />

          <input
            name="contactName"
            value={form.contactName}
            onChange={handleChange}
            placeholder="Contact name"
            className="rounded-lg border border-gray-300 p-3 text-gray-900"
          />

          <input
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            placeholder="Contact email"
            className="rounded-lg border border-gray-300 p-3 text-gray-900"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Request"}
          </button>
        </form>
      </div>
    </main>
  );
}