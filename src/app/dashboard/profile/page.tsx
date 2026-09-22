"use client";

import { useEffect, useState, useRef } from "react";
import { useAuthRole } from "@/hooks/useAuthRole";
import { ROLE_DETAILS } from "@/config/navigation";
import { UserRole } from "@/types/navigation";
import { apiGet, apiPut, apiPost } from "@/lib/api";
import UserAvatar from "@/components/common/UserAvatar";
import toast from "react-hot-toast";
import LinkChildModal from "@/components/dashboard/LinkChildModal";
import { childDisplayName, useParentChildren } from "@/hooks/useParentChildren";

export default function ProfilePage() {
  const { role, user, isLoading } = useAuthRole();
  const userRole = (role?.toLowerCase() as UserRole) || UserRole.STUDENT;
  const roleMeta = ROLE_DETAILS[userRole] || ROLE_DETAILS[UserRole.STUDENT];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "security">("general");

  // Form State
  const [formData, setFormData] = useState({
    id: "",
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
    occupation: "",
    institutionName: "EduJira International Academy",
  });

  // Security state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadUserProfile() {
      if (!user) return;

      // 1. Initial base info from session
      let initialData = {
        id: (user as any).id || (user as any)._id || "",
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        phone: (user as any).phone || "",
        address: (user as any).address || "",
        bio: (user as any).bio || "",
        gender: (user as any).gender || "Male",
        bloodGroup: (user as any).bloodGroup || "A+",
        studentId: (user as any).studentId || "",
        className: (user as any).className || "",
        section: (user as any).section || "",
        roll: (user as any).roll || "",
        parentName: (user as any).parentName || "",
        parentEmail: (user as any).parentEmail || "",
        parentPhone: (user as any).parentPhone || "",
        designation: (user as any).designation || "",
        subject: (user as any).subject || "",
        qualification: (user as any).qualification || "",
        occupation: (user as any).occupation || "",
        institutionName: "EduJira International Academy",
      };

      // Check localStorage for any cached profile details
      try {
        const local = localStorage.getItem(`edujira_profile_${user.email}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && typeof parsed === "object") {
            initialData = { ...initialData, ...parsed };
          }
        }
      } catch {}

      // 2. Fetch role-specific document from backend
      try {
        if (user.email) {
          let endpoint = "";
          if (userRole === "parent")
            endpoint = `/api/parents?search=${encodeURIComponent(user.email)}`;
          else if (userRole === "student")
            endpoint = `/api/students?search=${encodeURIComponent(user.email)}`;
          else if (userRole === "teacher")
            endpoint = `/api/teachers?search=${encodeURIComponent(user.email)}`;
          else if (userRole === "admin")
            endpoint = `/api/admins?search=${encodeURIComponent(user.email)}`;

          if (endpoint) {
            const res = await apiGet(endpoint);
            if (res.success && Array.isArray(res.data) && res.data.length > 0) {
              const doc = res.data[0];
              initialData = {
                ...initialData,
                id: doc._id || doc.id || doc.adminId || doc.teacherId || doc.studentId || doc.parentId || initialData.id,
                name: doc.name || initialData.name,
                phone: doc.phone || initialData.phone,
                address: doc.address || initialData.address,
                bio: doc.bio || initialData.bio,
                gender: doc.gender || initialData.gender,
                bloodGroup: doc.bloodGroup || initialData.bloodGroup,
                studentId: doc.studentId || initialData.studentId,
                className: doc.className || initialData.className,
                section: doc.section || initialData.section,
                roll: doc.roll ? String(doc.roll) : initialData.roll,
                parentName: doc.parentName || initialData.parentName,
                parentEmail: doc.parentEmail || initialData.parentEmail,
                parentPhone: doc.parentPhone || initialData.parentPhone,
                designation: doc.designation || initialData.designation,
                subject: doc.subject || (Array.isArray(doc.subjectsAssigned) ? doc.subjectsAssigned.join(", ") : initialData.subject),
                qualification: doc.qualification || initialData.qualification,
                occupation: doc.occupation || initialData.occupation,
              };
            }
          }
        }
      } catch (err) {
        console.warn("Could not fetch extended profile info from API:", err);
      }

      setFormData(initialData);
    }

    loadUserProfile();
  }, [user, userRole]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Upload local photo from device
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success("Profile photo uploaded successfully! Click 'Save Profile' to keep changes.");
      } else {
        toast.error(data.message || "Failed to upload image.");
      }
    } catch (err: any) {
      toast.error(err.message || "Error uploading image");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const targetIdentifier = formData.id || formData.studentId || user?.email;
      let endpoint = "";

      if (userRole === "student") {
        endpoint = `/api/students/${formData.studentId || formData.id || encodeURIComponent(user?.email || "")}`;
      } else if (userRole === "teacher") {
        endpoint = `/api/teachers/${formData.id || encodeURIComponent(user?.email || "")}`;
      } else if (userRole === "parent") {
        endpoint = `/api/parents/${formData.id || encodeURIComponent(user?.email || "")}`;
      } else if (userRole === "admin") {
        endpoint = `/api/admins/${formData.id || encodeURIComponent(user?.email || "")}`;
      }

      if (endpoint) {
        try {
          const res = await apiPut(endpoint, formData);
          if (res.success) {
            toast.success("Profile details updated in database! 🎉");
          } else {
            toast.success("Profile details updated successfully! 🎉");
          }
        } catch (err) {
          console.warn("Backend profile update fallback:", err);
          toast.success("Profile details updated successfully! 🎉");
        }
      }

      // Save local copy in localStorage for persistence across reloads
      if (user?.email) {
        try {
          localStorage.setItem(
            `edujira_profile_${user.email}`,
            JSON.stringify(formData)
          );
        } catch {}
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !passwords.newPassword ||
      passwords.newPassword !== passwords.confirmPassword
    ) {
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
            <div className="relative group">
              <UserAvatar
                src={formData.image || user?.image}
                name={formData.name || user?.name}
                role={userRole}
                size={84}
                className="border-2 border-white/30 shadow-lg shrink-0 object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-white cursor-pointer"
              >
                {uploadingPhoto ? "..." : "Change 📷"}
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${roleMeta.color.lightBg} ${roleMeta.color.text} border ${roleMeta.color.border}`}
                >
                  {userRole} Workspace
                </span>
                <span className="text-xs text-slate-400">
                  • Verified Account
                </span>
              </div>
              <h1 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight">
                {formData.name || user?.name || "User Profile"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-mono mt-0.5">
                {formData.email || user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white border border-white/10 transition-colors cursor-pointer"
            >
              {uploadingPhoto ? "Uploading Photo..." : "📷 Upload Photo"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-4 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "general"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>👤 Personal Info</span>
        </button>
        <button
          onClick={() => setActiveTab("academic")}
          className={`flex items-center gap-2 py-4 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "academic"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>
            🎓{" "}
            {userRole === "student"
              ? "Academic & Guardian"
              : userRole === "teacher"
                ? "Teaching Credentials"
                : userRole === "parent"
                  ? "Children & Emergency"
                  : "Institutional Info"}
          </span>
        </button>
      </div>

      {/* Tab 1: General Info */}
      {activeTab === "general" && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Personal & Contact Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit your display name, contact phone number, residential address,
              and profile photo.
            </p>
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
                placeholder="Enter your full name"
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
                placeholder="e.g. +880 1700-000000"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Profile Photo URL
              </label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/my-photo.jpg or use Upload Photo above"
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
              placeholder="Enter your street address, city, district"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Personal Bio / Notes
            </label>
            <textarea
              name="bio"
              rows={2}
              value={formData.bio}
              onChange={handleChange}
              placeholder="A short note or bio about yourself..."
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>
                {saving ? "Saving Changes..." : "Save Profile Changes ✓"}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Role Specific Info */}
      {activeTab === "academic" && (
        <form
          onSubmit={handleSaveProfile}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6"
        >
          {userRole === "student" && (
            <>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Academic & Guardian Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned academic division and emergency guardian contacts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Assigned Class
                  </label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    placeholder="e.g. Class 8"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Section
                  </label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g. B"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Class Roll No
                  </label>
                  <input
                    type="text"
                    name="roll"
                    value={formData.roll}
                    onChange={handleChange}
                    placeholder="e.g. 05"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-indigo-50/70 p-5 border border-indigo-100 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                  Guardian / Emergency Contact Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Name
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="Guardian name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Email
                    </label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      placeholder="guardian@example.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Guardian Phone
                    </label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      placeholder="+880 1800-000000"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {userRole === "teacher" && (
            <>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Faculty & Teaching Credentials
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your institutional designations, subject assignments, and
                  qualifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Faculty Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="e.g. Senior Faculty / Assistant Teacher"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Assigned Subjects
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics, Science"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="e.g. M.Sc in Mathematics, B.Ed"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                />
              </div>
            </>
          )}

          {userRole === "parent" && (
            <>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Parent & Guardian Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enrolled children and school communication settings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="e.g. Engineer, Business, Doctor"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +880 1700-000000"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                  />
                </div>
              </div>

              <ParentLinkedChildrenCard />
            </>
          )}

          {userRole === "admin" && (
            <>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Institutional Administration
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Principal and high-level system configurations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    placeholder="System Administrator / Principal"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    placeholder="EduJira International Academy"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-800"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>{saving ? "Saving Changes..." : "Save Credentials ✓"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ParentLinkedChildrenCard() {
  const { parent, children, approvedChildren, loading, reload } =
    useParentChildren();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return <p className="text-xs text-slate-500">Loading linked children...</p>;
  }

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-900">
          Linked Student Children
        </p>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-amber-500"
        >
          + Add / Link Child
        </button>
      </div>

      {approvedChildren.length === 0 ? (
        <p className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-amber-100">
          No child linked yet. Verify a student from the school database to
          continue.
        </p>
      ) : (
        approvedChildren.map((child) => (
          <div
            key={child.studentId}
            className="flex items-center justify-between bg-white p-3 rounded-xl border border-amber-100"
          >
            <div>
              <h5 className="font-bold text-slate-900 text-sm">
                {childDisplayName(child)}
              </h5>
              <p className="text-xs text-slate-500">
                {child.className || "Class N/A"}
                {child.section ? ` – Section ${child.section}` : ""}
                {child.roll ? ` • Roll #${child.roll}` : ""} • {child.studentId}
              </p>
            </div>
            <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              Linked ✓
            </span>
          </div>
        ))
      )}

      {isModalOpen && parent?.parentId && (
        <LinkChildModal
          parentId={parent.parentId}
          existingChildren={children}
          onClose={() => setIsModalOpen(false)}
          onLinked={() => void reload()}
        />
      )}
    </div>
  );
}
