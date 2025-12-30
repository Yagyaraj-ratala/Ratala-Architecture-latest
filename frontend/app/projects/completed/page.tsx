'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Building2 } from 'lucide-react';

interface CompletedProject {
  id: number;
  title: string;
  location: string;
  category: string;
  completionDate: string;
  image: string;
  description: string;
}

export default function CompletedProjectsPage() {
  const [projects, setProjects] = useState<CompletedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null);

  // Sample completed projects data - you can replace this with API call
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          title: "Luxury Villa - Kathmandu",
          location: "Kathmandu, Nepal",
          category: "Residential",
          completionDate: "2024-01-15",
          image: "/projects/ImageR1.jpg",
          description: "A modern luxury villa featuring contemporary design with sustainable materials and smart home integration."
        },
        {
          id: 2,
          title: "Modern Corporate Office",
          location: "Lalitpur, Nepal",
          category: "Commercial",
          completionDate: "2023-11-20",
          image: "/projects/interior1.jpg",
          description: "State-of-the-art corporate office space designed for productivity and employee well-being."
        },
        {
          id: 3,
          title: "Himalayan Resort Design",
          location: "Pokhara, Nepal",
          category: "Hospitality",
          completionDate: "2023-09-10",
          image: "/projects/interior3.jpg",
          description: "Eco-friendly resort design blending traditional Nepali architecture with modern amenities."
        },
        {
          id: 4,
          title: "Elegant Home Renovation",
          location: "Bhaktapur, Nepal",
          category: "Renovation",
          completionDate: "2023-08-05",
          image: "/projects/ImageR3.jpg",
          description: "Complete renovation of a heritage home preserving traditional elements while adding modern comforts."
        },
        {
          id: 5,
          title: "Sustainable Residential Complex",
          location: "Kathmandu, Nepal",
          category: "Residential",
          completionDate: "2023-06-18",
          image: "/projects/ImageR1.jpg",
          description: "Green building residential complex with solar panels, rainwater harvesting, and energy-efficient design."
        },
        {
          id: 6,
          title: "Commercial Shopping Complex",
          location: "Kathmandu, Nepal",
          category: "Commercial",
          completionDate: "2023-04-22",
          image: "/projects/interior1.jpg",
          description: "Modern shopping complex with innovative space planning and sustainable design features."
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Completed{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              Explore our successfully completed projects that showcase our expertise and commitment to excellence
            </p>
          </motion.div>
        </div>
      </div>

      {/* Projects Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer bg-white"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                  <CheckCircle size={16} />
                  Completed
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="text-cyan-500" size={18} />
                  <span className="text-sm font-semibold text-cyan-600">{project.category}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  {project.title}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Completed: {new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mt-4 line-clamp-2">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No completed projects available yet. Please check back later.</p>
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" 
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10 bg-white rounded-full p-2 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative h-96">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                <CheckCircle size={16} />
                Completed
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="text-cyan-500" size={20} />
                <span className="text-sm font-semibold text-cyan-600">{selectedProject.category}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedProject.title}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} className="text-gray-400" />
                  <span>{selectedProject.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} className="text-gray-400" />
                  <span>Completed: {new Date(selectedProject.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Project Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

