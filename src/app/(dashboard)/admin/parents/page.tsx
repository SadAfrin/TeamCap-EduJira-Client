"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

type LinkedChild = {
  studentId: string;
  studentName: string;
  className: string;
  section: string;
  relationship?: string;
};

type Parent = {
  _id?: string;
  parentId: string;
  name: string;
  email: string;
  phone?: string;
  occupation?: string;
  address?: string;
  children: LinkedChild[];
  status?: "Active" | "Inactive";
};

type StudentOption = {
  studentId: string;
  name: string;
  className: string;
  section: string;
};

export default function ParentManagementPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [studentsList, setStudentsList] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [linkChildParent, setLinkChildParent] = useState<Parent | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Parent>({
    parentId: "",
    name: "",
    email: "",
    phone: "",
    occupation: "",
    address: "",
    children: [],
    status: "Active",
  });

  // Link Child Form State
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [childRelationship, setChildRelationship] = useState("Father");

  async function fetchParents() {
    try {
      setLoading(true);
      const res = await apiGet(`/api/parents?search=${encodeURIComponent(searchQuery)}`);
      if (res.success) {
        setParents(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load parents");
    } finally {
      setLoading(false);
    }
  }

  async function fetchStudents() {
    try {
      const res = await apiGet("/api/students");
      if (res.success) {
        setStudentsList(res.data);
      }
    } catch (err) {
      console.error("Failed to load students for linking:", err);
    }
  }

  useEffect(() => {
    fetchParents();
    fetchStudents();
  }, []);

  const filteredParents = useMemo(() => {
    return parents.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.parentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.occupation && p.occupation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.children.some((c) => c.studentName.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  }, [parents, searchQuery]);

  function handleOpenAddModal() {
    setEditingParent(null);
    setFormData({
      parentId: `PAR-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      email: "",
      phone: "",
      occupation: "",
      address: "",
      children: [],
      status: "Active",
    });
    setIsModalOpen(true);
  }

  function handleOpenEditModal(parent: Parent) {
    setEditingParent(parent);
    setFormData({ ...parent });
    setIsModalOpen(true);
  }

  function handleOpenLinkChildModal(parent: Parent) {
    setLinkChildParent(parent);
    if (studentsList.length > 0) {
      setSelectedStudentId(studentsList[0].studentId);
    }
    setChildRelationship("Father");
  }

  async function handleSaveParent(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.parentId || !formData.name || !formData.email) {
      toast.error("Please fill in Parent ID, Name, and Email");
      return;
    }

    try {
      setSubmitting(true);
      if (editingParent) {
        const id = editingParent._id || editingParent.parentId;
        const res = await apiPut(`/api/parents/${id}`, formData);
        if (res.success) {
          toast.success("Parent updated successfully!");
          setIsModalOpen(false);
          fetchParents();
        }
      } else {
        const res = await apiPost("/api/parents", formData);
        if (res.success) {
          toast.success("Parent registered successfully!");
          setIsModalOpen(false);
          fetchParents();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save parent");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLinkChildSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!linkChildParent || !selectedStudentId) {
      toast.error("Please select a student to link");
      return;
    }

    try {
      setSubmitting(true);
      const id = linkChildParent._id || linkChildParent.parentId;
      const res = await apiPost(`/api/parents/${id}/link-child`, {
        studentId: selectedStudentId,
        relationship: childRelationship,
      });

      if (res.success) {
        toast.success("Child linked to parent profile successfully!");
        setLinkChildParent(null);
        fetchParents();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to link child");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteParent(id: string) {
    try {
      const res = await apiDelete(`/api/parents/${id}`);
      if (res.success) {
        toast.success("Parent removed successfully");
        setDeleteConfirmId(null);
        fetchParents();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete parent");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Guardian & Parent Directory</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add parents, maintain guardian contacts, and link students to parent portal profiles.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-600/30 transition-all hover:bg-amber-500"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add New Parent</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by parent name, ID, phone, occupation, or child name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Parents Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-amber-600 border-t-transparent" />
            <p className="text-xs text-slate-400">Loading parent directory...</p>
          </div>
        </div>
      ) : filteredParents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <h3 className="text-sm font-bold text-slate-800">No Parents Found</h3>
          <p className="mt-1 text-xs text-slate-500">Register a parent and link them with students.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredParents.map((parent) => (
            <div
              key={parent.parentId}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-amber-200"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700 font-bold text-base border border-amber-100">
                      {parent.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{parent.name}</h3>
                      <p className="text-xs font-medium text-slate-500">{parent.occupation || "Guardian"}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    {parent.status || "Active"}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-slate-400">ID:</span>
                    <span className="font-mono font-bold text-slate-700">{parent.parentId}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Email:</span>
                    <span className="truncate">{parent.email}</span>
                  </div>
                  {parent.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Phone:</span>
                      <span>{parent.phone}</span>
                    </div>
                  )}
                  {parent.address && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Address:</span>
                      <span className="truncate">{parent.address}</span>
                    </div>
                  )}
                </div>

                {/* Linked Children */}
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Linked Children</p>
                    <button
                      onClick={() => handleOpenLinkChildModal(parent)}
                      className="text-[11px] font-bold text-amber-600 hover:text-amber-700"
                    >
                      + Link Child
                    </button>
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {parent.children && parent.children.length > 0 ? (
                      parent.children.map((child) => (
                        <div
                          key={child.studentId}
                          className="flex items-center justify-between rounded-xl bg-amber-50/50 p-2 text-xs border border-amber-100"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{child.studentName}</span>
                            <span className="ml-1.5 font-mono text-[10px] text-slate-400">({child.studentId})</span>
                          </div>
                          <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                            {child.className} - {child.section}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No student linked yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleOpenEditModal(parent)}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirmId(parent.parentId)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete parent"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Parent Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                {editingParent ? `Edit Parent Info — ${editingParent.name}` : "Register Parent Profile"}
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

            <form onSubmit={handleSaveParent} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Parent ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    disabled={!!editingParent}
                    placeholder="e.g. PAR-101"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 disabled:opacity-60 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tariqul Islam"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. parent@edujira.edu"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +880 1711-998877"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Occupation</label>
                <input
                  type="text"
                  value={formData.occupation || ""}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g. Civil Engineer / Doctor"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Dhanmondi, Dhaka"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
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
                  className="rounded-xl bg-amber-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-amber-600/30 hover:bg-amber-500 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingParent ? "Update Parent" : "Register Parent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Child Modal */}
      {linkChildParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">
              Link Child to {linkChildParent.name}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Select a student to attach to this parent's portal dashboard.
            </p>

            <form onSubmit={handleLinkChildSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Select Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                >
                  {studentsList.map((st) => (
                    <option key={st.studentId} value={st.studentId}>
                      {st.name} ({st.studentId} – {st.className} {st.section})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Relationship</label>
                <select
                  value={childRelationship}
                  onChange={(e) => setChildRelationship(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none"
                >
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setLinkChildParent(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-amber-600/30 hover:bg-amber-500"
                >
                  {submitting ? "Linking..." : "Confirm Link"}
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
              Are you sure you want to remove parent <span className="font-bold text-slate-800">{deleteConfirmId}</span>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteParent(deleteConfirmId)}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Delete Parent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
