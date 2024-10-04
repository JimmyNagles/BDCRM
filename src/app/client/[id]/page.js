"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ClientForm from "../ClientForm";
import FollowUpSection from "../FollowUpSection";
import FollowUpList from "../FolloUpList";
import Tabs from "../Tabs";
import WebsiteAnalysis from "../WebsiteAnalysis";

export default function ClientPage({ params }) {
  const { data: session } = useSession();
  const [isSaving, setIsSaving] = useState(false);
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [activeTab, setActiveTab] = useState("tabB");

  // State for website analysis moved up to the parent component
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchClient = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/clients/${id}`);
        if (!response.ok) throw new Error("Failed to fetch client");
        const data = await response.json();

        console.log(data);
        setClient(data);
        fetchFollowUps(data.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const fetchFollowUps = async (clientId) => {
    try {
      const response = await fetch(`/api/followups?clientId=${clientId}`);
      if (!response.ok) throw new Error("Failed to fetch follow-ups");
      const data = await response.json();
      setFollowUps(data.message ? [] : data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveAnalysis = async (analysisToSave) => {
    setIsSaving(true);
    try {
      console.log("Saving analysis:", analysisToSave);
      const response = await fetch(`/api/clients/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisResult: analysisToSave }), // Send only analysisResult for PATCH
      });

      if (!response.ok) throw new Error("Failed to save analysis");

      setClient((prevClient) => ({
        ...prevClient,
        analysisResult: analysisToSave,
      }));
      setAnalysisResult(null); // Clear the temporary analysis result
      return true; // Indicate success
    } catch (err) {
      console.error("Error saving analysis:", err);
      setError(err.message);
      return false; // Indicate failure
    } finally {
      setIsSaving(false);
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

    if (newFollowUp.nextFollowUpDays) {
      const nextFollowUpDate = new Date();
      nextFollowUpDate.setDate(
        nextFollowUpDate.getDate() + newFollowUp.nextFollowUpDays
      );
      handleSave({ ...client, nextFollowUpDate });
    }
  };

  // Handle Website Analysis in the parent component
  const handleWebsiteAnalysis = async (website) => {
    setIsProcessing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: website }),
      });

      if (!response.ok) throw new Error("Failed to scrape website");

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setAnalysisError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div>Loading client details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!client) return <div>Client not found</div>;

  return (
    <div className="">
      <Link
        href="/dashboard"
        className="mb-4 inline-block text-blue-500 hover:text-blue-700"
      >
        ← Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-6">{client.name}</h1>
      {/* Render Tabs with the three sections */}
      <Tabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabA={
          <div>
            <ClientForm
              client={client}
              onSave={handleSave}
              loading={isSaving}
            />

            <FollowUpSection
              clientId={id}
              userId={session.user.id}
              onFollowUpAdded={handleFollowUpAdded}
            />

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Follow-ups</h2>
              <FollowUpList followUps={followUps} />
            </div>
          </div>
        }
        tabB={
          <div>
            <WebsiteAnalysis
              client={client}
              analysisResult={analysisResult}
              isProcessing={isProcessing}
              error={analysisError}
              onAnalyzeWebsite={handleWebsiteAnalysis}
              onWebsiteUpdate={(newWebsite) =>
                handleSave({ ...client, website: newWebsite })
              }
              onSaveAnalysis={handleSaveAnalysis}
            />
          </div>
        }
        tabC={<div>AI Chat</div>}
      />
    </div>
  );
}
