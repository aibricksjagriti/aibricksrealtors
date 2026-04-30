"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { locationPagesAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

export default function EditLocationPage({ params }) {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    city: "",
    slug: "",
    state: "",
    banner: "",
    description: "",
    about: "",
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    params.then?.((p) => setId(p.id)) || setId(params.id);
  }, [params]);

  useEffect(() => {
    if (!id) return;
    locationPagesAPI.getById(id)
      .then((res) => {
        const d = res.data || res;
        setForm({
          city: d.city || "",
          slug: d.slug || "",
          state: d.state || "",
          banner: d.banner || "",
          description: d.description || "",
          about: d.about || "",
          metaTitle: d.metaTitle || "",
          metaDescription: d.metaDescription || "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", "locations");
    try {
      const res = await fetch(`${window.location.origin}/api/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setForm((prev) => ({ ...prev, banner: data.url }));
      else alert("Upload failed: " + data.error);
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.city || !form.slug) {
      setError("City and slug are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await locationPagesAPI.update(id, form);
      router.push("/admin/locations");
    } catch (err) {
      setError(err.message || "Failed to update location page");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="space-y-6 animate-slide-in max-w-2xl">
      <div>
        <Link href="/admin/locations" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2">
          <ArrowLeft size={18} className="mr-2" /> Back to Locations
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Edit Location Page</h1>
        <p className="text-sm text-gray-500">{form.city && `Editing: ${form.city}`}</p>
      </div>

      <form onSubmit={handleSubmit} className="admin-card p-6 space-y-5">
        {/* Basic Info */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
              <input name="city" value={form.city} onChange={handleChange} className="admin-input w-full" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
              <input name="slug" value={form.slug} onChange={handleChange} className="admin-input w-full font-mono" required />
              <p className="text-xs text-gray-400 mt-1">URL: /locations/{form.slug || "..."}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
              <input name="state" value={form.state} onChange={handleChange} className="admin-input w-full" placeholder="e.g., Maharashtra" />
            </div>
          </div>
        </div>

        {/* Banner */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Banner Image</h2>
          {form.banner && (
            <div className="mb-3">
              <img src={form.banner} alt="Banner" className="w-full h-40 object-cover rounded-lg border" />
              <button type="button" onClick={() => setForm((p) => ({ ...p, banner: "" }))} className="text-xs text-red-500 hover:underline mt-1">Remove</button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])}
              className="admin-input flex-1"
            />
            {uploading && <span className="text-blue-600 animate-pulse text-sm">Uploading...</span>}
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
              <input name="description" value={form.description} onChange={handleChange} className="admin-input w-full" placeholder="One-line summary shown under city name" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">About (detailed)</label>
              <textarea name="about" value={form.about} onChange={handleChange} className="admin-input w-full" rows={5} />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div>
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title</label>
              <input name="metaTitle" value={form.metaTitle} onChange={handleChange} className="admin-input w-full" />
              <p className="text-xs text-gray-400 mt-1">{form.metaTitle.length}/60 characters recommended</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
              <textarea name="metaDescription" value={form.metaDescription} onChange={handleChange} className="admin-input w-full" rows={3} />
              <p className="text-xs text-gray-400 mt-1">{form.metaDescription.length}/160 characters recommended</p>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
          <Link href="/admin/locations" className="admin-btn-secondary">Cancel</Link>
          <button type="submit" disabled={loading || uploading} className="admin-btn-primary disabled:opacity-50">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
