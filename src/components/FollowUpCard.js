export default function FollowUpCard({ followUp }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {new Date(followUp.date).toLocaleDateString()} - {followUp.type}
        </h3>
      </div>
      <div className="text-gray-700">
        <p className="mb-2">
          <strong>Notes:</strong> {followUp.notes}
        </p>
        <p>
          <strong>Next Steps:</strong> {followUp.nextSteps}
        </p>
      </div>
    </div>
  );
}
