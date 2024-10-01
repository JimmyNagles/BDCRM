"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [editedClients, setEditedClients] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOnlyFollowUps, setShowOnlyFollowUps] = useState(false);
  const router = useRouter();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("Failed to fetch clients");
      const data = await response.json();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (id, field, value) => {
    setClients(
      clients.map((client) =>
        client.id === id
          ? {
              ...client,
              [field]: field === "nextFollowUpDate" ? new Date(value) : value,
            }
          : client
      )
    );
    setEditedClients({
      ...editedClients,
      [id]: true,
    });
  };

  const handleSave = async (id) => {
    const clientToUpdate = clients.find((client) => client.id === id);
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientToUpdate),
      });
      if (!response.ok) throw new Error("Failed to update client");
      const updatedClient = await response.json();
      setClients(clients.map((c) => (c.id === id ? updatedClient : c)));
      setEditedClients({
        ...editedClients,
        [id]: false,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) return <div>Loading clients...</div>;
  if (error) return <div>Error: {error}</div>;

  const clientsNeedingFollowUp = clients.filter(
    (client) =>
      client.nextFollowUpDate && new Date(client.nextFollowUpDate) <= new Date()
  );

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">
          Clients Needing Follow-up: {clientsNeedingFollowUp.length}
        </h2>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={showOnlyFollowUps}
            onChange={(e) => setShowOnlyFollowUps(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="ml-2 text-gray-700">
            Show only clients needing follow-up
          </span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">Actions</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">NDA Signed</th>
              <th className="px-4 py-2">Introduced By</th>
              <th className="px-4 py-2">Speaking To</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Next Follow-up Date</th>
              <th className="px-4 py-2">Save</th>
            </tr>
          </thead>
          <tbody>
            {clients
              .filter(
                (client) =>
                  !showOnlyFollowUps ||
                  (client.nextFollowUpDate &&
                    new Date(client.nextFollowUpDate) <= new Date())
              )
              .map((client) => (
                <tr
                  key={client.id}
                  className={
                    client.nextFollowUpDate &&
                    new Date(client.nextFollowUpDate) <= new Date()
                      ? "bg-yellow-100"
                      : ""
                  }
                >
                  <td className="border px-4 py-2">
                    <Link href={`/client/${client.id}`}>
                      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                        More
                      </button>
                    </Link>
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      value={client.name}
                      onChange={(e) =>
                        handleInputChange(client.id, "name", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      value={client.email}
                      onChange={(e) =>
                        handleInputChange(client.id, "email", e.target.value)
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="checkbox"
                      checked={client.ndaSigned}
                      onChange={(e) =>
                        handleInputChange(
                          client.id,
                          "ndaSigned",
                          e.target.checked
                        )
                      }
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      value={client.introducedBy}
                      onChange={(e) =>
                        handleInputChange(
                          client.id,
                          "introducedBy",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      value={client.speakingTo}
                      onChange={(e) =>
                        handleInputChange(
                          client.id,
                          "speakingTo",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      value={client.status}
                      onChange={(e) =>
                        handleInputChange(client.id, "status", e.target.value)
                      }
                      className="w-full"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Meeting Scheduled">
                        Meeting Scheduled
                      </option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="date"
                      value={
                        client.nextFollowUpDate
                          ? new Date(client.nextFollowUpDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          client.id,
                          "nextFollowUpDate",
                          e.target.value
                        )
                      }
                      className="w-full"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    {editedClients[client.id] && (
                      <button
                        onClick={() => handleSave(client.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                      >
                        Save
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
