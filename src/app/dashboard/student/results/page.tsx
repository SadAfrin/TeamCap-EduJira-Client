"use client";

export default function StudentResultsPage() {
  const results = [
    { code: "MTH-08", subject: "Mathematics", marks: 92, grade: "A+", gpa: 5.0, remarks: "Outstanding" },
    { code: "ENG-08", subject: "English Literature", marks: 86, grade: "A", gpa: 4.0, remarks: "Very Good" },
    { code: "SCI-08", subject: "General Science", marks: 90, grade: "A+", gpa: 5.0, remarks: "Excellent Problem Solving" },
    { code: "ICT-08", subject: "ICT & Computing", marks: 95, grade: "A+", gpa: 5.0, remarks: "Flawless practicals" },
    { code: "BGS-08", subject: "Bangladesh & Global Studies", marks: 84, grade: "A", gpa: 4.0, remarks: "Good conceptual depth" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-b border-slate-200/80 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Academic Transcripts & Term Results</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Official grades, subject credits, and GPA transcripts for Grade 8.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-900 to-teal-900 p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-emerald-300">Term 1 Cumulative GPA</span>
            <div className="mt-2 text-4xl font-extrabold">4.85 / 5.00</div>
            <p className="mt-1 text-xs text-emerald-200">Letter Grade: A+ (Distinction Merit)</p>
          </div>
          <button className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white border border-white/20 hover:bg-white/20">
            Download PDF Transcript
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 pl-6 pr-3">Subject Code</th>
                <th className="py-3.5 px-3">Subject Name</th>
                <th className="py-3.5 px-3">Marks Obtained (100)</th>
                <th className="py-3.5 px-3">Grade Point</th>
                <th className="py-3.5 px-3">Grade</th>
                <th className="py-3.5 pr-6 pl-3">Evaluation Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.code} className="hover:bg-slate-50/70">
                  <td className="py-3.5 pl-6 pr-3 font-mono font-bold text-emerald-700">{r.code}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-900">{r.subject}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-800">{r.marks}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-700">{r.gpa.toFixed(2)}</td>
                  <td className="py-3.5 px-3">
                    <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      {r.grade}
                    </span>
                  </td>
                  <td className="py-3.5 pr-6 pl-3 text-slate-600">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
