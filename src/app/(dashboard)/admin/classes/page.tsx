"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";

type ClassItem = {
  _id?: string;
  className: string;
  gradeLevel?: number;
  sections: string[];
  subjects: string[];
  classTeacher?: string;
  roomNumber?: string;
  capacity?: number;
  totalStudents?: number;
  sectionCounts?: Record<string, number>;
  description?: string;
};

type SubjectItem = {
  _id?: string;
  subjectCode: string;
  name: string;
  className: string;
  type?: "Core" | "Elective" | "Optional";
  credits?: number;
  teacherName?: string;
  description?: string;
};

export default function ClassAndSubjectManagementPage() {
  const [activeTab, setActiveTab] = useState<"classes" | "subjects">("classes");

  // Data states
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Class Modal States
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [deleteClassId, setDeleteClassId] = useState<string | null>(null);

  // Subject Modal States
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [deleteSubjectId, setDeleteSubjectId] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  // Class Form State
  const [classForm, setClassForm] = useState<ClassItem>({
    className: "",
    gradeLevel: 8,
    sections: ["A", "B"],
    subjects: [],
    classTeacher: "",
    roomNumber: "",
    capacity: 40,
    description: "",
  });
  const [sectionInput, setSectionInput] = useState("");

  // Subject Form State
  const [subjectForm, setSubjectForm] = useState<SubjectItem>({
    subjectCode: "",
    name: "",
    className: "Class 8",
    type: "Core",
    credits: 3,
    teacherName: "",
    description: "",
  });

  async function loadData() {
    try {
      setLoading(true);
      const [resClasses, resSubjects] = await Promise.all([
        apiGet("/api/classes"),
        apiGet("/api/subjects"),
      ]);
      if (resClasses.success) setClasses(resClasses.data);
      if (resSubjects.success) setSubjects(resSubjects.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load academic data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Class Actions
  function handleOpenAddClass() {
    setEditingClass(null);
    setClassForm({
      className: "",
      gradeLevel: 8,
      sections: ["A", "B"],
      subjects: [],
      classTeacher: "",
      roomNumber: `Room ${Math.floor(100 + Math.random() * 300)}`,
      capacity: 40,
      description: "",
    });
    setSectionInput("");
    setIsClassModalOpen(true);
  }

  function handleOpenEditClass(cls: ClassItem) {
    setEditingClass(cls);
    setClassForm({ ...cls });
    setSectionInput("");
    setIsClassModalOpen(true);
  }

  function addSectionToForm() {
    if (!sectionInput.trim()) return;
    const sec = sectionInput.trim().toUpperCase();
    if (!classForm.sections.includes(sec)) {
      setClassForm({ ...classForm, sections: [...classForm.sections, sec] });
      setSectionInput("");
    }
  }

  function removeSectionFromForm(sec: string) {
    setClassForm({ ...classForm, sections: classForm.sections.filter((s) => s !== sec) });
  }

  async function handleSaveClass(e: React.FormEvent) {
    e.preventDefault();
    if (!classForm.className) {
      toast.error("Class Name is required");
      return;
    }

    try {
      setSubmitting(true);
      if (editingClass) {
        const id = editingClass._id || editingClass.className;
        const res = await apiPut(`/api/classes/${id}`, classForm);
        if (res.success) {
          toast.success("Class updated successfully!");
          setIsClassModalOpen(false);
          loadData();
        }
      } else {
        const res = await apiPost("/api/classes", classForm);
        if (res.success) {
          toast.success("Class created successfully!");
          setIsClassModalOpen(false);
          loadData();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save class");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteClass(id: string) {
    try {
      const res = await apiDelete(`/api/classes/${id}`);
      if (res.success) {
        toast.success("Class deleted successfully");
        setDeleteClassId(null);
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete class");
    }
  }

  // Subject Actions
  function handleOpenAddSubject() {
    setEditingSubject(null);
    setSubjectForm({
      subjectCode: `SUB-${Math.floor(10 + Math.random() * 90)}`,
      name: "",
      className: classes.length > 0 ? classes[0].className : "Class 8",
      type: "Core",
      credits: 3,
      teacherName: "",
      description: "",
    });
    setIsSubjectModalOpen(true);
  }

  function handleOpenEditSubject(sub: SubjectItem) {
    setEditingSubject(sub);
    setSubjectForm({ ...sub });
    setIsSubjectModalOpen(true);
  }

  async function handleSaveSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!subjectForm.subjectCode || !subjectForm.name || !subjectForm.className) {
      toast.error("Subject Code, Name, and Class are required");
      return;
    }

    try {
      setSubmitting(true);
      if (editingSubject) {
        const id = editingSubject._id || editingSubject.subjectCode;
        const res = await apiPut(`/api/subjects/${id}`, subjectForm);
        if (res.success) {
          toast.success("Subject updated successfully!");
          setIsSubjectModalOpen(false);
          loadData();
        }
      } else {
        const res = await apiPost("/api/subjects", subjectForm);
        if (res.success) {
          toast.success("Subject created successfully!");
          setIsSubjectModalOpen(false);
          loadData();
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save subject");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteSubject(id: string) {
    try {
      const res = await apiDelete(`/api/subjects/${id}`);
      if (res.success) {
        toast.success("Subject removed successfully");
        setDeleteSubjectId(null);
        loadData();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete subject");
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Classes & Subjects</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure classes, sections, course curricula, and assign subjects to classes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "classes" ? (
            <button
              onClick={handleOpenAddClass}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Create New Class</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddSubject}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all hover:bg-indigo-500"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add Subject</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("classes")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-all ${
            activeTab === "classes"
              ? "border-emerald-600 text-emerald-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <span>Classes & Sections ({classes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("subjects")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-bold transition-all ${
            activeTab === "subjects"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
          </svg>
          <span>Subjects & Curriculum ({subjects.length})</span>
        </button>
      </div>

      {/* Tab 1: Classes & Sections View */}
      {activeTab === "classes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {classes.map((cls) => (
            <div
              key={cls.className}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:shadow-md hover:border-emerald-200"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-base border border-emerald-100">
                      {cls.gradeLevel || cls.className.replace(/\D/g, "")}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{cls.className}</h3>
                      <p className="text-xs text-slate-500">{cls.roomNumber || "Classroom"}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    {cls.totalStudents ?? 0} Students
                  </span>
                </div>

                {/* Class Teacher */}
                <div className="mt-4 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-700">
                  <span className="font-bold text-slate-400 uppercase text-[10px] block">Class Teacher</span>
                  <span className="font-semibold text-slate-900">{cls.classTeacher || "Not Assigned"}</span>
                </div>

                {/* Sections */}
                <div className="mt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sections</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {cls.sections.map((sec) => (
                      <span key={sec} className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-800 border border-slate-200 shadow-2xs">
                        Sec {sec} ({cls.sectionCounts?.[sec] ?? 0})
                      </span>
                    ))}
                  </div>
                </div>

                {/* Subjects Assigned to this class */}
                <div className="mt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Subjects</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {cls.subjects && cls.subjects.length > 0 ? (
                      cls.subjects.slice(0, 4).map((sub) => (
                        <span key={sub} className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                          {sub}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No subjects mapped</span>
                    )}
                    {cls.subjects && cls.subjects.length > 4 && (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                        +{cls.subjects.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => handleOpenEditClass(cls)}
                  className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Edit Class
                </button>
                <button
                  onClick={() => setDeleteClassId(cls.className)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  title="Delete class"
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

      {/* Tab 2: Subjects & Curriculum View */}
      {activeTab === "subjects" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 pl-6 pr-3">Subject Code</th>
                  <th className="py-3.5 px-3">Subject Name</th>
                  <th className="py-3.5 px-3">Belongs to Class</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Credits</th>
                  <th className="py-3.5 px-3">Subject Teacher</th>
                  <th className="py-3.5 pr-6 pl-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub) => (
                  <tr key={sub.subjectCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pl-6 pr-3 font-mono font-bold text-indigo-600">{sub.subjectCode}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900">{sub.name}</td>
                    <td className="py-3.5 px-3">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                        {sub.className}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          sub.type === "Elective"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {sub.type || "Core"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700">{sub.credits || 3} Credits</td>
                    <td className="py-3.5 px-3 text-slate-600">{sub.teacherName || "Not assigned"}</td>
                    <td className="py-3.5 pr-6 pl-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditSubject(sub)}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteSubjectId(sub.subjectCode)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
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
        </div>
      )}

      {/* Class Modal */}
      {isClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">
              {editingClass ? `Edit Class — ${editingClass.className}` : "Create New Class"}
            </h2>

            <form onSubmit={handleSaveClass} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Class Name *</label>
                <input
                  type="text"
                  required
                  value={classForm.className}
                  onChange={(e) => setClassForm({ ...classForm, className: e.target.value })}
                  placeholder="e.g. Class 11"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Sections</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sectionInput}
                    onChange={(e) => setSectionInput(e.target.value)}
                    placeholder="e.g. C"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addSectionToForm}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"
                  >
                    Add
                  </button>
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {classForm.sections.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                      <span>Sec {s}</span>
                      <button type="button" onClick={() => removeSectionFromForm(s)} className="text-emerald-500 hover:text-red-600">×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Class Teacher</label>
                  <input
                    type="text"
                    value={classForm.classTeacher || ""}
                    onChange={(e) => setClassForm({ ...classForm, classTeacher: e.target.value })}
                    placeholder="e.g. Dr. Anisur Rahman"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Room Number</label>
                  <input
                    type="text"
                    value={classForm.roomNumber || ""}
                    onChange={(e) => setClassForm({ ...classForm, roomNumber: e.target.value })}
                    placeholder="e.g. Room 204"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsClassModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500"
                >
                  {submitting ? "Saving..." : editingClass ? "Update Class" : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {isSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">
              {editingSubject ? `Edit Subject — ${editingSubject.name}` : "Add New Subject"}
            </h2>

            <form onSubmit={handleSaveSubject} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Subject Code *</label>
                  <input
                    type="text"
                    required
                    value={subjectForm.subjectCode}
                    onChange={(e) => setSubjectForm({ ...subjectForm, subjectCode: e.target.value })}
                    disabled={!!editingSubject}
                    placeholder="e.g. MATH-08"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 disabled:opacity-60 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Belongs to Class *</label>
                  <select
                    value={subjectForm.className}
                    onChange={(e) => setSubjectForm({ ...subjectForm, className: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  >
                    {classes.map((c) => (
                      <option key={c.className} value={c.className}>{c.className}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Type</label>
                  <select
                    value={subjectForm.type || "Core"}
                    onChange={(e) => setSubjectForm({ ...subjectForm, type: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  >
                    <option value="Core">Core Subject</option>
                    <option value="Elective">Elective</option>
                    <option value="Optional">Optional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Credit Hours</label>
                  <input
                    type="number"
                    value={subjectForm.credits || 3}
                    onChange={(e) => setSubjectForm({ ...subjectForm, credits: parseInt(e.target.value, 10) || 3 })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Subject Teacher</label>
                  <input
                    type="text"
                    value={subjectForm.teacherName || ""}
                    onChange={(e) => setSubjectForm({ ...subjectForm, teacherName: e.target.value })}
                    placeholder="e.g. Mohammad Rafiq"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsSubjectModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500"
                >
                  {submitting ? "Saving..." : editingSubject ? "Update Subject" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {(deleteClassId || deleteSubjectId) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
            <p className="mt-2 text-xs text-slate-500">
              Are you sure you want to delete <span className="font-bold text-slate-800">{deleteClassId || deleteSubjectId}</span>?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => { setDeleteClassId(null); setDeleteSubjectId(null); }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteClassId) handleDeleteClass(deleteClassId);
                  if (deleteSubjectId) handleDeleteSubject(deleteSubjectId);
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
