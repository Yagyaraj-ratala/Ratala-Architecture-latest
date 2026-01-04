'use client';

import { useState } from 'react';

interface FormData {
  plot: {
    length: number;
    breadth: number;
    height: number;
    facing: string;
    vastu: string;
  };
  designFor: string;
  roomPlacement: {
    kitchenLocation: string;
    masterBedroomLocation: string;
    toiletDirection: string;
  };
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
      facing: 'East',
      vastu: 'Yes'
    },
    designFor: 'Living Room',
    roomPlacement: {
      kitchenLocation: 'SE',
      masterBedroomLocation: 'NE',
      toiletDirection: 'Attached'
    },
    interior: {
      designStyle: 'Modern',
      colorPreference: 'White and Grey',
      flooringType: 'Tiles',
      ceilingDesign: 'Simple',
      lightingPreference: 'Warm'
    },
    budget: 'Medium',
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
    const { plot, designFor, roomPlacement, interior, budget, outputType } = data;
    
    let prompt = `Design a ${interior.designStyle.toLowerCase()} residential ${designFor.toLowerCase()} layout on a plot of ${plot.length}ft x ${plot.breadth}ft x ${plot.height}ft facing ${plot.facing}`;
    
    if (plot.vastu === 'Yes') {
      prompt += ` with Vastu compliance`;
    } else if (plot.vastu === 'Custom') {
      prompt += ` with custom Vastu considerations`;
    }
    
    prompt += `. `;
    
    if (roomPlacement.kitchenLocation) {
      prompt += `Place Kitchen in ${roomPlacement.kitchenLocation} direction. `;
    }
    
    if (roomPlacement.masterBedroomLocation) {
      prompt += `Place Master Bedroom in ${roomPlacement.masterBedroomLocation} direction. `;
    }
    
    if (roomPlacement.toiletDirection) {
      prompt += `Toilet placement: ${roomPlacement.toiletDirection}. `;
    }
    
    prompt += `Interior design style: ${interior.designStyle} with ${interior.colorPreference} color scheme. `;
    prompt += `Flooring: ${interior.flooringType}, Ceiling: ${interior.ceilingDesign}, Lighting: ${interior.lightingPreference}. `;
    prompt += `Budget range: ${budget}. `;
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Architecture & Interior Design</h2>
      <p className="text-gray-600 font-semibold mb-8">Fill the form for custom design</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Plot Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Details</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facing
              </label>
              <select
                value={formData.plot.facing}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  plot: { ...prev.plot, facing: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North">North</option>
                <option value="South">South</option>
              </select>
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
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Design For */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Design For</h3>
          <select
            value={formData.designFor}
            onChange={(e) => setFormData(prev => ({ ...prev, designFor: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="Living Room">Living Room</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Dining Area">Dining Area</option>
            <option value="Pooja Room">Pooja Room</option>
            <option value="Study Room">Study Room</option>
          </select>
        </div>

        {/* Room Placement Preferences */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Room Placement Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Kitchen Location
              </label>
              <select
                value={formData.roomPlacement.kitchenLocation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  roomPlacement: { ...prev.roomPlacement, kitchenLocation: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="SE">SE</option>
                <option value="NW">NW</option>
                <option value="NE">NE</option>
                <option value="SW">SW</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Master Bedroom Location
              </label>
              <select
                value={formData.roomPlacement.masterBedroomLocation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  roomPlacement: { ...prev.roomPlacement, masterBedroomLocation: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="NE">NE</option>
                <option value="NW">NW</option>
                <option value="SE">SE</option>
                <option value="SW">SW</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Toilet Direction
              </label>
              <select
                value={formData.roomPlacement.toiletDirection}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  roomPlacement: { ...prev.roomPlacement, toiletDirection: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                
\                <option value="NW">NW</option>
                <option value="NE">NE</option>
                <option value="SE">SE</option>
                <option value="SW">SW</option>
               
              </select>
            </div>
          </div>
        </div>

        {/* Interior Preferences */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Interior Preferences</h3>
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
                <option value="Warm">Warm</option>
                <option value="Neutral">Neutral</option>
                <option value="Cool">Cool</option>
              </select>
            </div>
          </div>
        </div>

        {/* Budget & Output */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Budget & Output</h3>
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
                {['Floor Plan', '3D View', 'Interior Renders'].map((type) => (
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
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg"
          >
            Generate Design 
          </button>
        </div>
      </form>
    </div>
  );
}

