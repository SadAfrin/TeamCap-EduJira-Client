"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

type Student = {
  _id?: string;
  studentId: string;
  name: string;
  email?: string;
  phone?: string;
  className: string;
  section: string;
  roll?: string | number;
  gender?: "Male" | "Female" | "Other";
  dateOfBirth?: string;
  bloodGroup?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  address?: string;
  status?: "Active" | "Inactive" | "Graduated";
};

const CLASS_OPTIONS = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10"];
const SECTION_OPTIONS = ["A", "B", "C", "D"];

export default function StudentManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Student>({
    studentId: "",
    name: "",
    email: "",
    phone: "",
    className: "Class 8",
    section: "B",
    roll: "",
    gender: "Male",
    dateOfBirth: "",
    bloodGroup: "A+",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
    status: "Active",
  });

  async function fetchStudents() {
    try {
      setLoading(true);
      const res = await apiGet(`/api/students?className=${selectedClass}&section=${selectedSection}&search=${encodeURIComponent(searchQuery)}`);
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, [selectedClass, selectedSection]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.parentName && s.parentName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [students, searchQuery]);

  function handleOpenAddModal() {
    setEditingStudent(null);
    setFormData({
      studentId: `STD-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      email: "",
      phone: "",
      className: selectedClass !== "All" ? selectedClass : "Class 8",
      section: selectedSection !== "All" ? selectedSection : "A",
      roll: "",
      gender: "Male",
      dateOfBirth: "",
      bloodGroup: "A+",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      address: "",
      status: "Active",
    });
    setIsModalOpen(true);
  }

  function handleOpenEditModal(student: Student) {
    setEditingStudent(student);
    setFormData({ ...student });
    setIsModalOpen(true);
  }

  async function handleSaveStudent(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.studentId || !formData.name || !formData.className || !formData.section) {
      toast.error("Please fill in Student ID, Name, Class, and Section");
      return;
    }

    try {
      setSubmitting(true);
      if (editingStudent) {
        const id = editingStudent._id || editingStudent.studentId;
        const res = await apiPut(`/api/students/${id}`, formData);
        if (res.success) {
          toast.success("Student updated successfully!");
          setIsModalOpen(false);
          fetchStudents();
        }
      } else {
        const res = await apiPost("/api/students", formData);
        if (res.success) {
          toast.success("Student registered successfully!");
          setIsModalOpen(false);
          fetchStudents();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save student");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteStudent(id: string) {
    try {
      const res = await apiDelete(`/api/students/${id}`);
      if (res.success) {
        toast.success("Student removed successfully");
        setDeleteConfirmId(null);
        fetchStudents();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete student");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Student Directory & Admissions</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add, edit, assign class & sections, and manage active student records.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/30 transition-all hover:bg-purple-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by student name, ID, parent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
          />
        </div>

        {/* Class Filter */}
        <div className="sm:col-span-3">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 focus:border-purple-500 focus:bg-white focus:outline-none"
          >
            <option value="All">All Classes</option>
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Section Filter */}
        <div className="sm:col-span-3 flex gap-2">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 focus:border-purple-500 focus:bg-white focus:outline-none"
          >
            <option value="All">All Sections</option>
            {SECTION_OPTIONS.map((s) => (
              <option key={s} value={s}>Section {s}</option>
            ))}
          </select>

          <button
            onClick={fetchStudents}
            className="rounded-xl border border-slate-200 bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
            title="Refresh list"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </div>

      {/* Student List Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Enrolled Students ({filteredStudents.length})
          </p>
          <span className="text-xs text-slate-400">Class & Section Assigned</span>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-purple-600 border-t-transparent" />
              <p className="text-xs text-slate-400">Loading student records...</p>
            </div>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-800">No Students Found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              No students match the selected class, section, or search criteria. Click "Add New Student" to enroll one.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 pl-6 pr-3">Student ID</th>
                  <th className="py-3.5 px-3">Student Name</th>
                  <th className="py-3.5 px-3">Class & Section</th>
                  <th className="py-3.5 px-3">Roll</th>
                  <th className="py-3.5 px-3">Parent Info</th>
                  <th className="py-3.5 px-3">Contact</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.studentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pl-6 pr-3 font-mono font-bold text-purple-700">
                      {student.studentId}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-900">{student.name}</div>
                      <div className="text-[11px] text-slate-400">{student.gender || "Student"}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-100">
                        {student.className} – Sec {student.section}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">
                      #{student.roll || "—"}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-slate-800">{student.parentName || "—"}</div>
                      <div className="text-[11px] text-slate-400">{student.parentPhone || ""}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">
                      <div>{student.email || "—"}</div>
                      <div className="text-[11px]">{student.phone || ""}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          student.status === "Inactive"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {student.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3.5 pr-6 pl-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(student)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-purple-600 transition-colors"
                          title="Edit student"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(student.studentId)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete student"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingStudent ? `Edit Student — ${editingStudent.studentId}` : "Enroll New Student"}
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

            <form onSubmit={handleSaveStudent} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Student ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    disabled={!!editingStudent}
                    placeholder="e.g. STD-801"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 disabled:opacity-60 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahim Uddin"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Assign Class *</label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Assign Section *</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                  >
                    {SECTION_OPTIONS.map((s) => (
                      <option key={s} value={s}>Section {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.roll || ""}
                    onChange={(e) => setFormData({ ...formData, roll: e.target.value })}
                    placeholder="e.g. 1"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Gender</label>
                  <select
                    value={formData.gender || "Male"}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Parent Name</label>
                  <input
                    type="text"
                    value={formData.parentName || ""}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Tariqul Islam"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Parent Phone</label>
                  <input
                    type="text"
                    value={formData.parentPhone || ""}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="e.g. +880 1711-998877"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
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
                  className="rounded-xl bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-purple-600/30 hover:bg-purple-500 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingStudent ? "Update Student" : "Save Student"}
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
              Are you sure you want to remove student <span className="font-bold text-slate-800">{deleteConfirmId}</span>? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStudent(deleteConfirmId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
