'use client';

import { useState, useEffect } from 'react';

interface InteriorImage {
  id: number;
  image_description: string;
  image_path: string;
  created_at: string;
}

export default function ProjectsPage() {
  const [images, setImages] = useState<InteriorImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<InteriorImage | null>(null);

  useEffect(() => {
    const fetchInteriorImages = async () => {
      try {
        const response = await fetch('/api/admin/interior-designs');
        const data = await response.json();
        // Ensure we're working with an array
        setImages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchInteriorImages();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with more padding */}
      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Our Interior Projects
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
            Explore our collection of interior design projects that showcase our expertise
          </p>
        </div>
      </div>
      
      {/* Projects Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(images) && images.length > 0 ? (
            images.map((image) => (
              <div 
                key={image.id} 
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={`/uploads/${image.image_path}`}
                    alt={image.image_description}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h3 className="text-white text-lg font-semibold">
                      {image.image_description}
                    </h3>
                    <p className="text-gray-200 text-sm mt-1">
                      View Project
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No projects available yet. Please check back later.</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-lg overflow-hidden">
              <img
                src={`/uploads/${selectedImage.image_path}`}
                alt={selectedImage.image_description}
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="p-4 bg-white">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedImage.image_description}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
