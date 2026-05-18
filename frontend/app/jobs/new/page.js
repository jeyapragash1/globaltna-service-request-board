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

  const inputClass =
    "rounded-xl border border-gray-300 bg-white p-4 text-gray-900 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10";

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
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 px-6 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-2xl backdrop-blur">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to jobs
          </Link>

          <div className="mt-6 rounded-2xl bg-gray-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Homeowner Request Form
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900">
              Create New Service Request
            </h1>
            <p className="mt-3 text-gray-600">
              Add a clear service request so tradespeople can understand the
              issue, location, and contact details quickly.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Job title e.g. Leaking kitchen tap"
            className={inputClass}
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail"
            rows="5"
            className={inputClass}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={inputClass}
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
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <input
              name="contactName"
              value={form.contactName}
              onChange={handleChange}
              placeholder="Contact name"
              className={inputClass}
            />

            <input
              name="contactEmail"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="Contact email"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-black px-5 py-4 text-lg font-semibold text-white transition hover:scale-[1.01] hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Request"}
          </button>
        </form>
      </div>
    </main>
  );
}