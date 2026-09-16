"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";
import toast from "react-hot-toast";

export default function StudentRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    desiredClass: "Class 8",
    gender: "Male",
    dateOfBirth: "",
    bloodGroup: "A+",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    previousSchool: "",
    previousGPA: "",
    documentUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.desiredClass) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiPost("/api/students/register", {
        ...formData,
        documents: formData.documentUrl ? [formData.documentUrl] : [],
      });

      if (res.success) {
        toast.success("Application submitted successfully!");
        router.push(`/pending-review?email=${encodeURIComponent(formData.email || "")}&name=${encodeURIComponent(formData.name)}&class=${encodeURIComponent(formData.desiredClass)}`);
      } else {
        toast.error(res.message || "Failed to submit registration");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <Link href="/" className="text-xl font-black tracking-tight text-slate-900">
              Edu<span className="text-indigo-600">Jira</span>
            </Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900">
              Student Admission Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Apply for academic enrollment. Applications are reviewed and approved by the administration.
            </p>
          </div>
          <span className="hidden sm:inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
            Self-Registration Flow
          </span>
        </div>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center justify-between border-b border-slate-100 pb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 ${step === 1 ? "text-indigo-600" : "text-slate-400"}`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${step === 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>1</span>
            <span>Personal & Desired Class</span>
          </button>
          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block" />
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-2 ${step === 2 ? "text-indigo-600" : "text-slate-400"}`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${step === 2 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>2</span>
            <span>Guardian & Previous School</span>
          </button>
          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block" />
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center gap-2 ${step === 3 ? "text-indigo-600" : "text-slate-400"}`}
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${step === 3 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>3</span>
            <span>Documents & Submit</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Tanvir Ahsan"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Desired Class *
                  </label>
                  <select
                    name="desiredClass"
                    value={formData.desiredClass}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
                  >
                    <option value="Class 6">Class 6 (Junior Secondary)</option>
                    <option value="Class 7">Class 7 (Junior Secondary)</option>
                    <option value="Class 8">Class 8 (JSC Candidate)</option>
                    <option value="Class 9">Class 9 (Secondary Science/Arts)</option>
                    <option value="Class 10">Class 10 (SSC Candidate)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1700-000000"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                >
                  Continue to Step 2 →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="rounded-xl bg-indigo-50/70 p-4 border border-indigo-100">
                <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Parent / Guardian Information</h3>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Guardian Name</label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Father / Mother Name"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Guardian Email</label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      placeholder="guardian@example.com"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Guardian Phone</label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      placeholder="+880 1700-000000"
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Residential Address</label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, City, Postal Code"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Previous School Attended</label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    placeholder="e.g. St. Joseph Higher Secondary"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Previous GPA / Percentage</label>
                  <input
                    type="text"
                    name="previousGPA"
                    value={formData.previousGPA}
                    onChange={handleChange}
                    placeholder="e.g. GPA 5.00 / 92%"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                >
                  Continue to Documents →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h4 className="mt-2 text-sm font-bold text-slate-900">Upload Academic Records / Birth Certificate</h4>
                <p className="text-xs text-slate-500 mt-0.5">Enter a direct document link or cloud URL</p>

                <div className="mt-4 max-w-md mx-auto">
                  <input
                    type="url"
                    name="documentUrl"
                    value={formData.documentUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/my-transcript.pdf"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Review summary box */}
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-800">Application Summary:</p>
                <p>• Student: <span className="font-semibold text-slate-900">{formData.name || "N/A"}</span> ({formData.gender})</p>
                <p>• Target Grade: <span className="font-semibold text-indigo-600">{formData.desiredClass}</span></p>
                <p>• Email: {formData.email || "N/A"} | Phone: {formData.phone || "N/A"}</p>
                <p>• Guardian: {formData.parentName || "N/A"}</p>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
                >
                  {loading ? "Submitting Application..." : "Submit Application for Review ✓"}
                </button>
              </div>
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-xs text-slate-500">
          Already approved?{" "}
          <Link href="/login" className="font-bold text-indigo-600 hover:underline">
            Sign in to your dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
