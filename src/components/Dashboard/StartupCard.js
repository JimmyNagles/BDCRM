import Link from "next/link";

export default function StartupCard({ startup }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">{startup.name}</h2>
      <p className="text-gray-600 mb-4">{startup.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{startup.stage}</span>
        <Link
          href={`/startups/${startup.id}`}
          className="text-blue-500 hover:text-blue-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
