export default function ProjectCard({ project }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-3">
      <img
        src="/project.jpg"
        className="w-full h-48 object-cover rounded-lg"
        alt={project.projectName}
      />

      <h3 className="text-lg font-semibold mt-3">{project.projectName}</h3>

      <p className="text-sm text-gray-500">
        {project.locality}, {project.city}
      </p>

      <p className="mt-2 text-primary font-medium">
        ₹ {project.totalPrice.toLocaleString()}
      </p>

      <p className="text-sm text-gray-600">
        {Array.isArray(project.subTypes) && project.subTypes.length > 0
          ? project.subTypes.join(", ")
          : project.subType || ""}
      </p>

      <button className="mt-3 w-full bg-primary text-white py-2 rounded">
        View Details
      </button>
    </div>
  );
}
