"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, MapPin, Globe, Image, Building2 } from "lucide-react";
import { locationPagesAPI, propertiesAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

const toSlug = (name) => name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function LocationPagesAdmin() {
  const [pages, setPages] = useState([]);
  const [allCities, setAllCities] = useState([]); // cities from properties with no page yet
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    async function load() {
      const [pagesRes, propRes] = await Promise.all([
        locationPagesAPI.getAll().catch(() => ({ data: [] })),
        propertiesAPI.getAll({ limit: 500 }).catch(() => ({ data: [] })),
      ]);
      const registeredPages = pagesRes.data || [];
      setPages(registeredPages);

      const registeredCities = new Set(registeredPages.map((p) => p.city?.toLowerCase()));
      const fromProps = [...new Set((propRes.data || []).map((p) => p.city?.trim()).filter(Boolean))]
        .filter((c) => !registeredCities.has(c.toLowerCase()))
        .sort();
      setAllCities(fromProps);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this location page?")) return;
    setDeleting(id);
    try {
      await locationPagesAPI.delete(id);
      setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const filtered = pages.filter((p) =>
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCities = allCities.filter((c) => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Location Pages</h1>
          <p className="text-sm text-gray-500">Manage city pages — banner, description, SEO</p>
        </div>
        <Link href="/admin/locations/new" className="admin-btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Location Page
        </Link>
      </div>

      <div className="admin-card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search cities..." value={search} onChange={(e) => setSearch(e.target.value)} className="admin-input admin-input-with-icon w-full" />
        </div>
      </div>

      {/* Configured location pages */}
      {filtered.length > 0 && (
        <div className="admin-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Configured Pages ({filtered.length})</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Content</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {page.banner ? (
                        <img src={page.banner} alt={page.city} className="w-12 h-10 rounded object-cover border" />
                      ) : (
                        <div className="w-12 h-10 rounded bg-blue-50 flex items-center justify-center">
                          <MapPin size={16} className="text-blue-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{page.city}</p>
                        <p className="text-xs text-gray-400 font-mono">/locations/{page.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{page.state || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 text-xs text-gray-500">
                      {page.banner && <span className="flex items-center gap-1"><Image size={12} /> Banner</span>}
                      {page.description && <span>Description</span>}
                      {page.about && <span>About</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/properties?city=${encodeURIComponent(page.city)}`}
                        className="text-xs px-2 py-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-700 flex items-center gap-1"
                        title="View Properties"
                      >
                        <Building2 size={13} /> Properties
                      </Link>
                      <Link
                        href={`/admin/properties/new?city=${encodeURIComponent(page.city)}`}
                        className="text-xs px-2 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100"
                      >
                        + Add
                      </Link>
                      <a href={`/locations/${page.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-blue-600 rounded-lg">
                        <Globe size={15} />
                      </a>
                      <Link href={`/admin/locations/${page.id}/edit`} className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(page.id)} disabled={deleting === page.id} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Cities from properties without a page */}
      {filteredCities.length > 0 && (
        <div className="admin-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">Cities from Properties (no page configured yet)</h2>
            <p className="text-xs text-gray-500 mt-1">These cities appear in your properties but don't have a custom location page.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
            {filteredCities.map((city) => (
              <div key={city} className="border border-dashed border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="font-medium text-gray-700">{city}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Link
                    href={`/admin/properties?city=${encodeURIComponent(city)}`}
                    className="text-xs text-gray-600 hover:underline"
                  >
                    View Properties
                  </Link>
                  <Link
                    href={`/admin/properties/new?city=${encodeURIComponent(city)}`}
                    className="text-xs text-purple-600 hover:underline"
                  >
                    + Add Property
                  </Link>
                  <Link
                    href={`/admin/locations/new?city=${encodeURIComponent(city)}&slug=${encodeURIComponent(toSlug(city))}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    + Create Page
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="p-8 text-center text-gray-500">Loading...</div>}
    </div>
  );
}
