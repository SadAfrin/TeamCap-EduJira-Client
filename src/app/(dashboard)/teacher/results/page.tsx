"use client";

import { useState } from "react";

// Types based on your backend models
interface Student {
  _id: string;
  name: string;
  studentId: string;
  className: string;
  section: string;
}

export default function TeacherResultsPage() {
  const [className, setClassName] = useState("Class 10");
  const [section, setSection] = useState("A");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Marks State
  const [marks, setMarks] = useState({
    Bangla: "",
    English: "",
    Math: "",
    Science: "",
  });

  // 1. Fetch Students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/students?className=${className}&section=${section}`,
      );
      const result = await response.json();
      if (result.success) {
        setStudents(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
    setLoading(false);
  };

  // 2. Open Modal for a specific student
  const handleOpenModal = (studentId: string, name: string) => {
    setSelectedStudent({ id: studentId, name });
    setMarks({ Bangla: "", English: "", Math: "", Science: "" }); // Reset form
    setIsModalOpen(true);
  };

  // 3. Submit Marks to Backend Calculation Engine
  const handleSubmitMarks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setSubmitting(true);

    const payload = {
      studentId: selectedStudent.id,
      term: "Midterm 2026",
      rawSubjects: [
        { name: "Bangla", marks: Number(marks.Bangla), max: 100 },
        { name: "English", marks: Number(marks.English), max: 100 },
        { name: "Math", marks: Number(marks.Math), max: 100 },
        { name: "Science", marks: Number(marks.Science), max: 100 },
      ],
    };

    try {
      const response = await fetch("http://localhost:5000/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        alert(
          `Successfully saved results for ${selectedStudent.name}! Final GPA: ${result.data.summary.finalGPA}`,
        );
        setIsModalOpen(false);
      } else {
        alert("Failed to save result.");
      }
    } catch (error) {
      console.error("Error submitting result:", error);
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Result & Grade Management</h1>

      {/* Class and Section Selectors */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select
            className="border rounded p-2 bg-white text-black"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          >
            <option value="Class 10">Class 10</option>
            <option value="Class 9">Class 9</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Section</label>
          <select
            className="border rounded p-2 bg-white text-black"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
        </div>

        <button
          onClick={fetchStudents}
          className="self-end bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Fetching..." : "Fetch Students"}
        </button>
      </div>

      {/* Student List Table */}
      <div className="border rounded shadow-sm bg-white overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-black">
              <th className="p-3">Name</th>
              <th className="p-3">Student ID</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-500">
                  Select a class and section, then click &quot;Fetch
                  Students&quot;.
                </td>
              </tr>
            )}
            {students.map((student) => (
              <tr
                key={student._id}
                className="border-b hover:bg-gray-50 text-black"
              >
                <td className="p-3 font-medium">{student.name}</td>
                <td className="p-3 text-xs text-gray-500">
                  {student.studentId}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() =>
                      handleOpenModal(student.studentId, student.name)
                    }
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                  >
                    Enter Marks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pop-up Modal for Entering Marks */}
      {isModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black">
            <h2 className="text-xl font-bold mb-4">
              Enter Marks for {selectedStudent.name}
            </h2>

            <form onSubmit={handleSubmitMarks} className="space-y-4">
              {Object.keys(marks).map((subject) => (
                <div
                  key={subject}
                  className="flex justify-between items-center"
                >
                  <label className="font-medium">{subject}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="border rounded p-1 w-24 text-center"
                    value={marks[subject as keyof typeof marks]}
                    onChange={(e) =>
                      setMarks({ ...marks, [subject]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Marks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
