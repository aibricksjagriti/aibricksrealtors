import Link from "next/link";
import { getSiteDirectory } from "@/lib/data/siteDirectory";
import { buildMetadata } from "@/lib/utils/seo";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Top Real Estate Developers in Pune | AI Bricks Realtors",
  description:
    "Browse leading real estate developers in Pune — Lodha, Godrej, Kohinoor, VTP, Kolte Patil and more. See every builder's ongoing and new launch projects in one place.",
  path: "/developers",
});

export default async function DevelopersIndexPage() {
  const { developers, properties } = await getSiteDirectory();

  const projectsFor = (name) => {
    const n = name.toLowerCase();
    return properties.filter((p) => {
      const b = p.builderName.toLowerCase();
      return b && (b === n || b.includes(n) || n.includes(b));
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 mt-28">
      <h1 className="text-2xl md:text-4xl font-bold mb-2 text-center">
        Real Estate Developers
      </h1>
      <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
        Explore projects from {developers.length || "leading"} trusted builders. Buy
        directly from the developer with AI Bricks Realtors — verified projects, no
        brokerage.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {developers.map((dev) => {
          const projects = projectsFor(dev.name);
          return (
            <li key={dev.slug} className="border rounded-xl p-5 hover:shadow-md hover:border-brickred transition-all">
              <h2 className="font-semibold text-lg text-gray-800">
                <Link href={dev.path} className="hover:text-brickred">
                  {dev.name}
                </Link>
              </h2>
              {dev.tagline && <p className="text-sm text-gray-500 mt-1">{dev.tagline}</p>}
              {projects.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm">
                  {projects.map((p) => (
                    <li key={p.path}>
                      <Link href={p.path} className="text-gray-600 hover:text-brickred hover:underline">
                        {p.name}
                        {p.locality ? `, ${p.locality}` : ""}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link href={dev.path} className="inline-block mt-3 text-sm font-semibold text-brickred hover:underline">
                View {dev.name} projects →
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
