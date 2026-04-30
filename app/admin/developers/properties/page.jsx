"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Building2, MapPin, ExternalLink, Globe } from "lucide-react";
import { propertiesAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

const formatPrice = (p) => {
  if (!p) return "—";
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  return `₹${(p / 100000).toFixed(0)} L`;
};

const toSlug = (name) =>
  name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function DeveloperPropertiesPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "";
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    propertiesAPI.getAll({ limit: 300 })
      .then((res) => {
        const matched = (res.data || []).filter((p) => {
          const bn = (p.builderName || "").toLowerCase().trim();
          const dn = name.toLowerCase().trim();
          return bn === dn || bn.includes(dn) || dn.includes(bn);
        });
        setProperties(matched);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [name]);

  if (!name) return <div className="p-8 text-center text-gray-500">No developer name provided.</div>;

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <Link href="/admin/developers" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2">
          <ArrowLeft size={18} className="mr-2" /> Back to Developers
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
            <p className="text-sm text-gray-500">This developer is currently coming from properties only. Create a custom page to edit its title, about text, media, and bullet points.</p>
          </div>
          <div className="flex gap-3">
            <a
              href={`/developers/${toSlug(name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn-secondary flex items-center gap-2"
            >
              <Globe size={16} /> View Page
            </a>
            <Link
              href={`/admin/properties/new?developer=${encodeURIComponent(name)}`}
              className="admin-btn-primary flex items-center gap-2"
            >
              <Plus size={18} /> Add Property
            </Link>
          </div>
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Properties ({loading ? "..." : properties.length})</h2>
          <Link
            href={`/admin/properties/new?developer=${encodeURIComponent(name)}`}
            className="admin-btn-primary text-sm flex items-center gap-1 py-1.5"
          >
            <Plus size={15} /> Add Property
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No properties found for {name}</p>
            <Link
              href={`/admin/properties/new?developer=${encodeURIComponent(name)}`}
              className="mt-3 admin-btn-primary inline-flex items-center gap-2"
            >
              <Plus size={16} /> Add Property
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.mainPropertyImage || p.imageGallery?.[0] ? (
                        <img src={p.mainPropertyImage || p.imageGallery[0]} alt={p.propertyTitle} className="w-12 h-10 rounded object-cover border" />
                      ) : (
                        <div className="w-12 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <Building2 size={16} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{p.propertyTitle}</p>
                        <p className="text-xs text-gray-500">{p.propertyType}{p.subType ? ` · ${p.subType}` : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={12} /> {[p.locality, p.city].filter(Boolean).join(", ")}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-brickred">{formatPrice(p.totalPrice || p.monthlyRent)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.activeStatus === "Yes" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.activeStatus === "Yes" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/properties/${p.id}/edit`} className="text-xs px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600">Edit</Link>
                      <a href={`/properties/${p.id}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-500 hover:text-purple-600">
                        <ExternalLink size={14} />
                      </a>
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
