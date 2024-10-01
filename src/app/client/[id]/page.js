"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ClientForm from "../ClientForm";
import FollowUpForm from "@/components/Dashboard/FollowUpForm";
import FollowUpCard from "@/components/FollowUpCard";

export default function ClientPage({ params }) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchClient = async () => {
      setIsLoading(true);
      console.log("User ID from session:", session.user.id);
      try {
        const response = await fetch(`/api/clients/${id}`);
        if (!response.ok) throw new Error("Failed to fetch client");
        const data = await response.json();
        console.log("client data", data);
        setClient(data);
        fetchFollowUps(data.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id, session]);

  const fetchFollowUps = async (clientId) => {
    try {
      const response = await fetch(`/api/followups?clientId=${clientId}`);
      if (!response.ok) throw new Error("Failed to fetch follow-ups");
      const data = await response.json();
      console.log("follow up data", data);
      setFollowUps(data.message ? [] : data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async (updatedClient) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClient),
      });
      if (!response.ok) throw new Error("Failed to update client");
      setClient(updatedClient);

      setIsSaving(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFollowUpAdded = async (newFollowUp) => {
    setFollowUps((prevFollowUps) => [newFollowUp, ...prevFollowUps]);
    setShowFollowUpForm(false);

    if (newFollowUp.nextFollowUpDays) {
      const nextFollowUpDate = new Date();
      nextFollowUpDate.setDate(
        nextFollowUpDate.getDate() + newFollowUp.nextFollowUpDays
      );
      handleSave({ ...client, nextFollowUpDate });
    }
  };

  if (isLoading) return <div>Loading client details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/dashboard"
        className="mb-4 inline-block text-blue-500 hover:text-blue-700"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-6">{client.name}</h1>
      <ClientForm client={client} onSave={handleSave} loading={isSaving} />

      <div className="mt-8 mb-4">
        <button
          onClick={() => setShowFollowUpForm(!showFollowUpForm)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {showFollowUpForm ? "Hide Follow-up Form" : "Add Follow-up"}
        </button>
      </div>

      {showFollowUpForm && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <FollowUpForm
            clientId={id}
            userId={session.user.id}
            onFollowUpAdded={handleFollowUpAdded}
          />
        </div>
      )}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Follow-ups</h2>
        {followUps.length > 0 ? (
          <ul>
            {followUps.map((followUp) => (
              <li className="mt-2 mb-2 shadow-2xl" key={followUp.id}>
                <FollowUpCard followUp={followUp} />
              </li>
            ))}
          </ul>
        ) : (
          <p>No follow-ups yet for this client.</p>
        )}
      </div>
    </div>
  );
}
