import React, { useState } from "react";

export default function WebsiteAnalysis({
  client,
  onWebsiteUpdate,
  analysisResult,
  isProcessing,
  error,
  onAnalyzeWebsite,
}) {
  const [inputWebsite, setInputWebsite] = useState(client.website || "");

  const handleWebsiteInput = () => {
    if (!inputWebsite) return;
    onWebsiteUpdate(inputWebsite);
    onAnalyzeWebsite(inputWebsite);
  };

  const renderAnalysisSection = (title, content) => (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="bg-white p-4 rounded shadow">
        {content.split("\n").map((line, index) => (
          <p key={index} className="mb-2">
            {line}
          </p>
        ))}
      </div>
    </div>
  );

  const renderAnalysis = () => {
    if (!analysisResult || !analysisResult.analysis) return null;

    const sections = analysisResult.analysis.split(/\[([A-Z ]+)\]/);
    const renderedSections = [];

    for (let i = 1; i < sections.length; i += 2) {
      renderedSections.push(
        renderAnalysisSection(sections[i], sections[i + 1].trim())
      );
    }

    return (
      <div className="analysis-container">
        <h2 className="text-2xl font-bold mb-6">Website Analysis</h2>
        {renderedSections}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100">
      {!client.website ? (
        <div>
          <h2 className="text-xl font-bold mb-4">No Website Available</h2>
          <p>Please enter a website to start the analysis.</p>
          <input
            type="text"
            placeholder="https://example.com"
            value={inputWebsite}
            onChange={(e) => setInputWebsite(e.target.value)}
            className="border rounded p-2 mb-4 w-full"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleWebsiteInput}
          >
            Analyze Website
          </button>
        </div>
      ) : (
        <div>
          {isProcessing ? (
            <div>Loading...analyzing {client.website}...</div>
          ) : analysisResult ? (
            renderAnalysis()
          ) : (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => onAnalyzeWebsite(client.website)}
            >
              Re-analyze {client.website}
            </button>
          )}
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
