"use client";

import { useEffect, useState } from "react";
import { Edit, ImageIcon, Plus, Search, Trash2, X } from "lucide-react";
import { upcomingProjectsAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

const emptyForm = {
  name: "",
  city: "",
  image: "",
  projectLabel: "Upcoming project",
  launchStatus: "Ready for launch",
  sortOrder: 0,
  isActive: true,
};

export default function UpcomingProjectsAdminPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      const response = await upcomingProjectsAPI.getAll();
      setProjects(response.data || []);
    } catch (err) {
      setError(err.message || "Failed to load upcoming projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const openCreate = () => {
    setEditing("new");
    setForm({ ...emptyForm, sortOrder: projects.length + 1 });
    setError("");
  };

  const openEdit = (project) => {
    setEditing(project.id);
    setForm({ ...emptyForm, ...project });
    setError("");
  };

  const uploadImage = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("file", file);
    data.append("path", "upcoming-projects");
    try {
      const response = await fetch("/api/upload", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Image upload failed");
      setForm((current) => ({ ...current, image: result.url }));
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editing === "new") await upcomingProjectsAPI.create(form);
      else await upcomingProjectsAPI.update(editing, form);
      setEditing(null);
      setLoading(true);
      await loadProjects();
    } catch (err) {
      setError(err.message || "Failed to save upcoming project");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (project) => {
    if (!confirm(`Delete “${project.name}”? This removes it from the home page too.`)) return;
    setDeleting(project.id);
    try {
      await upcomingProjectsAPI.delete(project.id);
      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch (err) {
      alert(err.message || "Failed to delete upcoming project");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = projects.filter((project) =>
    `${project.name} ${project.city}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Upcoming Projects</h1>
          <p className="text-sm text-gray-500">Manage the project cards shown on the home page</p>
        </div>
        <button onClick={openCreate} className="admin-btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="admin-card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input admin-input-with-icon w-full" placeholder="Search by project or location..." />
        </div>
      </div>

      {error && !editing && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>}

      <div className="admin-card overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-500">Loading...</div> : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No upcoming projects found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Card text</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order / Visibility</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.image ? <img src={project.image} alt="" className="h-14 w-20 rounded-lg object-cover border" /> : <div className="h-14 w-20 rounded-lg bg-gray-100 grid place-items-center"><ImageIcon size={20} /></div>}
                        <div><p className="font-medium text-gray-800">{project.name}</p><p className="text-sm text-gray-500">{project.city}</p></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm"><p className="text-gray-500">{project.projectLabel}</p><p className="font-medium text-gray-700">{project.launchStatus}</p></td>
                    <td className="px-6 py-4 text-sm"><p>#{project.sortOrder ?? 0}</p><span className={`text-xs ${project.isActive ? "text-green-600" : "text-gray-400"}`}>{project.isActive ? "Visible" : "Hidden"}</span></td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(project)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg" aria-label={`Edit ${project.name}`}><Edit size={17} /></button><button onClick={() => remove(project)} disabled={deleting === project.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50" aria-label={`Delete ${project.name}`}><Trash2 size={17} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold text-gray-800">{editing === "new" ? "Add Upcoming Project" : "Edit Upcoming Project"}</h2><p className="text-sm text-gray-500">These values appear directly on the existing home-page card.</p></div><button type="button" onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm font-semibold text-gray-700">Project name *<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input w-full mt-1" /></label>
              <label className="text-sm font-semibold text-gray-700">Location *<input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="admin-input w-full mt-1" placeholder="e.g. Pune" /></label>
              <label className="text-sm font-semibold text-gray-700">Small label<input value={form.projectLabel} onChange={(e) => setForm({ ...form, projectLabel: e.target.value })} className="admin-input w-full mt-1" /></label>
              <label className="text-sm font-semibold text-gray-700">Launch status<input value={form.launchStatus} onChange={(e) => setForm({ ...form, launchStatus: e.target.value })} className="admin-input w-full mt-1" /></label>
              <label className="text-sm font-semibold text-gray-700">Display order<input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="admin-input w-full mt-1" /></label>
              <label className="flex items-center gap-2 self-end min-h-10 text-sm font-semibold text-gray-700"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Show on home page</label>
            </div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Image *</label>{form.image && <img src={form.image} alt="Preview" className="w-full h-44 object-cover rounded-lg border mb-2" />}<div className="flex flex-col sm:flex-row gap-2"><input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="admin-input flex-1" placeholder="Image URL or /public path" /><input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0])} className="admin-input sm:max-w-60" /></div>{uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}</div>
            {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>}
            <div className="flex justify-end gap-3 pt-3 border-t"><button type="button" onClick={() => setEditing(null)} className="admin-btn-secondary">Cancel</button><button disabled={saving || uploading} className="admin-btn-primary disabled:opacity-50">{saving ? "Saving..." : "Save Project"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
