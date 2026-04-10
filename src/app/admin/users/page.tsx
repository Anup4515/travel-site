"use client";

import { useState, useEffect } from "react";
import { Users, Mail, Shield, User } from "lucide-react";

interface AdminUser {
  _id: string; name: string; email?: string; phone?: string; role: string;
  authMethod: string; createdAt: string; location?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users").then((r) => r.json()).then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <span className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"><Users size={16} />{users.length} total</span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Auth Method</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                        {u.role === "admin" ? <Shield size={18} className="text-red-500" /> : <User size={18} className="text-blue-500" />}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        {u.location && <p className="text-xs text-gray-500">{u.location}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {u.email && <p className="flex items-center gap-1"><Mail size={12} />{u.email}</p>}
                      {u.phone && <p className="text-gray-500">{u.phone}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{u.authMethod}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
