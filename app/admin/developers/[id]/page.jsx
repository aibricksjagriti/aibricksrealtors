"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Plus, Edit, Globe, Building2, MapPin, ExternalLink
} from "lucide-react";
import { developersAPI, propertiesAPI } from "@/src/admin/utils/api";
import "@/src/admin/styles/admin.css";

const formatPrice = (p) => {
  if (!p) return "—";
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
  return `₹${(p / 100000).toFixed(0)} L`;
};

export default function DeveloperDetailPage() {
  const params = useParams();
  const id = params.id;
  const [developer, setDeveloper] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const devRes = await developersAPI.getById(id);
        const dev = devRes.data;
        setDeveloper(dev);

        // Load properties for this developer by name
        if (dev?.name) {
          const propRes = await propertiesAPI.getAll({ limit: 200 });
          const matched = (propRes.data || []).filter((p) => {
            const bn = (p.builderName || "").toLowerCase().trim();
            const dn = dev.name.toLowerCase().trim();
            return bn === dn || bn.includes(dn) || dn.includes(bn);
          });
          setProperties(matched);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!developer) return <div className="p-8 text-center text-gray-500">Developer not found.</div>;

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/developers" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-2">
            <ArrowLeft size={18} className="mr-2" /> Back to Developers
          </Link>
          <div className="flex items-center gap-4">
            {developer.logo ? (
              <img src={developer.logo} alt={developer.name} className="w-16 h-16 rounded-xl object-contain border bg-white p-1" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center">
                <Building2 size={28} className="text-purple-600" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{developer.name}</h1>
              {developer.description && <p className="text-gray-500 text-sm">{developer.description}</p>}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <a
            href={`/developers/${developer.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-btn-secondary flex items-center gap-2"
          >
            <Globe size={16} /> View Page
          </a>
          <Link
            href={`/admin/properties/new?developer=${encodeURIComponent(developer.name)}`}
            className="admin-btn-primary flex items-center gap-2"
          >
            <Plus size={18} /> Add Property
          </Link>
          <Link href={`/admin/developers/${id}/edit`} className="admin-btn-secondary flex items-center gap-2">
            <Edit size={16} /> Edit
          </Link>
        </div>
      </div>

      {/* Developer Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Hero</p>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-800">{developer.tagline || `${developer.name} Projects`}</p>
            <p className="text-gray-500">{developer.banner ? "Custom banner uploaded" : "Using default banner"}</p>
          </div>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Stats</p>
          <div className="space-y-2 text-sm">
            <p className="text-2xl font-bold text-gray-800">{properties.length}</p>
            <p className="text-gray-500">Properties listed</p>
          </div>
        </div>
        <div className="admin-card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Slug / URL</p>
          <p className="font-mono text-sm text-gray-700 break-all">/developers/{developer.slug}</p>
          <a
            href={`/developers/${developer.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-xs text-purple-600 hover:underline flex items-center gap-1"
          >
            <ExternalLink size={12} /> Open developer page
          </a>
        </div>
      </div>

      {/* About */}
      {developer.about && (
        <div className="admin-card p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">About</p>
          <p className="text-sm text-gray-700 leading-relaxed">{developer.about}</p>
        </div>
      )}

      {/* Properties */}
      <div className="admin-card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">
            Properties ({properties.length})
          </h2>
          <Link
            href={`/admin/properties/new?developer=${encodeURIComponent(developer.name)}`}
            className="admin-btn-primary text-sm flex items-center gap-1 py-1.5"
          >
            <Plus size={15} /> Add Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="p-8 text-center">
            <Building2 size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No properties yet</p>
            <p className="text-sm text-gray-400 mb-4">Add the first property for {developer.name}</p>
            <Link
              href={`/admin/properties/new?developer=${encodeURIComponent(developer.name)}`}
              className="admin-btn-primary inline-flex items-center gap-2"
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
                        <img
                          src={p.mainPropertyImage || p.imageGallery[0]}
                          alt={p.propertyTitle}
                          className="w-12 h-10 rounded object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-10 rounded bg-gray-100 flex items-center justify-center">
                          <Building2 size={16} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{p.propertyTitle}</p>
                        <p className="text-xs text-gray-500">{p.propertyType} · {p.subType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={12} /> {p.locality}{p.city ? `, ${p.city}` : ""}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-brickred">{formatPrice(p.totalPrice || p.monthlyRent)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      p.activeStatus === "Yes"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {p.activeStatus === "Yes" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/properties/${p.id}/edit`}
                        className="text-xs px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50 text-gray-600"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/properties/${p.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-gray-500 hover:text-purple-600"
                      >
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
