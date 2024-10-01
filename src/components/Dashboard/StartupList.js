"use client";

import { useState, useEffect } from "react";
import StartupCard from "./StartupCard";

export default function StartupList() {
  const [startups, setStartups] = useState([]);

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await fetch("/api/startups");
        if (!response.ok) {
          throw new Error("Failed to fetch startups");
        }
        const data = await response.json();
        setStartups(data);
      } catch (error) {
        console.error("Error fetching startups:", error);
      }
    };

    fetchStartups();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {startups.map((startup) => (
        <StartupCard key={startup.id} startup={startup} />
      ))}
    </div>
  );
}
