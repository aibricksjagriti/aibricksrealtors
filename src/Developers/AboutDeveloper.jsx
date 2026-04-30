export default function AboutDeveloper({ builderName, developer }) {
  const about =
    developer?.about ||
    `${builderName} is a reputed real estate developer known for delivering high-quality residential and commercial projects. With a strong presence in major cities, they focus on modern design, quality construction, and timely delivery.`;

  const description = developer?.description;

  return (
    <section className="py-10 max-w-7xl mx-auto px-4">
      <h2 className="text-4xl font-semibold mb-4">About {builderName}</h2>

      {description && (
        <p className="text-ochre font-medium text-lg mb-3">{description}</p>
      )}

      <p className="text-gray-600 leading-relaxed text-lg">{about}</p>

    </section>
  );
}
