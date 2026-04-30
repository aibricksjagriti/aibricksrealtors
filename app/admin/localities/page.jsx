"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, MapPin, CheckCircle, AlertCircle, Globe, Building2 } from "lucide-react";
import { localitiesAPI, propertiesAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

const toSlug = (name) => name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function LocalitiesPage() {
  const [registered, setRegistered] = useState([]);
  const [allLocalities, setAllLocalities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [tab, setTab] = useState("localities"); // "localities" | "cities"

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [locRes, propRes] = await Promise.all([
          localitiesAPI.getAll(),
          propertiesAPI.getAll({ limit: 500 }),
        ]);

        const registeredList = locRes.data || [];
        setRegistered(registeredList);

        const registeredNames = new Set(
          registeredList.map((l) => l.name.toLowerCase().trim())
        );

        // Extract unique locality/city combos from properties
        const fromProps = [];
        const seen = new Set();
        (propRes.data || []).forEach((p) => {
          const name = p.locality?.trim();
          const city = p.city?.trim();
          if (name && city) {
            const key = `${name.toLowerCase()}|${city.toLowerCase()}`;
            if (!seen.has(key) && !registeredNames.has(name.toLowerCase())) {
              seen.add(key);
              fromProps.push({ name, city, state: p.state || "", fromProperties: true, slug: toSlug(name) });
            }
          }
        });

        setAllLocalities([
          ...registeredList.map((l) => ({ ...l, fromProperties: false })),
          ...fromProps,
        ]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this locality?")) return;
    setDeleting(id);
    try {
      await localitiesAPI.delete(id);
      setAllLocalities((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      alert(err.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = allLocalities.filter((l) =>
    l.name?.toLowerCase().includes(search.toLowerCase()) ||
    l.city?.toLowerCase().includes(search.toLowerCase())
  );

  // Unique cities for city tab
  const allCities = [...new Set(allLocalities.map((l) => l.city).filter(Boolean))].sort();
  const filteredCities = allCities.filter((c) => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Localities</h1>
          <p className="text-sm text-gray-500">
            {registered.length} registered · {allLocalities.length - registered.length} from properties · {allCities.length} cities
          </p>
        </div>
        <Link href="/admin/localities/new" className="admin-btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Locality
        </Link>
      </div>

      <div className="admin-card p-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by locality or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input admin-input-with-icon w-full"
          />
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setTab("localities")}
            className={`px-5 py-3 text-sm font-medium ${tab === "localities" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"}`}
          >
            Localities ({filtered.length})
          </button>
          <button
            onClick={() => setTab("cities")}
            className={`px-5 py-3 text-sm font-medium ${tab === "cities" ? "border-b-2 border-purple-600 text-purple-600" : "text-gray-500"}`}
          >
            Cities ({filteredCities.length})
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : tab === "localities" ? (
          filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No localities found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Locality</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">City / State</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((loc, idx) => (
                  <tr key={loc.id || `prop-${idx}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-purple-500" />
                        <span className="font-medium text-gray-800">{loc.name}</span>
                      </div>
                      {loc.description && <p className="text-xs text-gray-400 mt-0.5 pl-6">{loc.description}</p>}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <p>{loc.city}</p>
                      {loc.state && <p className="text-xs text-gray-400">{loc.state}</p>}
                    </td>
                    <td className="px-6 py-4">
                      {loc.fromProperties ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full">
                          <AlertCircle size={12} /> From Properties
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> Registered
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/properties?locality=${encodeURIComponent(loc.name)}`}
                          className="text-xs px-2 py-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-700 flex items-center gap-1"
                          title="View Properties"
                        >
                          <Building2 size={13} /> Properties
                        </Link>
                        <Link
                          href={`/admin/properties/new?city=${encodeURIComponent(loc.city)}&locality=${encodeURIComponent(loc.name)}`}
                          className="text-xs px-2 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100"
                        >
                          + Add
                        </Link>
                        {loc.fromProperties ? (
                          <Link
                            href={`/admin/localities/new?name=${encodeURIComponent(loc.name)}&city=${encodeURIComponent(loc.city)}`}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Add Details"
                          >
                            <Edit size={16} />
                          </Link>
                        ) : (
                          <>
                            <Link
                              href={`/admin/localities/${loc.id}/edit`}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(loc.id)}
                              disabled={deleting === loc.id}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          // Cities tab
          filteredCities.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No cities found.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
              {filteredCities.map((city) => {
                const citySlug = toSlug(city);
                const count = allLocalities.filter((l) => l.city === city).length;
                return (
                  <div key={city} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-purple-500" />
                      <span className="font-semibold text-gray-800">{city}</span>
                    </div>
                    <p className="text-xs text-gray-500">{count} localit{count === 1 ? "y" : "ies"}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
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
                      <a
                        href={`/locations/${citySlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <Globe size={12} /> View Page
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}
