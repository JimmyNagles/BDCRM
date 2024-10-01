import React from "react";

function ClientPageForm({ client, onSave, onInputChange, isSaving }) {
  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          value={client.name}
          onChange={(e) => onInputChange("name", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={client.email}
          onChange={(e) => onInputChange("email", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="ndaSigned"
        >
          <input
            id="ndaSigned"
            type="checkbox"
            checked={client.ndaSigned}
            onChange={(e) => onInputChange("ndaSigned", e.target.checked)}
            className="mr-2 leading-tight"
          />
          NDA Signed
        </label>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="introducedBy"
        >
          Introduced By
        </label>
        <input
          id="introducedBy"
          type="text"
          value={client.introducedBy}
          onChange={(e) => onInputChange("introducedBy", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="speakingTo"
        >
          Speaking To
        </label>
        <input
          id="speakingTo"
          type="text"
          value={client.speakingTo}
          onChange={(e) => onInputChange("speakingTo", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="status"
        >
          Status
        </label>
        <select
          id="status"
          value={client.status}
          onChange={(e) => onInputChange("status", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Lead">Lead</option>
          <option value="Meeting Scheduled">Meeting Scheduled</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isSaving ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default ClientPageForm;
