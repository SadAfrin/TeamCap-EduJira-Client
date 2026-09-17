"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

type Teacher = {
  _id?: string;
  teacherId: string;
  name: string;
  email: string;
  phone?: string;
  designation?: string;
  qualification?: string;
  gender?: "Male" | "Female" | "Other";
  subjectsAssigned: string[];
  classesAssigned: string[];
  joiningDate?: string;
  status?: "Active" | "On Leave" | "Resigned";
};

const AVAILABLE_SUBJECTS = ["Mathematics", "Higher Math", "English", "General Science", "Physics", "Chemistry", "Biology", "Bangla", "ICT", "Social Science"];
const AVAILABLE_CLASSES = ["Class 6-A", "Class 6-B", "Class 7-A", "Class 7-B", "Class 8-A", "Class 8-B", "Class 8-C", "Class 9-A", "Class 9-B", "Class 10-A", "Class 10-B"];

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Teacher>({
    teacherId: "",
    name: "",
    email: "",
    phone: "",
    designation: "Assistant Teacher",
    qualification: "",
    gender: "Male",
    subjectsAssigned: [],
    classesAssigned: [],
    joiningDate: "",
    status: "Active",
  });

  async function fetchTeachers() {
    try {
      setLoading(true);
      const res = await apiGet(`/api/teachers?status=${statusFilter}&search=${encodeURIComponent(searchQuery)}`);
      if (res.success) {
        setTeachers(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeachers();
  }, [statusFilter]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.teacherId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.designation && t.designation.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [teachers, searchQuery]);

  function handleOpenAddModal() {
    setEditingTeacher(null);
    setFormData({
      teacherId: `TCH-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      email: "",
      phone: "",
      designation: "Assistant Teacher",
      qualification: "",
      gender: "Male",
      subjectsAssigned: ["Mathematics"],
      classesAssigned: ["Class 8-A"],
      joiningDate: new Date().toISOString().split("T")[0],
      status: "Active",
    });
    setIsModalOpen(true);
  }

  function handleOpenEditModal(teacher: Teacher) {
    setEditingTeacher(teacher);
    setFormData({ ...teacher });
    setIsModalOpen(true);
  }

  function toggleSubject(sub: string) {
    const list = formData.subjectsAssigned || [];
    if (list.includes(sub)) {
      setFormData({ ...formData, subjectsAssigned: list.filter((s) => s !== sub) });
    } else {
      setFormData({ ...formData, subjectsAssigned: [...list, sub] });
    }
  }

  function toggleClass(cls: string) {
    const list = formData.classesAssigned || [];
    if (list.includes(cls)) {
      setFormData({ ...formData, classesAssigned: list.filter((c) => c !== cls) });
    } else {
      setFormData({ ...formData, classesAssigned: [...list, cls] });
    }
  }

  async function handleSaveTeacher(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.teacherId || !formData.name || !formData.email) {
      toast.error("Please fill in Teacher ID, Name, and Email");
      return;
    }

    try {
      setSubmitting(true);
      if (editingTeacher) {
        const id = editingTeacher._id || editingTeacher.teacherId;
        const res = await apiPut(`/api/teachers/${id}`, formData);
        if (res.success) {
          toast.success("Teacher updated successfully!");
          setIsModalOpen(false);
          fetchTeachers();
        }
      } else {
        const res = await apiPost("/api/teachers", formData);
        if (res.success) {
          toast.success("Teacher created successfully!");
          setIsModalOpen(false);
          fetchTeachers();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save teacher");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTeacher(id: string) {
    try {
      const res = await apiDelete(`/api/teachers/${id}`);
      if (res.success) {
        toast.success("Teacher removed successfully");
        setDeleteConfirmId(null);
        fetchTeachers();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete teacher");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Faculty & Teacher Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add teachers, assign subjects and classrooms, and track academic workload.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition-all hover:bg-blue-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="sm:col-span-8 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search teachers by name, ID, email, or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="sm:col-span-4 flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Faculty</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>

          <button
            onClick={fetchTeachers}
            className="rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
            title="Refresh list"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>

      {/* Teachers Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
            <p className="text-xs text-slate-400">Loading faculty list...</p>
          </div>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <h3 className="text-sm font-bold text-slate-800">No Teachers Found</h3>
          <p className="mt-1 text-xs text-slate-500">No teachers matched your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.teacherId}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-blue-200"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-base border border-blue-100">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{teacher.name}</h3>
                      <p className="text-xs font-semibold text-blue-600">{teacher.designation || "Faculty"}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      teacher.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {teacher.status || "Active"}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400">ID:</span>
                    <span className="font-mono font-bold text-slate-700">{teacher.teacherId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Email:</span>
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  {teacher.qualification && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Edu:</span>
                      <span className="truncate">{teacher.qualification}</span>
                    </div>
                  )}
                </div>

                {/* Assigned Subjects */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Subjects</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {teacher.subjectsAssigned && teacher.subjectsAssigned.length > 0 ? (
                      teacher.subjectsAssigned.map((sub) => (
                        <span key={sub} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None assigned</span>
                    )}
                  </div>
                </div>

                {/* Assigned Classes */}
                <div className="mt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Classes</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {teacher.classesAssigned && teacher.classesAssigned.length > 0 ? (
                      teacher.classesAssigned.map((cls) => (
                        <span key={cls} className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-100">
                          {cls}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None assigned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] text-slate-400">Since {teacher.joiningDate || "—"}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(teacher)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(teacher.teacherId)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    title="Delete teacher"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingTeacher ? `Edit Faculty — ${editingTeacher.name}` : "Add New Faculty Member"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveTeacher} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Teacher ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    disabled={!!editingTeacher}
                    placeholder="e.g. TCH-101"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 disabled:opacity-60 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Anisur Rahman"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. teacher@edujira.edu"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +880 1711-223344"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation || ""}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Senior Science Teacher"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification || ""}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    placeholder="e.g. M.Sc in Physics, DU"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Assign Subjects */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Assign Subjects (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {AVAILABLE_SUBJECTS.map((sub) => {
                    const isSelected = formData.subjectsAssigned?.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => toggleSubject(sub)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {isSelected ? `✓ ${sub}` : `+ ${sub}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assign Classes */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Assign Classes & Sections (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                  {AVAILABLE_CLASSES.map((cls) => {
                    const isSelected = formData.classesAssigned?.includes(cls);
                    return (
                      <button
                        type="button"
                        key={cls}
                        onClick={() => toggleClass(cls)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {isSelected ? `✓ ${cls}` : `+ ${cls}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 hover:bg-blue-500 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingTeacher ? "Update Faculty" : "Save Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="mt-2 text-xs text-slate-500">
              Are you sure you want to remove teacher <span className="font-bold text-slate-800">{deleteConfirmId}</span>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTeacher(deleteConfirmId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Delete Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
