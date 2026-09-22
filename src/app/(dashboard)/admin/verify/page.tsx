"use client";
import { useState } from "react";

export default function QRVerificationScanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // This triggers automatically when the physical scanner hits "Enter"
  const handleScanSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. SAVE THE FORM REFERENCE IMMEDIATELY
    const form = e.currentTarget;

    const formData = new FormData(form);
    const scannedId = formData.get("scannedId") as string;

    if (!scannedId) return;

    setLoading(true);
    setError("");
    setScanResult(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/verify/${scannedId}`,
      );
      const data = await response.json();

      if (data.success) {
        setScanResult(data.data);
      } else {
        setError(data.message || "Verification Failed.");
      }
    } catch (err) {
      setError("Network error. Is the backend running?");
    }

    setLoading(false);

    // 2. USE THE SAVED REFERENCE HERE
    form.reset();
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Security Kiosk: Scan ID</h1>

      <form onSubmit={handleScanSubmit} className="mb-6">
        {/* autoFocus ensures the scanner types here immediately without clicking */}
        <input
          type="text"
          name="scannedId"
          autoFocus
          placeholder="Awaiting scanner input..."
          className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-blue-500 text-black"
        />
        {/* A hidden submit button allows the scanner's 'Enter' keystroke to trigger the form */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>

      {loading && <p className="text-blue-500 font-medium">Verifying ID...</p>}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg font-bold">
          ❌ {error}
        </div>
      )}

      {scanResult && (
        <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow-sm border border-green-300 text-center">
          <h2 className="text-4xl mb-2">✅</h2>
          <h3 className="text-xl font-bold">{scanResult.name}</h3>
          <p>
            {scanResult.className} - Section {scanResult.section}
          </p>
          <p className="mt-2 text-sm font-medium">Status: Active & Verified</p>
        </div>
      )}
    </div>
  );
}
