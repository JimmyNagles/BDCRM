import React from "react";

const Tabs = ({ activeTab, onTabChange, tabA, tabB, tabC }) => {
  return (
    <div className="min-h-screen">
      {/* Tabs container */}
      <div className="bg-white rounded-xl inline-block">
        <div className="flex space-x-2">
          <button
            className={`p-2 text-xs md:text-lg rounded-xl rounded-r-none transform transition-transform duration-300 ease-in-out ${
              activeTab === "tabA"
                ? "bg-black text-white scale-105"
                : "bg-white text-black"
            }`}
            onClick={() => onTabChange("tabA")}
          >
            Client Details
          </button>
          <button
            className={`p-2 text-xs md:text-lg transform transition-transform duration-300 ease-in-out ${
              activeTab === "tabB"
                ? "bg-black text-white scale-105"
                : "bg-white text-black"
            }`}
            onClick={() => onTabChange("tabB")}
          >
            AI Research
          </button>
          <button
            className={`p-2 text-xs md:text-lg rounded-xl rounded-l-none transform transition-transform duration-300 ease-in-out ${
              activeTab === "tabC"
                ? "bg-black text-white scale-105"
                : "bg-white text-black"
            }`}
            onClick={() => onTabChange("tabC")}
          >
            AI Chat
          </button>
        </div>
      </div>
      {/* Tab content */}
      <div className="w-full mt-8">
        {activeTab === "tabA" && tabA}
        {activeTab === "tabB" && tabB}
        {activeTab === "tabC" && tabC}
      </div>
    </div>
  );
};

export default Tabs;
