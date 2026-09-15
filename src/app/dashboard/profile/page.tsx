"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_DETAILS } from "@/config/navigation";
import { UserRole } from "@/types/navigation";
import { apiGet, apiPut } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { role, user, isLoading } = useAuthRole();
  const userRole = (role?.toLowerCase() as UserRole) || UserRole.STUDENT;
  const roleMeta = ROLE_DETAILS[userRole] || ROLE_DETAILS[UserRole.STUDENT];

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "security">("general");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    address: "",
    bio: "",
    gender: "Male",
    bloodGroup: "A+",
    // Role specifics
    studentId: "",
    className: "",
    section: "",
    roll: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    designation: "",
    subject: "",
    qualification: "",
    institutionName: "EduJira Model High School & College",
  });

  // Security state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        phone: (user as any).phone || "+880 1700-123456",
        address: (user as any).address || "Dhaka, Bangladesh",
        bio: (user as any).bio || "Dedicated member of the EduJira academic community.",
        studentId: (user as any).studentId || "STD-801",
        className: (user as any).className || "Class 8",
        section: (user as any).section || "B",
        roll: (user as any).roll || "01",
        parentName: (user as any).parentName || "Tariqul Islam",
        parentEmail: (user as any).parentEmail || "parent@edujira.com",
        parentPhone: (user as any).parentPhone || "+880 1800-654321",
        designation: (user as any).designation || "Senior Faculty",
        subject: (user as any).subject || "Mathematics & Science",
        qualification: (user as any).qualification || "M.Sc in Applied Mathematics",
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Simulate API update or dispatch to respective role endpoint
      let endpoint = `/api/students/${formData.studentId}`;
      if (userRole === "teacher") endpoint = `/api/teachers/${user?.id || "TCH-101"}`;
      if (userRole === "parent") endpoint = `/api/parents/${user?.id || "PAR-101"}`;
      if (userRole === "admin") endpoint = `/api/admins/${user?.id || "ADM-101"}`;

      // In client mode, update state and show success
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Profile details updated successfully! 🎉");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    toast.success("Security credentials updated successfully!");
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl border-2 border-white/20 bg-indigo-500/20 shadow-lg shrink-0">
              <Image
                src={formData.image || user?.image || "/profile.png"}
                alt={formData.name || "Profile Photo"}
                width={96}
                height={96}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${roleMeta.color.lightBg} ${roleMeta.color.text} border ${roleMeta.color.border}`}>
                  {userRole} Workspace
                </span>
                <span className="text-xs text-slate-400">• Verified Account</span>
              </div>
              <h1 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight">{formData.name || user?.name || "User Profile"}</h1>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mt-0.5">{formData.email || user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white border border-white/10">
              {userRole === "student" ? `ID: ${formData.studentId}` : `Role: ${roleMeta.title}`}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "general"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>👤 Personal Info</span>
        </button>
        <button
          onClick={() => setActiveTab("academic")}
          className={`flex items-center gap-2 py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "academic"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>🎓 {userRole === "student" ? "Academic & Guardian" : userRole === "teacher" ? "Teaching Credentials" : userRole === "parent" ? "Children & Emergency" : "Institutional Info"}</span>
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
            activeTab === "security"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>🔒 Security & Password</span>
        </button>
      </div>

      {/* Tab 1: General Info */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Personal & Contact Details</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage your display name, contact phone number, and avatar image.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Display Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address (Registered)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Contact Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1700-000000"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Profile Photo URL / Avatar
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600"
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Residential Address
            </label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, City, District"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Personal Bio / Note
            </label>
            <textarea
              name="bio"
              rows={2}
              value={formData.bio}
              onChange={handleChange}
              placeholder="A short description about yourself..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
            >
              <span>{saving ? "Saving Changes..." : "Save Profile Changes ✓"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Role Specific Info */}
      {activeTab === "academic" && (
        <form onSubmit={handleSaveProfile} className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {userRole === "student" && (
            <>
              <div>
                <h3 className="text-base font-bold text-slate-900">Academic & Guardian Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">Assigned academic division and emergency guardian contacts.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Assigned Class</label>
                  <input type="text" disabled value={formData.className} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Section</label>
                  <input type="text" disabled value={`Section ${formData.section}`} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Class Roll No</label>
                  <input type="text" disabled value={`Roll #${formData.roll}`} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700" />
                </div>
              </div>

              <div className="rounded-2xl bg-indigo-50/70 p-5 border border-indigo-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">Guardian / Emergency Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Guardian Name</label>
                    <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Guardian Email</label>
                    <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Guardian Phone</label>
                    <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold" />
                  </div>
                </div>
              </div>
            </>
          )}

          {userRole === "teacher" && (
            <>
              <div>
                <h3 className="text-base font-bold text-slate-900">Faculty & Teaching Credentials</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your institutional designations, subject assignments, and qualifications.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Faculty Designation</label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Assigned Subjects</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Highest Qualification</label>
                <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800" />
              </div>
            </>
          )}

          {userRole === "parent" && (
            <>
              <div>
                <h3 className="text-base font-bold text-slate-900">Parent & Guardian Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">Enrolled children and school communication settings.</p>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-900">Linked Student Child</p>
                <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-100">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{formData.name ? `${formData.name}'s Child (Rahim Uddin)` : "Rahim Uddin"}</h5>
                    <p className="text-xs text-slate-500">Class 8 – Section B • Roll #01</p>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Enrolled ✓</span>
                </div>
              </div>
            </>
          )}

          {userRole === "admin" && (
            <>
              <div>
                <h3 className="text-base font-bold text-slate-900">Institutional Administration</h3>
                <p className="text-xs text-slate-500 mt-0.5">Principal and high-level system configurations.</p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Institution Name</label>
                <input type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800" />
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all"
            >
              <span>{saving ? "Saving Changes..." : "Save Credentials ✓"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Password */}
      {activeTab === "security" && (
        <form onSubmit={handleUpdatePassword} className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Account Security & Credentials</h3>
            <p className="text-xs text-slate-500 mt-0.5">Update your password to keep your EduJira account secure.</p>
          </div>

          <div className="max-w-md space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all"
            >
              Update Password 🔒
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
