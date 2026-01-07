"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Typography } from "@/app/components/ui/Typography";
import {
  Calculator,
  Home,
  Building2,
  Sparkles,
  CheckCircle2,
  Ruler
} from "lucide-react";

export default function CostCalculatorPage() {
  const [area, setArea] = useState("");
  const [buildingType, setBuildingType] = useState<"residential" | "commercial" | "villa">("residential");
  const [finish, setFinish] = useState<"standard" | "premium" | "luxury">("standard");
  const [includeDesign, setIncludeDesign] = useState(false);

  const rates: Record<"residential" | "commercial" | "villa", number> = {
    residential: 3500,
    commercial: 4500,
    villa: 5000,
  };

  const finishMultiplier: Record<"standard" | "premium" | "luxury", number> = {
    standard: 1,
    premium: 1.2,
    luxury: 1.4,
  };

  const calculateCost = () => {
    if (!area) return 0;
    let baseCost = parseFloat(area) * rates[buildingType];
    baseCost *= finishMultiplier[finish];

    if (includeDesign) {
      baseCost += parseFloat(area) * 150; // design cost per sq.ft
    }

    return Math.round(baseCost);
  };

  const buildingTypeIcons: Record<"residential" | "commercial" | "villa", typeof Home> = {
    residential: Home,
    commercial: Building2,
    villa: Sparkles,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-white overflow-hidden">
        {/* Subtle background glows */}
        <div className="absolute top-0 left-[-100px] w-[400px] h-[400px] bg-cyan-50/40 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-[-80px] w-[450px] h-[450px] bg-blue-50/40 blur-3xl rounded-full"></div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography.H1 className="mb-6">
              Construction Cost{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Calculator
              </span>
            </Typography.H1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Typography.P className="text-gray-700 text-lg md:text-xl">
              Estimate the construction and design cost for your project. Adjust
              area, building type, finish, and services to get an approximate cost.
            </Typography.P>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="relative py-16 md:py-20 bg-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-cyan-50/60 blur-[120px] rounded-full -translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-50/60 blur-[120px] rounded-full translate-x-10 translate-y-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-gray-200 space-y-8">
              {/* Area Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <label className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                  <Ruler className="w-5 h-5 text-cyan-500" />
                  Built-up Area (sq.ft)
                </label>
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter total area"
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 text-gray-800"
                />
              </motion.div>

              {/* Building Type */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <label className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                  <Building2 className="w-5 h-5 text-cyan-500" />
                  Building Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(rates) as Array<keyof typeof rates>).map((type) => {
                    const Icon = buildingTypeIcons[type];
                    const isSelected = buildingType === type;
                    return (
                      <motion.button
                        key={type}
                        type="button"
                        onClick={() => setBuildingType(type)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${isSelected
                          ? "border-cyan-500 bg-cyan-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-cyan-300"
                          }`}
                      >
                        <Icon
                          className={`w-8 h-8 mx-auto mb-2 ${isSelected ? "text-cyan-500" : "text-gray-400"
                            }`}
                        />
                        <div className={`font-semibold capitalize ${isSelected ? "text-cyan-600" : "text-gray-700"
                          }`}>
                          {type === "villa" ? "Villa / Luxury" : type}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          NPR {rates[type].toLocaleString()}/sq.ft
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Finish Quality */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <label className="flex items-center gap-2 text-gray-800 font-semibold mb-3">
                  <Sparkles className="w-5 h-5 text-cyan-500" />
                  Finish Quality
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(finishMultiplier) as Array<keyof typeof finishMultiplier>).map((finishType) => {
                    const isSelected = finish === finishType;
                    return (
                      <motion.button
                        key={finishType}
                        type="button"
                        onClick={() => setFinish(finishType)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${isSelected
                          ? "border-cyan-500 bg-cyan-50 shadow-md"
                          : "border-gray-200 bg-white hover:border-cyan-300"
                          }`}
                      >
                        <div className={`font-semibold capitalize ${isSelected ? "text-cyan-600" : "text-gray-700"
                          }`}>
                          {finishType}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {finishMultiplier[finishType] === 1
                            ? "Base rate"
                            : `+${((finishMultiplier[finishType] - 1) * 100).toFixed(0)}%`}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Design Service Checkbox */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gray-50 rounded-lg p-5 border border-gray-200"
              >
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={includeDesign}
                      onChange={() => setIncludeDesign(!includeDesign)}
                      className="w-6 h-6 rounded border-2 border-gray-300 text-cyan-500 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                    />
                    {includeDesign && (
                      <CheckCircle2 className="w-6 h-6 text-cyan-500 absolute pointer-events-none" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-800 font-semibold group-hover:text-cyan-600 transition-colors">
                      Include Architecture & Interior Design
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Additional NPR 150 per sq.ft for complete design services
                    </div>
                  </div>
                </label>
              </motion.div>

              {/* Result Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 text-center border-2 border-cyan-100 shadow-lg"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Calculator className="w-6 h-6 text-cyan-600" />
                  <Typography.H3 className="text-gray-800">
                    Estimated Total Cost
                  </Typography.H3>
                </div>
                <motion.div
                  key={calculateCost()}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3"
                >
                  NPR {calculateCost().toLocaleString()}
                </motion.div>
                <Typography.P className="text-gray-600 text-sm">
                  *Approximate estimation. Final cost may vary based on materials, location, and specific requirements.
                </Typography.P>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="relative py-16 md:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Typography.H2 className="text-gray-800 mb-6">
              Why Use Our{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Calculator?
              </span>
            </Typography.H2>
            <Typography.P className="text-gray-700 leading-relaxed">
              Our construction cost calculator provides instant, transparent estimates
              based on current market rates in Nepal. While the final cost depends on
              various factors including material quality, site conditions, and custom
              requirements, this tool gives you a realistic baseline for budgeting your
              dream project. For a detailed quotation, please contact our team.
            </Typography.P>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
