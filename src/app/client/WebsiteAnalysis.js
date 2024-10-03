import React, { useState, useEffect } from "react";

export default function WebsiteAnalysis({
  client,
  onWebsiteUpdate,
  analysisResult,
  isProcessing,
  error,
  onAnalyzeWebsite,
}) {
  const [inputWebsite, setInputWebsite] = useState(client.website || "");
  const [expandedPages, setExpandedPages] = useState({});

  useEffect(() => {
    console.log("Analysis Result:", analysisResult);
  }, [analysisResult]);

  const handleWebsiteInput = () => {
    if (!inputWebsite) return;
    onWebsiteUpdate(inputWebsite);
    onAnalyzeWebsite(inputWebsite);
  };

  const togglePageExpansion = (index) => {
    console.log("Toggling page:", index);
    setExpandedPages((prev) => {
      const newState = { ...prev, [index]: !prev[index] };
      console.log("New expanded state:", newState);
      return newState;
    });
  };

  const renderPageContent = (page, index) => {
    const isExpanded = expandedPages[index];
    const content = page.content || "No content available";
    console.log(`Page ${index} expanded:`, isExpanded);
    console.log(`Page ${index} content length:`, content.length);

    return (
      <div>
        <pre className="text-xs bg-gray-50 p-2 rounded mt-2 whitespace-pre-wrap">
          {isExpanded ? content : `${content.slice(0, 200)}...`}
        </pre>
        <button
          className="mt-2 text-blue-500 underline"
          onClick={() => togglePageExpansion(index)}
        >
          {isExpanded ? "Show Less" : "Show More"}
        </button>
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
            <div>
              <h2 className="text-xl font-bold mb-4">Analysis Results</h2>
              {analysisResult.pages.map((page, index) => (
                <div key={index} className="mb-4 p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">{page.page}</h3>
                  <p>URL: {page.url}</p>
                  {renderPageContent(page, index)}
                </div>
              ))}
            </div>
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
