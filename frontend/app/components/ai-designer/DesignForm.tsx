'use client';

import { useState } from 'react';

interface FormData {
  plot: {
    length: number;
    breadth: number;
    height: number;
    vastu: string;
  };
  designFor: string;
  interior: {
    designStyle: string;
    colorPreference: string;
    flooringType: string;
    ceilingDesign: string;
    lightingPreference: string;
  };
  budget: string;
  outputType: string[];
}

interface DesignFormProps {
  onSubmit: (formData: FormData, prompt: string) => void;
}

export default function DesignForm({ onSubmit }: DesignFormProps) {
  const [formData, setFormData] = useState<FormData>({
    plot: {
      length: 12,
      breadth: 18,
      height: 10,
      vastu: 'none'
    },
    designFor: 'none',
    interior: {
      designStyle: 'none',
      colorPreference: 'none',
      flooringType: 'none',
      ceilingDesign: 'none',
      lightingPreference: 'none'
    },
    budget: 'none',
    outputType: ['Floor Plan']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.plot.length <= 0) newErrors['plot.length'] = 'Length is required';
    if (formData.plot.breadth <= 0) newErrors['plot.breadth'] = 'Breadth is required';
    if (formData.plot.height <= 0) newErrors['plot.height'] = 'Height is required';
    if (!formData.interior.colorPreference.trim()) {
      newErrors['interior.colorPreference'] = 'Color preference is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateDesignPrompt = (data: FormData): string => {
    const { plot, designFor, interior, budget, outputType } = data;

    let prompt = `Design a ${interior.designStyle === 'none' ? 'custom' : interior.designStyle.toLowerCase()} residential ${designFor === 'none' ? 'space' : designFor.toLowerCase()} layout on a plot of ${plot.length}ft x ${plot.breadth}ft x ${plot.height}ft`;

    if (plot.vastu !== 'none') {
      prompt += ` with ${plot.vastu === 'Custom' ? 'custom Vastu considerations' : 'Vastu compliance'}. `;
    }

    prompt += `Interior design style: ${interior.designStyle === 'none' ? 'Modern' : interior.designStyle} with ${interior.colorPreference === 'none' ? 'professionally curated' : interior.colorPreference} color scheme. `;
    prompt += `Flooring: ${interior.flooringType === 'none' ? 'Standard' : interior.flooringType}, Ceiling: ${interior.ceilingDesign === 'none' ? 'Standard' : interior.ceilingDesign}, Lighting: ${interior.lightingPreference === 'none' ? 'Ambient' : interior.lightingPreference}. `;
    prompt += `Budget range: ${budget === 'none' ? 'Medium' : budget}. `;
    prompt += `Required outputs: ${outputType.join(', ')}. `;

    prompt += `Ensure functional adjacency, natural light optimization, proper circulation, and professional architectural standards. Include detailed floor plans, furniture placement, and interior design concepts.`;

    return prompt;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const prompt = generateDesignPrompt(formData);
      onSubmit(formData, prompt);
    }
  };

  const handleOutputTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      outputType: prev.outputType.includes(type)
        ? prev.outputType.filter(t => t !== type)
        : [...prev.outputType, type]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
          AI Architecture & Interior Design
        </h2>
        <p className="text-gray-500 font-medium text-lg">
          Personalize your vision with our specialized design engine
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Plot Details */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm font-black">01</span>
            Plot & Property Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length (ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.plot.length || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  plot: { ...prev.plot, length: parseFloat(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              {errors['plot.length'] && (
                <p className="text-red-500 text-xs mt-1">{errors['plot.length']}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breadth (ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.plot.breadth || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  plot: { ...prev.plot, breadth: parseFloat(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              {errors['plot.breadth'] && (
                <p className="text-red-500 text-xs mt-1">{errors['plot.breadth']}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (ft)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.plot.height || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  plot: { ...prev.plot, height: parseFloat(e.target.value) || 0 }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              {errors['plot.height'] && (
                <p className="text-red-500 text-xs mt-1">{errors['plot.height']}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vastu Compliance
            </label>
            <select
              value={formData.plot.vastu}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                plot: { ...prev.plot, vastu: e.target.value }
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="none">none</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Design For */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-black">02</span>
            Space Focus
          </h3>
          <select
            value={formData.designFor}
            onChange={(e) => setFormData(prev => ({ ...prev, designFor: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="none">none</option>
            <option value="Living Room">Living Room</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Dining Area">Dining Area</option>
            <option value="Pooja Room">Pooja Room</option>
            <option value="Study Room">Study Room</option>
          </select>
        </div>

        {/* Interior Preferences */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-sm font-black">04</span>
            Aesthetic & Style
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Design Style
              </label>
              <select
                value={formData.interior.designStyle}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  interior: { ...prev.interior, designStyle: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="none">none</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Modern">Modern</option>
                <option value="Contemporary">Contemporary</option>
                <option value="Minimalist">Minimalist</option>
                <option value="Traditional">Traditional</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Preference
              </label>
              <input
                type="text"
                value={formData.interior.colorPreference}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  interior: { ...prev.interior, colorPreference: e.target.value }
                }))}
                placeholder="e.g., White and Grey"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
              {errors['interior.colorPreference'] && (
                <p className="text-red-500 text-xs mt-1">{errors['interior.colorPreference']}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flooring Type
              </label>
              <select
                value={formData.interior.flooringType}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  interior: { ...prev.interior, flooringType: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="none">none</option>
                <option value="Tiles">Tiles</option>
                <option value="Wooden">Wooden</option>
                <option value="Marble">Marble</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ceiling Design
              </label>
              <select
                value={formData.interior.ceilingDesign}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  interior: { ...prev.interior, ceilingDesign: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="none">none</option>
                <option value="Simple">Simple</option>
                <option value="Decorative">Decorative</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lighting Preference
              </label>
              <select
                value={formData.interior.lightingPreference}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  interior: { ...prev.interior, lightingPreference: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="none">none</option>
                <option value="Warm">Warm</option>
                <option value="Neutral">Neutral</option>
                <option value="Cool">Cool</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget & Output */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-sm font-black">05</span>
            Outcome & Investment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="none">none</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Type
              </label>
              <div className="space-y-2">
                {['Floor Plan', '2D', '3D'].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.outputType.includes(type)}
                      onChange={() => handleOutputTypeChange(type)}
                      className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center md:justify-end py-6">
          <button
            type="submit"
            className="group relative px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative flex items-center gap-2">
              Generate Design Concept
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

