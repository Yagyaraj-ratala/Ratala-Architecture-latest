'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, MapPin, Building2, TrendingUp } from 'lucide-react';

interface OngoingProject {
  id: number;
  title: string;
  location: string;
  category: string;
  startDate: string;
  expectedCompletion: string;
  progress: number;
  image: string;
  description: string;
}

export default function OngoingProjectsPage() {
  const [projects, setProjects] = useState<OngoingProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<OngoingProject | null>(null);

  // Sample ongoing projects data - you can replace this with API call
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProjects([
        {
          id: 1,
          title: "Modern Residential Complex",
          location: "Kathmandu, Nepal",
          category: "Residential",
          startDate: "2024-02-01",
          expectedCompletion: "2024-12-31",
          progress: 65,
          image: "/projects/ImageR1.jpg",
          description: "A contemporary residential complex featuring sustainable design, smart home technology, and community spaces."
        },
        {
          id: 2,
          title: "Luxury Hotel & Resort",
          location: "Pokhara, Nepal",
          category: "Hospitality",
          startDate: "2024-01-15",
          expectedCompletion: "2025-03-30",
          progress: 45,
          image: "/projects/interior1.jpg",
          description: "Premium hotel and resort development with eco-friendly architecture and world-class amenities."
        },
        {
          id: 3,
          title: "Commercial Office Tower",
          location: "Lalitpur, Nepal",
          category: "Commercial",
          startDate: "2024-03-10",
          expectedCompletion: "2025-06-15",
          progress: 35,
          image: "/projects/interior3.jpg",
          description: "State-of-the-art commercial office tower with modern facilities and sustainable building practices."
        },
        {
          id: 4,
          title: "Heritage Building Restoration",
          location: "Bhaktapur, Nepal",
          category: "Renovation",
          startDate: "2024-02-20",
          expectedCompletion: "2024-11-30",
          progress: 55,
          image: "/projects/ImageR3.jpg",
          description: "Careful restoration of a historic building preserving traditional architecture while adding modern functionality."
        },
        {
          id: 5,
          title: "Eco-Friendly Housing Project",
          location: "Kathmandu, Nepal",
          category: "Residential",
          startDate: "2024-04-01",
          expectedCompletion: "2025-02-28",
          progress: 40,
          image: "/projects/ImageR1.jpg",
          description: "Sustainable housing development with solar energy, rainwater harvesting, and green building materials."
        },
        {
          id: 6,
          title: "Shopping Mall Complex",
          location: "Kathmandu, Nepal",
          category: "Commercial",
          startDate: "2024-01-05",
          expectedCompletion: "2025-01-20",
          progress: 50,
          image: "/projects/interior1.jpg",
          description: "Modern shopping mall with innovative design, entertainment zones, and sustainable features."
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
              Ongoing{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              Track the progress of our current projects and witness excellence in the making
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
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                  <Clock size={16} />
                  In Progress
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
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Started: {new Date(project.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-cyan-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full"
                    />
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
            <p className="text-gray-500 text-lg">No ongoing projects available at the moment. Please check back later.</p>
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
              <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold">
                <Clock size={16} />
                In Progress
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
                  <span>Started: {new Date(selectedProject.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp size={18} className="text-gray-400" />
                  <span>Expected: {new Date(selectedProject.expectedCompletion).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-900">Project Progress</span>
                  <span className="text-lg font-bold text-cyan-600">{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedProject.progress}%` }}
                    transition={{ duration: 1 }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full"
                  />
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

