"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClientList from "@/components/Dashboard/ClientList";
import AddClientForm from "@/components/Dashboard/AddClientForm";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAddClientForm, setShowAddClientForm] = useState(false);
  const [refreshClientList, setRefreshClientList] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleClientAdded = () => {
    setShowAddClientForm(false);
    setRefreshClientList((prev) => !prev); // Toggle this to trigger a refresh
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {session.user.name}</h1>
      <div className="p-4 mb-6">
        <button
          className="bg-black text-white p-2 rounded"
          onClick={() => setShowAddClientForm(!showAddClientForm)}
        >
          {showAddClientForm ? "Hide Add Client Form" : "Add Client +"}
        </button>
        {showAddClientForm && (
          <div className="mt-4">
            <AddClientForm onClientAdded={handleClientAdded} />
          </div>
        )}
      </div>
      <ClientList key={refreshClientList} />
    </div>
  );
}
