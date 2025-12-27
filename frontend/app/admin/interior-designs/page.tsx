'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiTrash2, FiEdit } from 'react-icons/fi';

interface InteriorImage {
  id: number;
  image_description: string;
  image_path: string;
  created_at: string;
}

export default function InteriorDesignsPage() {
  const [images, setImages] = useState<InteriorImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchInteriorImages();
  }, []);

  const fetchInteriorImages = async () => {
    try {
      const response = await fetch('/api/admin/interior-designs');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !description) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('description', description);

    setIsUploading(true);
    try {
      const response = await fetch('/api/admin/interior-designs/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setDescription('');
        setSelectedFile(null);
        if (e.target instanceof HTMLFormElement) {
          e.target.reset();
        }
        fetchInteriorImages();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        const response = await fetch(`/api/admin/interior-designs/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchInteriorImages();
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Interior Design Management</h1>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter image description"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isUploading}
            className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 disabled:opacity-50 flex items-center"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
            <FiUpload className="ml-2" />
          </button>
        </form>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img
                src={`/uploads/${image.image_path}`}
                alt={image.image_description}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-2">{image.image_description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleDelete(image.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
