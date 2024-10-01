import { useState, useEffect } from "react";

export default function ClientForm({ client, onSave }) {
  const [formData, setFormData] = useState(client);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(client);
  }, [client]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    onSave(formData);

    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
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
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
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
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
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
            checked={formData.ndaSigned}
            onChange={(e) => handleInputChange("ndaSigned", e.target.checked)}
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
          value={formData.introducedBy}
          onChange={(e) => handleInputChange("introducedBy", e.target.value)}
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
          value={formData.speakingTo}
          onChange={(e) => handleInputChange("speakingTo", e.target.value)}
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
          value={formData.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Lead">Lead</option>
          <option value="Meeting Scheduled">Meeting Scheduled</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="nextFollowUpDate"
        >
          Next Follow-up Date
        </label>
        <input
          id="nextFollowUpDate"
          type="date"
          value={
            formData.nextFollowUpDate
              ? new Date(formData.nextFollowUpDate).toISOString().split("T")[0]
              : ""
          }
          onChange={(e) =>
            handleInputChange("nextFollowUpDate", e.target.value)
          }
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={() => (e) => {
            e.preventDefault();
            console.log("clicked");
            setIsSubmitting(true);
          }}
          className="bg-blue-500 disabled:bg-slate-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
