"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { localitiesAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

export default function NewLocalityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", city: "", description: "" });

  useEffect(() => {
    const name = searchParams.get("name");
    const city = searchParams.get("city");
    if (name || city) {
      setForm((prev) => ({
        ...prev,
        name: name || prev.name,
        city: city || prev.city,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.city) { setError("Name and city are required"); return; }
    setLoading(true); setError("");
    try {
      await localitiesAPI.create(form);
      router.push("/admin/localities");
    } catch (err) {
      setError(err.message || "Failed to create locality");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in max-w-xl">
      <div>
        <Link href="/admin/localities" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2">
          <ArrowLeft size={18} className="mr-2" /> Back to Localities
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add Locality</h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Locality Name <span className="text-red-500">*</span></label>
          <input name="name" value={form.name} onChange={handleChange} className="admin-input w-full" placeholder="e.g., Andheri West" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
          <input name="city" value={form.city} onChange={handleChange} className="admin-input w-full" placeholder="e.g., Mumbai" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <input name="description" value={form.description} onChange={handleChange} className="admin-input w-full" placeholder="Brief note about this area (optional)" />
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
          <Link href="/admin/localities" className="admin-btn-secondary">Cancel</Link>
          <button type="submit" disabled={loading} className="admin-btn-primary disabled:opacity-50">
            {loading ? "Creating..." : "Create Locality"}
          </button>
        </div>
      </form>
    </div>
  );
}
