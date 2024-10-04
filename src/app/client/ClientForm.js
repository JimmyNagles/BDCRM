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

    setIsSubmitting(true); // Start submission process

    try {
      await onSave(formData); // Wait until onSave completes
      // Optional: Show a success message
    } catch (err) {
      // Handle any errors from onSave here
      console.error("Failed to save client details:", err);
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" rounded-lg bg-white px-8 pt-6 pb-8 mb-4 grid gap-4 grid-cols-1 md:grid-cols-3"
    >
      {/* Name Input */}
      <div className="w-full flex flex-col">
        <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Email Input */}
      <div className="w-full flex flex-col">
        <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Introduced By Input */}
      <div className="w-full flex flex-col">
        <label
          className="text-gray-700 text-sm font-bold mb-2"
          htmlFor="introducedBy"
        >
          Introduced By
        </label>
        <input
          id="introducedBy"
          type="text"
          value={formData.introducedBy}
          onChange={(e) => handleInputChange("introducedBy", e.target.value)}
          className="p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* NDA Signed Checkbox */}
      <div className="w-full flex items-center">
        <label className="text-gray-700 text-sm font-bold" htmlFor="ndaSigned">
          <input
            id="ndaSigned"
            type="checkbox"
            checked={formData.ndaSigned}
            onChange={(e) => handleInputChange("ndaSigned", e.target.checked)}
            className="mr-2"
          />
          NDA Signed
        </label>
      </div>

      {/* Speaking To Input */}
      <div className="w-full flex flex-col">
        <label
          className="text-gray-700 text-sm font-bold mb-2"
          htmlFor="speakingTo"
        >
          Speaking To
        </label>
        <input
          id="speakingTo"
          type="text"
          value={formData.speakingTo}
          onChange={(e) => handleInputChange("speakingTo", e.target.value)}
          className="p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Status Dropdown */}
      <div className="w-full flex flex-col">
        <label
          className="text-gray-700 text-sm font-bold mb-2"
          htmlFor="status"
        >
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => handleInputChange("status", e.target.value)}
          className="p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:shadow-outline"
        >
          <option value="Lead">Lead</option>
          <option value="Meeting Scheduled">Meeting Scheduled</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* Phone Input */}
      <div className="w-full flex flex-col">
        <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          className="p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Website Input */}
      <div className="w-full flex flex-col">
        <label
          className="text-gray-700 text-sm font-bold mb-2"
          htmlFor="website"
        >
          Website
        </label>
        <input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) => handleInputChange("website", e.target.value)}
          className="p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Next Follow-up Date Input */}
      <div className="w-full flex flex-col">
        <label
          className="text-gray-700 text-sm font-bold mb-2"
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
          className="p-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:shadow-outline"
        />
      </div>

      {/* Submit Button */}
      <div className="md:col-span-3 mt-8 flex flex-row-reverse">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
