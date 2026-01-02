'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Building2, X, Image as ImageIcon, Video } from 'lucide-react';

interface CompletedProject {
  id: number;
  title: string;
  location: string;
  category: string;
  completionDate: string;
  image: string;
  description: string;
  plotArea?: number | null;
  plinthArea?: number | null;
  buildUpArea?: number | null;
  drawingPhotos?: string[];
  projectPhotos?: string[];
  projectVideos?: string[];
}

interface ApiProject {
  id: number;
  status: string;
  project_type: string;
  title: string;
  location: string;
  description: string | null;
  image_path: string | null;
  completed_date: string | null;
  plot_area?: number | null;
  plinth_area?: number | null;
  build_up_area?: number | null;
  drawing_photos?: string[] | null;
  project_photos?: string[] | null;
  project_videos?: string[] | null;
  created_at: string;
  updated_at: string;
}

export default function CompletedProjectsPage() {
  const [projects, setProjects] = useState<CompletedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/admin/projects?status=completed');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data: ApiProject[] = await response.json();
        
        const mappedProjects: CompletedProject[] = data.map((project) => ({
          id: project.id,
          title: project.title,
          location: project.location,
          category: project.project_type.charAt(0).toUpperCase() + project.project_type.slice(1),
          completionDate: project.completed_date || project.created_at,
          image: project.image_path ? `/uploads/${project.image_path}` : '/projects/ImageR1.jpg',
          description: project.description || 'No description available.',
          plotArea: project.plot_area,
          plinthArea: project.plinth_area,
          buildUpArea: project.build_up_area,
          drawingPhotos: Array.isArray(project.drawing_photos) ? project.drawing_photos.map((p: string) => `/uploads/${p}`) : [],
          projectPhotos: Array.isArray(project.project_photos) ? project.project_photos.map((p: string) => `/uploads/${p}`) : [],
          projectVideos: Array.isArray(project.project_videos) ? project.project_videos.map((v: string) => `/uploads/${v}`) : []
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
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>Completed: {new Date(project.completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {(project.plotArea || project.plinthArea || project.buildUpArea) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Area Details</h4>
                      <div className="space-y-2.5">
                        {project.plotArea && (
                          <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700">Plot Area</span>
                            <span className="text-sm font-semibold text-cyan-600">{project.plotArea.toLocaleString()} sq ft</span>
                          </div>
                        )}
                        {project.plinthArea && (
                          <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700">Plinth Area</span>
                            <span className="text-sm font-semibold text-cyan-600">{project.plinthArea.toLocaleString()} sq ft</span>
                          </div>
                        )}
                        {project.buildUpArea && (
                          <div className="flex items-center justify-between py-1.5 px-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium text-gray-700">Build Up Area</span>
                            <span className="text-sm font-semibold text-cyan-600">{project.buildUpArea.toLocaleString()} sq ft</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
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

              {(selectedProject.plotArea || selectedProject.plinthArea || selectedProject.buildUpArea) && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Area Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedProject.plotArea && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Plot Area</span>
                        <p className="text-xl font-semibold text-cyan-600">{selectedProject.plotArea} sq ft</p>
                      </div>
                    )}
                    {selectedProject.plinthArea && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Plinth Area</span>
                        <p className="text-xl font-semibold text-cyan-600">{selectedProject.plinthArea} sq ft</p>
                      </div>
                    )}
                    {selectedProject.buildUpArea && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Build Up Area</span>
                        <p className="text-xl font-semibold text-cyan-600">{selectedProject.buildUpArea} sq ft</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Project Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {(selectedProject.drawingPhotos?.length || selectedProject.projectPhotos?.length || selectedProject.projectVideos?.length) && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <button
                    onClick={() => setShowGallery(true)}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <ImageIcon size={20} />
                    See More
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGallery && selectedProject && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" 
          onClick={() => setShowGallery(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gray-900 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-gray-800 rounded-full p-2 shadow-lg"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-white mb-8">{selectedProject.title} - Gallery</h2>
              
              {/* Drawing Photos */}
              {selectedProject.drawingPhotos && selectedProject.drawingPhotos.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <ImageIcon size={20} />
                    Drawing Photos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.drawingPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Drawing ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/projects/ImageR1.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Photos */}
              {selectedProject.projectPhotos && selectedProject.projectPhotos.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <ImageIcon size={20} />
                    Project Photos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.projectPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Project Photo ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = '/projects/ImageR1.jpg';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Project Videos */}
              {selectedProject.projectVideos && selectedProject.projectVideos.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Video size={20} />
                    Project Videos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.projectVideos.map((video, index) => (
                      <div key={index} className="relative">
                        <video
                          src={video}
                          controls
                          className="w-full h-64 object-cover rounded-lg bg-black"
                        >
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

