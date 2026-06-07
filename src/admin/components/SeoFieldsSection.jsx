"use client";

/**
 * Reusable SEO fields block for admin forms.
 * Expects the parent form to keep metaTitle, metaDescription,
 * metaKeywords and canonicalUrl in its state and pass its
 * standard `handleChange(e)` as `onChange`.
 */
export default function SeoFieldsSection({ values, onChange, pageUrl }) {
  const metaTitle = values?.metaTitle || "";
  const metaDescription = values?.metaDescription || "";
  const metaKeywords = values?.metaKeywords || "";
  const canonicalUrl = values?.canonicalUrl || "";

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Title</label>
        <input
          name="metaTitle"
          value={metaTitle}
          onChange={onChange}
          className="admin-input w-full"
          placeholder="Title shown in Google search results & browser tab"
        />
        <p className={`text-xs mt-1 ${metaTitle.length > 60 ? "text-amber-600" : "text-gray-400"}`}>
          {metaTitle.length}/60 characters recommended
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Description</label>
        <textarea
          name="metaDescription"
          value={metaDescription}
          onChange={onChange}
          className="admin-input w-full"
          rows={3}
          placeholder="Brief summary shown in search engine results..."
        />
        <p className={`text-xs mt-1 ${metaDescription.length > 160 ? "text-amber-600" : "text-gray-400"}`}>
          {metaDescription.length}/160 characters recommended
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Meta Keywords</label>
        <input
          name="metaKeywords"
          value={metaKeywords}
          onChange={onChange}
          className="admin-input w-full"
          placeholder="e.g., godrej properties pune, 2 bhk flats hinjewadi"
        />
        <p className="text-xs text-gray-400 mt-1">Comma-separated keywords</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Canonical URL</label>
        <input
          name="canonicalUrl"
          value={canonicalUrl}
          onChange={onChange}
          className="admin-input w-full font-mono text-sm"
          placeholder={pageUrl || "https://aibricksrealtors.com/..."}
        />
        <p className="text-xs text-gray-400 mt-1">
          Leave blank to use the default page URL{pageUrl ? `: ${pageUrl}` : ""}
        </p>
      </div>
    </div>
  );
}
