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

interface ApiProject {
  id: number;
  status: string;
  project_type: string;
  title: string;
  location: string;
  description: string | null;
  image_path: string | null;
  start_date: string | null;
  progress: number | null;
  created_at: string;
  updated_at: string;
}

export default function OngoingProjectsPage() {
  const [projects, setProjects] = useState<OngoingProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<OngoingProject | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/admin/projects?status=ongoing');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data: ApiProject[] = await response.json();
        
        const mappedProjects: OngoingProject[] = data.map((project) => ({
          id: project.id,
          title: project.title,
          location: project.location,
          category: project.project_type.charAt(0).toUpperCase() + project.project_type.slice(1),
          startDate: project.start_date || project.created_at,
          expectedCompletion: '', // Not available in API, can be calculated or left empty
          progress: project.progress || 0,
          image: project.image_path ? `/uploads/${project.image_path}` : '/projects/ImageR1.jpg',
          description: project.description || 'No description available.'
        }));
        
        setProjects(mappedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
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
        {projects.length > 0 ? (
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
                  onError={(e) => {
                    e.currentTarget.src = '/projects/ImageR1.jpg';
                  }}
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
        ) : (
          !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects available</p>
            </div>
          )
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
                onError={(e) => {
                  e.currentTarget.src = '/projects/ImageR1.jpg';
                }}
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
                {selectedProject.expectedCompletion && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrendingUp size={18} className="text-gray-400" />
                    <span>Expected: {new Date(selectedProject.expectedCompletion).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                )}
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

