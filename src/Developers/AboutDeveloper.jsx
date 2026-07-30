import { sanitizeHtml } from "@/lib/utils/sanitizeHtml";

export default function AboutDeveloper({ builderName, developer }) {
  const about =
    developer?.about ||
    `${builderName} is a reputed real estate developer known for delivering high-quality residential and commercial projects. With a strong presence in major cities, they focus on modern design, quality construction, and timely delivery.`;

  const description = developer?.description;

  // New entries are rich-text HTML; legacy entries are plain text — keep their
  // line breaks by converting newlines to <br> when no HTML tags are present.
  const hasHtml = /<[a-z][\s\S]*?>/i.test(about);
  const aboutHtml = hasHtml
    ? sanitizeHtml(about)
    : about.replace(/\n/g, "<br />");

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-semibold mb-4">About {builderName}</h2>

      {description && (
        <p className="text-ochre font-medium text-lg mb-3">{description}</p>
      )}

      <div
        className="rich-text text-gray-600 "
        dangerouslySetInnerHTML={{ __html: aboutHtml }}
      />
    </section>
  );
}
