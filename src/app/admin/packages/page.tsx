"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, IndianRupee, Clock } from "lucide-react";
import toast from "react-hot-toast";

interface AdminPackage {
  _id: string; packageId: string; name: string; destination: string; price: number;
  duration: string; category: string; featured: boolean; active: boolean;
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<AdminPackage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = () => {
    setLoading(true);
    fetch("/api/admin/packages").then((r) => r.json()).then(setPackages).catch(() => toast.error("Failed to load")).finally(() => setLoading(false));
  };

  useEffect(fetchPackages, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Package deleted"); fetchPackages(); } else toast.error("Failed to delete");
    } catch { toast.error("Something went wrong"); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) });
      if (res.ok) { toast.success(active ? "Package deactivated" : "Package activated"); fetchPackages(); }
    } catch { toast.error("Something went wrong"); }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      const res = await fetch(`/api/admin/packages/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ featured: !featured }) });
      if (res.ok) { toast.success(featured ? "Unfeatured" : "Featured"); fetchPackages(); }
    } catch { toast.error("Something went wrong"); }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Manage Packages</h1>
        <Link href="/admin/packages/new" className="bg-red-500 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-600 transition flex items-center gap-2">
          <Plus size={20} />Add Package
        </Link>
      </div>

      {packages.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-lg mb-4">No packages yet</p>
          <Link href="/admin/packages/new" className="text-red-500 hover:underline font-medium">Create your first package</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Destination</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Duration</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {packages.map((pkg) => (
                  <tr key={pkg._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-xs text-gray-500">{pkg.packageId}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{pkg.destination}</td>
                    <td className="px-6 py-4 text-sm flex items-center gap-1"><Clock size={14} />{pkg.duration}</td>
                    <td className="px-6 py-4 text-sm font-bold flex items-center"><IndianRupee size={14} />{(pkg.price ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4"><span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">{pkg.category}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => toggleActive(pkg._id, pkg.active !== false)} className={`px-2 py-1 rounded text-xs font-medium ${pkg.active !== false ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {pkg.active !== false ? "Active" : "Inactive"}
                        </button>
                        <button onClick={() => toggleFeatured(pkg._id, pkg.featured)} className={`px-2 py-1 rounded text-xs font-medium ${pkg.featured ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-gray-100 text-gray-500"}`}>
                          {pkg.featured ? "Featured" : "Normal"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/packages/new?edit=${pkg._id}`} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"><Edit size={16} /></Link>
                        <button onClick={() => handleDelete(pkg._id, pkg.name)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
