"use client";

import { useState } from "react";

export default function AddClientForm({ onClientAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    ndaSigned: false,
    dateSigned: null,
    introducedBy: "",
    speakingTo: "",
    status: "Lead",
    nextFollowUpDate: null, // Add this line
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const dataToSend = {
      ...formData,
      dateSigned:
        formData.ndaSigned && formData.dateSigned ? formData.dateSigned : null,
      nextFollowUpDate: formData.nextFollowUpDate || null, // Add this line
    };

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create client");
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        ndaSigned: false,
        dateSigned: null,
        introducedBy: "",
        speakingTo: "",
        status: "Lead",
        nextFollowUpDate: null, // Add this line
      });

      if (onClientAdded) {
        onClientAdded();
      }
    } catch (error) {
      setError(error.message);
      console.error("Error creating client:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Company Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          value={formData.phone}
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-sm font-medium text-gray-700"
        >
          Website
        </label>
        <input
          type="url"
          name="website"
          id="website"
          value={formData.website}
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="ndaSigned"
          className="block text-sm font-medium text-gray-700"
        >
          <input
            type="checkbox"
            name="ndaSigned"
            id="ndaSigned"
            checked={formData.ndaSigned}
            onChange={handleChange}
            className="mr-2 rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          NDA Signed
        </label>
      </div>

      {formData.ndaSigned && (
        <div>
          <label
            htmlFor="dateSigned"
            className="block text-sm font-medium text-gray-700"
          >
            Date Signed
          </label>
          <input
            type="date"
            name="dateSigned"
            id="dateSigned"
            value={formData.dateSigned}
            onChange={handleChange}
            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="introducedBy"
          className="block text-sm font-medium text-gray-700"
        >
          Introduced By
        </label>
        <input
          type="text"
          name="introducedBy"
          id="introducedBy"
          value={formData.introducedBy}
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="speakingTo"
          className="block text-sm font-medium text-gray-700"
        >
          Speaking To
        </label>
        <input
          type="text"
          name="speakingTo"
          id="speakingTo"
          value={formData.speakingTo}
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          name="status"
          id="status"
          required
          value={formData.status}
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="Lead">Lead</option>
          <option value="Meeting Scheduled">Meeting Scheduled</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="nextFollowUpDate"
          className="block text-sm font-medium text-gray-700"
        >
          Next Follow-up Date (optional)
        </label>
        <input
          type="date"
          name="nextFollowUpDate"
          id="nextFollowUpDate"
          value={formData.nextFollowUpDate || ""}
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Client
      </button>
    </form>
  );
}
