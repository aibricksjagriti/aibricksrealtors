"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { developersAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

const toSlug = (name) => name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
const defaultImpactPointsText = [
  "Economic Contribution - The development of residential, commercial, and retail projects by the builder has significantly contributed to job creation and economic growth in the region.",
  "Focus on Sustainability - The builder emphasizes eco-friendly construction practices by incorporating green building concepts, energy-efficient technologies, rainwater harvesting systems, and sustainable materials.",
  "Enhanced Infrastructure - Through large-scale residential and commercial developments, the builder has played a crucial role in improving local infrastructure.",
  "Influence on Market Trends - The builder has set new benchmarks in the real estate industry by introducing innovative architectural designs, modern amenities, and smart living solutions.",
  "Customer Satisfaction - Customer-centric approach, timely project delivery, and transparent dealings have helped the builder establish a strong reputation in the market.",
  "Integrated Township Development - The builder focuses on creating integrated townships that offer a complete lifestyle experience.",
  "Technological Innovation - Adoption of modern construction technologies and smart home features has enabled the builder to deliver high-quality projects efficiently.",
].join("\n");

const parseImpactPoints = (value) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...descParts] = line.split(" - ");
      return {
        title: title.trim(),
        desc: descParts.join(" - ").trim(),
      };
    })
    .filter((item) => item.title && item.desc);

export default function NewDeveloperPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    logo: "",
    banner: "",
    tagline: "",
    description: "",
    about: "",
    impactPointsText: defaultImpactPointsText,
  });

  // Pre-fill from URL params (e.g., when registering from properties list)
  useEffect(() => {
    const name = searchParams.get("name");
    const slug = searchParams.get("slug");
    if (name || slug) {
      setForm((prev) => ({
        ...prev,
        name: name || prev.name,
        slug: slug || toSlug(name || ""),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "name" ? { slug: toSlug(value) } : {}),
    }));
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", "developers");
    try {
      const res = await fetch(`${window.location.origin}/api/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) setForm((prev) => ({ ...prev, logo: data.url }));
      else alert("Upload failed: " + data.error);
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleBannerUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", "developers");
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
    if (!form.name || !form.slug) {
      setError("Name and slug are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { impactPointsText, ...developerData } = form;
      await developersAPI.create({
        ...developerData,
        impactPoints: parseImpactPoints(impactPointsText),
      });
      router.push("/admin/developers");
    } catch (err) {
      setError(err.message || "Failed to create developer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slide-in max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin/developers" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-3">
            <ArrowLeft size={18} className="mr-2" /> Back to Developers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add Developer</h1>
          <p className="text-sm text-gray-500 mt-1">Create the public developer page content and media.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        <div className="space-y-6">
          <section className="admin-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Basic Details</h2>
              <p className="text-sm text-gray-500">Controls the page URL and hero heading.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} className="admin-input w-full" placeholder="e.g., Lodha Group" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
                <input name="slug" value={form.slug} onChange={handleChange} className="admin-input w-full font-mono" placeholder="e.g., lodha-group" required />
                <p className="text-xs text-gray-400 mt-1">/developers/{form.slug || "..."}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input name="tagline" value={form.tagline} onChange={handleChange} className="admin-input w-full" placeholder={`${form.name || "Developer"} Projects`} />
              <p className="text-xs text-gray-400 mt-1">Shown as the main hero title.</p>
            </div>
          </section>

          <section className="admin-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">About Content</h2>
              <p className="text-sm text-gray-500">Shown in the About section on the public page.</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Short Description</label>
              <input name="description" value={form.description} onChange={handleChange} className="admin-input w-full" placeholder="One-line summary" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">About</label>
              <textarea name="about" value={form.about} onChange={handleChange} className="admin-input w-full min-h-36 resize-y" rows={6} placeholder="Full developer bio for the developer page..." />
            </div>
          </section>

          <section className="admin-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Impact Bullet Points</h2>
              <p className="text-sm text-gray-500">One bullet per line, using: Title - Description</p>
            </div>
            <textarea
              name="impactPointsText"
              value={form.impactPointsText}
              onChange={handleChange}
              className="admin-input w-full min-h-80 resize-y font-mono text-sm leading-6"
              rows={13}
              placeholder="Title - Description"
            />
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <section className="admin-card p-6 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Media</h2>
              <p className="text-sm text-gray-500">Logo and hero image shown on the developer page.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Logo</label>
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                {form.logo ? (
                  <img src={form.logo} alt="Logo" className="h-20 w-full rounded-lg border bg-white object-contain p-2" />
                ) : (
                  <div className="h-20 rounded-lg bg-white border flex items-center justify-center text-sm text-gray-400">No logo uploaded</div>
                )}
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} className="admin-input mt-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Banner</label>
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                {form.banner ? (
                  <div>
                    <img src={form.banner} alt="Developer banner" className="w-full h-40 rounded-lg border object-cover" />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, banner: "" }))} className="text-xs text-red-500 hover:underline mt-2">Remove banner</button>
                  </div>
                ) : (
                  <div className="h-40 rounded-lg bg-white border flex items-center justify-center text-sm text-gray-400">No banner uploaded</div>
                )}
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])} className="admin-input mt-3" />
              </div>
            </div>

            {uploading && <p className="text-blue-600 animate-pulse text-sm">Uploading image...</p>}
          </section>

          <section className="admin-card p-5 space-y-4">
            {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>}
            <div className="flex flex-col gap-3">
              <button type="submit" disabled={loading || uploading} className="admin-btn-primary disabled:opacity-50 w-full">
                {loading ? "Creating..." : "Create Developer"}
              </button>
              <Link href="/admin/developers" className="admin-btn-secondary text-center">Cancel</Link>
            </div>
          </section>
        </aside>
      </form>
    </div>
  );
}
