import React, { useState, useEffect } from "react";

export default function WebsiteAnalysis({
  client,
  onWebsiteUpdate,
  analysisResult,
  isProcessing,
  error,
  onAnalyzeWebsite,
  onSaveAnalysis,
}) {
  const [inputWebsite, setInputWebsite] = useState(client.website || "");
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    console.log("Initial client:", client);
    console.log("Initial analysisResult:", analysisResult);
  }, [client, analysisResult]);

  const handleWebsiteInput = () => {
    if (!inputWebsite) return;
    onWebsiteUpdate(inputWebsite);
    onAnalyzeWebsite(inputWebsite);
    setSaveStatus(null);
  };

  const handleSaveAnalysis = async () => {
    try {
      console.log("Saving analysis:", analysisResult.analysis);
      await onSaveAnalysis(analysisResult.analysis);
      setSaveStatus("success");
    } catch (err) {
      console.error("Error saving analysis:", err);
      setSaveStatus("error");
    }
  };

  const renderAnalysisSection = (title, content) => (
    <div key={title} className="mb-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="bg-white p-4 rounded shadow">
        {content.split("\n").map((line, index) => (
          <p key={index} className="mb-2">
            {line.trim()}
          </p>
        ))}
      </div>
    </div>
  );

  const renderAnalysis = () => {
    // Safely check if `analysisResult` is an object and extract the `analysis` field
    const analysisToRender =
      typeof analysisResult === "object" && analysisResult !== null
        ? analysisResult.analysis
        : typeof analysisResult === "string"
        ? analysisResult
        : typeof client.analysisResult === "object" &&
          client.analysisResult !== null
        ? client.analysisResult.analysis
        : client.analysisResult || "";

    console.log("Analysis to render:", analysisToRender);

    if (!analysisToRender || analysisToRender === "No analysis available") {
      return <p>{analysisToRender}</p>; // Display the default message if empty
    }

    const sections = analysisToRender.split(/\[([A-Z ]+)\]/g);
    const renderedSections = [];

    for (let i = 1; i < sections.length; i += 2) {
      if (sections[i] && sections[i + 1]) {
        renderedSections.push(
          renderAnalysisSection(sections[i], sections[i + 1].trim())
        );
      }
    }

    return (
      <div className="analysis-container">
        <h2 className="text-2xl font-bold mb-6">Website Analysis</h2>
        {renderedSections.length > 0 ? (
          renderedSections
        ) : (
          <p>No sections found in the analysis.</p>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Website Analysis</h2>
        <input
          type="text"
          placeholder="https://example.com"
          value={inputWebsite}
          onChange={(e) => setInputWebsite(e.target.value)}
          className="border rounded p-2 mb-4 w-full"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={handleWebsiteInput}
          disabled={isProcessing}
        >
          {client.analysisResult ? "Re-analyze Website" : "Analyze Website"}
        </button>
        {(analysisResult || client.analysisResult) && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleSaveAnalysis}
            disabled={isProcessing}
          >
            Save Analysis
          </button>
        )}
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Analyzing {inputWebsite}...</span>
        </div>
      )}

      {error && <p className="text-red-500 mt-4 mb-4">{error}</p>}

      {saveStatus === "success" && (
        <p className="text-green-500 mt-4 mb-4">Analysis saved successfully!</p>
      )}

      {saveStatus === "error" && (
        <p className="text-red-500 mt-4 mb-4">
          Failed to save analysis. Please try again.
        </p>
      )}

      {renderAnalysis()}
    </div>
  );
}
