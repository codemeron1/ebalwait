import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

interface User {
  id_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  role: string;
  group: string;
  profilePicture?: string;
}
const apiUrl = import.meta.env.VITE_API_URL;

const Settings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const roles = useRef([
    "Team Manager",
    "Lead Programmer",
    "API Tester",
    "Documentation Specialist",
    "API Programmer",
  ]);

  useEffect(() => {
    // Fetch user data on component mount
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    console.log("Fetching user data...");
    try {
      const response = await axios.get(`${apiUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const data = response.data;
      setUser(data.profileData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    // password length check >= 8
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/user/password-update`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert("Failed to update password");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleRoleUpdate = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch("/api/user/role", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ role: selectedRole }),
  //     });

  //     if (response.ok) {
  //       alert("Role updated successfully");
  //       setUser((prev) => (prev ? { ...prev, role: selectedRole } : null));
  //     } else {
  //       alert("Failed to update role");
  //     }
  //   } catch (error) {
  //     console.error("Error updating role:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Profile */}
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-300 dark:bg-slate-800 shadow">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={`/assets/carrot.png`}
              alt="Profile Placeholder"
              className="w-full h-full object-cover opacity-80"
            />
          )}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {`${user?.first_name} ${user?.last_name}`}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {roles.current[Number(user?.role) - 1] || ""}
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700" />

      {/* Change Password */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Change Password
        </h2>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          {[
            {
              label: "Current Password",
              value: currentPassword,
              setter: setCurrentPassword,
            },
            {
              label: "New Password",
              value: newPassword,
              setter: setNewPassword,
            },
            {
              label: "Confirm New Password",
              value: confirmPassword,
              setter: setConfirmPassword,
            },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {field.label}
              </label>
              <input
                type="password"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="mt-1 block w-full rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:outline-none"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 dark:bg-slate-700 text-white font-medium py-2 rounded-md hover:bg-slate-900 dark:hover:bg-slate-600 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      {/* Role Settings */}
      {/* <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Role Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Current Role: <span className="font-semibold">{user.role}</span>
            </label>

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="mt-1 block w-full rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 py-2 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-slate-500 focus:outline-none"
            >
              <option value="" selected disabled>Select a new role</option>
              {
                roles.current.map((role, index) => (
                  <option key={index} value={index + 1}>
                    {role}
                  </option>
                ))
              }
            </select>
          </div>

          <button
            onClick={handleRoleUpdate}
            disabled={loading || selectedRole === user.role}
            className="w-full bg-slate-800 dark:bg-slate-700 text-white font-medium py-2 rounded-md hover:bg-slate-900 dark:hover:bg-slate-600 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Role"}
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Settings;
