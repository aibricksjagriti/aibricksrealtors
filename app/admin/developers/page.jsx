"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash2, Building2, Globe, Loader2 } from "lucide-react";
import { developersAPI, propertiesAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

const toSlug = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function DevelopersPage() {
  const router = useRouter();
  const [allDevelopers, setAllDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [migrating, setMigrating] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const [devRes, propRes] = await Promise.all([
          developersAPI.getAll(),
          propertiesAPI.getAll({ limit: 500 }),
        ]);

        const registered = devRes.data || [];
        const registeredMap = {};
        registered.forEach((d) => {
          registeredMap[d.name.toLowerCase().trim()] = d;
        });

        // Count properties per builder name
        const propertyCounts = {};
        (propRes.data || []).forEach((p) => {
          const name = p.builderName?.trim();
          if (!name) return;
          propertyCounts[name] = (propertyCounts[name] || 0) + 1;
        });

        // Build merged list: developers with custom pages first, then names found only in properties.
        const merged = [];
        const seen = new Set();

        registered.forEach((d) => {
          const key = d.name.toLowerCase().trim();
          seen.add(key);
          merged.push({
            ...d,
            hasProfile: true,
            propertyCount: propertyCounts[d.name] || 0,
          });
        });

        Object.keys(propertyCounts).forEach((name) => {
          if (!seen.has(name.toLowerCase().trim())) {
            merged.push({
              id: null,
              name,
              slug: toSlug(name),
              hasProfile: false,
              propertyCount: propertyCounts[name],
            });
          }
        });

        // Sort: by name
        merged.sort((a, b) => a.name.localeCompare(b.name));
        setAllDevelopers(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this developer page? Properties using this developer name won't be affected.")) return;
    setDeleting(id);
    try {
      await developersAPI.delete(id);
      setAllDevelopers((prev) => prev.map((d) => d.id === id ? { ...d, id: null, hasProfile: false } : d));
    } catch (err) {
      alert(err.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const handleAutoCreate = async (dev) => {
    setMigrating(dev.name);
    try {
      const res = await developersAPI.create({ name: dev.name, slug: dev.slug });
      const newId = res.data?.id || res.id;
      router.push(`/admin/developers/${newId}/edit`);
    } catch (err) {
      alert(err.message || "Failed to create developer page");
      setMigrating(null);
    }
  };

  const withProfile = allDevelopers.filter((d) => d.hasProfile).length;
  const filtered = allDevelopers.filter((d) =>
    d.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Developers</h1>
          <p className="text-sm text-gray-500">
            {allDevelopers.length} developers · {withProfile} custom pages · {allDevelopers.length - withProfile} from properties only
          </p>
        </div>
        <Link href="/admin/developers/new" className="admin-btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Developer
        </Link>
      </div>

      <div className="admin-card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search developers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input admin-input-with-icon w-full"
          />
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading developers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No developers found.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Developer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Properties</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((dev, idx) => (
                <tr key={dev.id || `np-${idx}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {dev.logo ? (
                        <img src={dev.logo} alt={dev.name} className="w-10 h-10 rounded-lg object-contain border bg-white" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <Building2 size={20} className="text-purple-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{dev.name}</p>
                        {dev.tagline && <p className="text-xs text-gray-500">{dev.tagline}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={dev.hasProfile ? `/admin/developers/${dev.id}` : `/admin/developers/properties?name=${encodeURIComponent(dev.name)}`}
                      className="text-sm font-medium text-gray-800 hover:text-purple-600"
                    >
                      {dev.propertyCount} properties
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/properties/new?developer=${encodeURIComponent(dev.name)}`}
                        className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100"
                      >
                        + Add Property
                      </Link>
                      <a
                        href={`/developers/${dev.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-purple-600 rounded-lg"
                      >
                        <Globe size={15} />
                      </a>
                      {dev.hasProfile ? (
                        <>
                          <Link
                            href={`/admin/developers/${dev.id}/edit`}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(dev.id)}
                            disabled={deleting === dev.id}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleAutoCreate(dev)}
                          disabled={migrating === dev.name}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Create custom page"
                        >
                          {migrating === dev.name ? <Loader2 size={16} className="animate-spin" /> : <Edit size={16} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
