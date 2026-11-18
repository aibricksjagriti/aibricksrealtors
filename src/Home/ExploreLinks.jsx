import Link from "next/link";
import { getSiteDirectory } from "@/lib/data/siteDirectory";

/**
 * Server-rendered link hub. The homepage's project carousels load on the
 * client, so their cards never appear in the HTML Google receives; this block
 * puts a plain <a href> to every active project, developer and city in the
 * served HTML so each one is one click from the homepage.
 */
export default async function ExploreLinks() {
  const { properties, developers, cities } = await getSiteDirectory();
  if (!properties.length && !developers.length) return null;

  const groups = [
    { title: "New projects", items: properties.map((p) => ({ href: p.path, label: p.name })) },
    { title: "Top developers", items: developers.map((d) => ({ href: d.path, label: d.name })), more: { href: "/developers", label: "All developers" } },
    { title: "Cities", items: cities.map((c) => ({ href: c.path, label: `Properties in ${c.name}` })), more: { href: "/locations", label: "All locations" } },
  ].filter((g) => g.items.length);

  return (
    <section aria-labelledby="explore-heading" className="max-w-7xl mx-auto px-4 py-12">
      <h2 id="explore-heading" className="text-2xl md:text-3xl font-semibold text-[var(--color-darkgray)] mb-6">
        Explore projects, developers and cities
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-lg font-semibold mb-3">{group.title}</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-brickred hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
              {group.more && (
                <li className="pt-1">
                  <Link href={group.more.href} className="font-semibold text-brickred hover:underline">
                    {group.more.label} →
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
