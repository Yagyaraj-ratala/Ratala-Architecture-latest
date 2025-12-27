"use client";
import { useState } from "react";


export default function CostCalculatorPage() {
  const [area, setArea] = useState("");
  const [buildingType, setBuildingType] = useState("residential");
  const [finish, setFinish] = useState("standard");
  const [includeDesign, setIncludeDesign] = useState(false);

  const rates = {
    residential: 3500,
    commercial: 4500,
    villa: 5000,
  };

  const finishMultiplier = {
    standard: 1,
    premium: 1.2,
    luxury: 1.4,
  };

  const calculateCost = () => {
    if (!area) return 0;
    let baseCost = area * rates[buildingType];
    baseCost *= finishMultiplier[finish];

    if (includeDesign) {
      baseCost += area * 150; // design cost per sq.ft
    }

    return Math.round(baseCost);
  };

  return (
    <div className="pt-24 pb-16 px-6 bg-white">
      {/* Page Title */}
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-10">
        Construction Cost{" "}
        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
          Calculator
        </span>
      </h1>

      <div className="max-w-5xl mx-auto text-lg text-gray-700 leading-relaxed space-y-14">
        {/* Intro */}
        <p className="text-center">
          Estimate the construction and design cost for your project. Adjust
          area, building type, finish, and services to get an approximate cost.
        </p>

        {/* Calculator Form */}
        <div className="bg-gray-50 p-8 rounded-lg shadow-md space-y-6">
          {/* Area */}
          <div>
            <label className="font-semibold">Built-up Area (sq.ft)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="Enter total area"
              className="w-full mt-2 px-4 py-3 border rounded-md focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Building Type */}
          <div>
            <label className="font-semibold">Building Type</label>
            <select
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
              className="w-full mt-2 px-4 py-3 border rounded-md focus:ring-2 focus:ring-cyan-500"
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="villa">Villa / Luxury Home</option>
            </select>
          </div>

          {/* Finish Quality */}
          <div>
            <label className="font-semibold">Finish Quality</label>
            <select
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              className="w-full mt-2 px-4 py-3 border rounded-md focus:ring-2 focus:ring-cyan-500"
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          {/* Design Service */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeDesign}
              onChange={() => setIncludeDesign(!includeDesign)}
              className="w-5 h-5"
            />
            <label className="font-semibold">
              Include Architecture & Interior Design
            </label>
          </div>

          {/* Result */}
          <div className="bg-white p-6 rounded-md border text-center">
            <h2 className="text-xl font-semibold mb-2">Estimated Cost</h2>
            <p className="text-3xl font-bold text-cyan-600">
              NPR {calculateCost().toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              *Approximate estimation. Final cost may vary.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
