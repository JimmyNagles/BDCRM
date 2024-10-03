import { useState } from "react";
import FollowUpForm from "@/components/Dashboard/FollowUpForm";

export default function FollowUpSection({ clientId, userId, onFollowUpAdded }) {
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);

  return (
    <div className="mt-8 mb-4">
      <button
        onClick={() => setShowFollowUpForm(!showFollowUpForm)}
        className="bg-black hover:bg-green-700 mb-8 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {showFollowUpForm ? "Hide Follow-up Form" : "Add Follow-up"}
      </button>

      {showFollowUpForm && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <FollowUpForm
            clientId={clientId}
            userId={userId}
            onFollowUpAdded={onFollowUpAdded}
          />
        </div>
      )}
    </div>
  );
}
