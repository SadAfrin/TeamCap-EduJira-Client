"use client";
import QRCode from "react-qr-code";

interface StudentProps {
  name: string;
  studentId: string;
  className: string;
}

export default function StudentIdCard({
  name,
  studentId,
  className,
}: StudentProps) {
  return (
    <div className="w-80 border-2 border-blue-600 rounded-xl shadow-lg p-6 bg-white text-center flex flex-col items-center">
      <h2 className="text-xl font-bold text-gray-800">EduJira Digital ID</h2>
      <p className="text-sm text-gray-500 mb-6">{className}</p>

      {/* This automatically generates the scannable image */}
      <div className="bg-white p-2 rounded-lg shadow-sm border">
        <QRCode value={studentId} size={150} />
      </div>

      <h3 className="mt-6 font-semibold text-lg text-gray-800">{name}</h3>
      <p className="text-xs text-gray-400 mt-1">ID: {studentId}</p>
    </div>
  );
}
