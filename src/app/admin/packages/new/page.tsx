"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Save, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

const categories = ["golden-triangle", "heritage", "adventure", "spiritual", "beach", "mountain", "cultural", "wildlife"];
const difficulties = ["easy", "moderate", "challenging"];

function PackageForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", destination: "", cities: [""], image: "", duration: "", durationDays: 3, durationNights: 2,
    price: 0, description: "", category: "cultural", difficulty: "easy", bestFor: "",
    included: [""], excluded: [""], highlights: [""],
    itinerary: [{ day: 1, title: "", description: "", highlights: [""] }],
    featured: false,
  });

  useEffect(() => {
    if (editId) {
      fetch(`/api/admin/packages`).then((r) => r.json()).then((pkgs) => {
        const pkg = pkgs.find((p: { _id: string }) => p._id === editId);
        if (pkg) {
          setForm({
            name: pkg.name || "", destination: pkg.destination || "", cities: pkg.cities?.length ? pkg.cities : [""],
            image: pkg.image || "", duration: pkg.duration || "", durationDays: pkg.durationDays || 3, durationNights: pkg.durationNights || 2,
            price: pkg.price || 0, description: pkg.description || "", category: pkg.category || "cultural",
            difficulty: pkg.difficulty || "easy", bestFor: pkg.bestFor || "",
            included: pkg.included?.length ? pkg.included : [""], excluded: pkg.excluded?.length ? pkg.excluded : [""],
            highlights: pkg.highlights?.length ? pkg.highlights : [""],
            itinerary: pkg.itinerary?.length ? pkg.itinerary.map((d: { day: number; title: string; description: string; highlights?: string[] }) => ({ ...d, highlights: d.highlights?.length ? d.highlights : [""] })) : [{ day: 1, title: "", description: "", highlights: [""] }],
            featured: pkg.featured || false,
          });
        }
      });
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.destination || !form.price || !form.description) {
      toast.error("Please fill all required fields"); return;
    }
    setLoading(true);
    try {
      const body = {
        ...form,
        cities: form.cities.filter(Boolean),
        included: form.included.filter(Boolean),
        excluded: form.excluded.filter(Boolean),
        highlights: form.highlights.filter(Boolean),
        itinerary: form.itinerary.map((d) => ({ ...d, highlights: d.highlights.filter(Boolean) })),
        duration: form.duration || `${form.durationDays} Days / ${form.durationNights} Nights`,
      };

      const url = editId ? `/api/admin/packages/${editId}` : "/api/admin/packages";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

      if (res.ok) { toast.success(editId ? "Package updated!" : "Package created!"); router.push("/admin/packages"); }
      else { const d = await res.json(); toast.error(d.error || "Failed"); }
    } catch { toast.error("Something went wrong"); } finally { setLoading(false); }
  };

  const addListItem = (field: "cities" | "included" | "excluded" | "highlights") => {
    setForm({ ...form, [field]: [...form[field], ""] });
  };
  const updateListItem = (field: "cities" | "included" | "excluded" | "highlights", index: number, value: string) => {
    const arr = [...form[field]]; arr[index] = value; setForm({ ...form, [field]: arr });
  };
  const removeListItem = (field: "cities" | "included" | "excluded" | "highlights", index: number) => {
    setForm({ ...form, [field]: form[field].filter((_, i) => i !== index) });
  };

  const addDay = () => {
    setForm({ ...form, itinerary: [...form.itinerary, { day: form.itinerary.length + 1, title: "", description: "", highlights: [""] }] });
  };
  const updateDay = (index: number, field: string, value: string | string[]) => {
    const it = [...form.itinerary]; it[index] = { ...it[index], [field]: value }; setForm({ ...form, itinerary: it });
  };
  const removeDay = (index: number) => {
    setForm({ ...form, itinerary: form.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })) });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{editId ? "Edit Package" : "Add New Package"}</h1>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
        {/* Basic Info */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Package Name *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" placeholder="Golden Triangle Classic" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Destination *</label>
              <input type="text" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" placeholder="Golden Triangle" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (INR) *</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} required className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input type="text" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" placeholder="/images/tajmahal.jpg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none">
                {difficulties.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Days</label>
              <input type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: parseInt(e.target.value) || 1 })} min={1} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nights</label>
              <input type="number" value={form.durationNights} onChange={(e) => setForm({ ...form, durationNights: parseInt(e.target.value) || 0 })} min={0} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Best For</label>
            <input type="text" value={form.bestFor} onChange={(e) => setForm({ ...form, bestFor: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none" placeholder="First-time visitors" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium">Featured Package</span>
          </label>
        </div>

        {/* Cities */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-center"><h2 className="text-lg font-bold">Cities</h2><button type="button" onClick={() => addListItem("cities")} className="text-red-500 text-sm flex items-center gap-1"><Plus size={14} />Add</button></div>
          {form.cities.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={c} onChange={(e) => updateListItem("cities", i, e.target.value)} className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm" placeholder="City name" />
              {form.cities.length > 1 && <button type="button" onClick={() => removeListItem("cities", i)} className="text-red-400 hover:text-red-600"><X size={16} /></button>}
            </div>
          ))}
        </div>

        {/* Highlights */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex justify-between items-center"><h2 className="text-lg font-bold">Highlights</h2><button type="button" onClick={() => addListItem("highlights")} className="text-red-500 text-sm flex items-center gap-1"><Plus size={14} />Add</button></div>
          {form.highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={h} onChange={(e) => updateListItem("highlights", i, e.target.value)} className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm" placeholder="Highlight" />
              {form.highlights.length > 1 && <button type="button" onClick={() => removeListItem("highlights", i)} className="text-red-400"><X size={16} /></button>}
            </div>
          ))}
        </div>

        {/* Included/Excluded */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center"><h2 className="text-lg font-bold text-green-600">Included</h2><button type="button" onClick={() => addListItem("included")} className="text-green-500 text-sm flex items-center gap-1"><Plus size={14} />Add</button></div>
            {form.included.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={item} onChange={(e) => updateListItem("included", i, e.target.value)} className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm" />
                {form.included.length > 1 && <button type="button" onClick={() => removeListItem("included", i)} className="text-red-400"><X size={16} /></button>}
              </div>
            ))}
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center"><h2 className="text-lg font-bold text-red-600">Excluded</h2><button type="button" onClick={() => addListItem("excluded")} className="text-red-500 text-sm flex items-center gap-1"><Plus size={14} />Add</button></div>
            {form.excluded.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={item} onChange={(e) => updateListItem("excluded", i, e.target.value)} className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm" />
                {form.excluded.length > 1 && <button type="button" onClick={() => removeListItem("excluded", i)} className="text-red-400"><X size={16} /></button>}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center"><h2 className="text-lg font-bold">Itinerary</h2><button type="button" onClick={addDay} className="text-red-500 text-sm flex items-center gap-1"><Plus size={14} />Add Day</button></div>
          {form.itinerary.map((day, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-blue-500">Day {day.day}</h3>
                {form.itinerary.length > 1 && <button type="button" onClick={() => removeDay(i)} className="text-red-400 text-sm">Remove</button>}
              </div>
              <input type="text" value={day.title} onChange={(e) => updateDay(i, "title", e.target.value)} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm" placeholder="Day title" />
              <textarea value={day.description} onChange={(e) => updateDay(i, "description", e.target.value)} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 outline-none text-sm resize-none" placeholder="Day description" />
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="bg-red-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50">
            <Save size={18} />{loading ? "Saving..." : editId ? "Update Package" : "Create Package"}
          </button>
          <button type="button" onClick={() => router.push("/admin/packages")} className="px-8 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function NewPackagePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500" /></div>}>
      <PackageForm />
    </Suspense>
  );
}
