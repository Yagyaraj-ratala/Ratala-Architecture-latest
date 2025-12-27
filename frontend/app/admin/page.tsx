'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiHome, FiUsers, FiSettings, FiFileText, FiLogOut, FiUpload, FiImage, FiTrash2 } from 'react-icons/fi';

interface InteriorImage {
  id: number;
  image_description: string;
  image_path: string;
  created_at: string;
}

interface Quotation {
  id: number;
  full_name?: string;
  email?: string;
  phone?: string;
  project_type?: string;
  estimated_budgets?: string;
  project_details?: string | null;
  created_at?: string;
}

interface Contact {
  id: number;
  full_name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  created_at?: string | null;
}

export default function AdminPage() {
  const router = useRouter();
  const [user] = useState({ name: 'Admin', email: 'admin@example.com' });
  const [images, setImages] = useState<InteriorImage[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'quotations' | 'contacts' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchInteriorImages();
  }, []);

  const fetchInteriorImages = async () => {
    try {
      const response = await fetch('/api/admin/interior-designs');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to load images. Please check console for details.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !description) {
      alert('Please select a file and enter a description');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('description', description);

    setIsUploading(true);
    try {
      const response = await fetch('/api/admin/interior-designs', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      setDescription('');
      setSelectedFile(null);
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
      fetchInteriorImages();
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/interior-designs/delete?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete image');
      }

      setImages(prevImages => prevImages.filter(img => img.id !== id));
      alert('Image deleted successfully!');
    } catch (error) {
      console.error('Error deleting image:', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete image'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const exportToCSV = () => {
    const formatDate = (val?: string) =>
      val ? new Date(val).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';

    if (reportType === 'contacts') {
      if (!contacts || contacts.length === 0) {
        alert('No customer responses to export');
        return;
      }

      const headers = ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Message', 'Submitted'];
      const rows = contacts.map((c) => [
        c.id ?? '',
        c.full_name ?? '',
        c.email ?? '',
        c.phone ?? '',
        c.subject ?? '',
        c.message ?? '',
        formatDate(c.created_at ?? undefined),
      ]);

      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer_responses_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return;
    }

    // default: quotations
    if (!quotations || quotations.length === 0) {
      alert('No quotation data to export');
      return;
    }

    const headers = ['ID', 'Name', 'Email', 'Phone', 'Project Type', 'Budget', 'Details', 'Submitted'];
    const rows = quotations.map((q) => [
      q.id ?? '',
      q.full_name ?? '',
      q.email ?? '',
      q.phone ?? '',
      q.project_type ?? '',
      q.estimated_budgets ?? '',
      q.project_details ?? '',
      formatDate(q.created_at ?? undefined),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quotations_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg h-screen sticky top-40 flex flex-col z-10">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-500">info@ratalaarchitecture.com</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ul className="p-4 space-y-2">
              <li>
                <a href="#" className="flex items-center p-2 text-cyan-600 font-medium rounded-lg bg-cyan-50">
                  <FiHome className="mr-3" />
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <FiUsers className="mr-3" />
                  Users
                </a>
              </li>
              <li>
                <button
                  onClick={async () => {
                    setReportVisible(true);
                    setReportType('contacts');
                    setReportLoading(true);
                    setReportError(null);
                    try {
                      const res = await fetch('/api/admin/contact-us');
                      if (!res.ok) throw new Error(`HTTP ${res.status}`);
                      const data = await res.json();
                      setContacts(Array.isArray(data) ? data : []);
                    } catch (err) {
                      console.error('Failed to fetch contacts', err);
                      setReportError('Failed to load customer responses');
                    } finally {
                      setReportLoading(false);
                    }
                  }}
                  className="w-full text-left flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <FiFileText className="mr-3" />
                  Contact Us Report
                </button>
              </li>

              <li>
                <button
                  onClick={async () => {
                    setReportVisible(true);
                    setReportType('quotations');
                    setReportLoading(true);
                    setReportError(null);
                    try {
                      const res = await fetch('/api/admin/quotations');
                      if (!res.ok) throw new Error(`HTTP ${res.status}`);
                      const data = await res.json();
                      setQuotations(Array.isArray(data) ? data : []);
                    } catch (err) {
                      console.error('Failed to fetch quotations', err);
                      setReportError('Failed to load quotations');
                    } finally {
                      setReportLoading(false);
                    }
                  }}
                  className="w-full text-left flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <FiFileText className="mr-3" />
                  Quotation Report
                </button>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                  <FiSettings className="mr-3" />
                  Settings
                </a>
              </li>
            </ul>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        <main className="flex-1 p-8 pt-40 relative z-0">
          {reportVisible ? (
            <div className="bg-white rounded-lg shadow p-6 mt-6 relative mx-auto max-w-6xl min-h-[72vh]">
              <div className="mb-4 relative pt-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {reportType === 'contacts' ? 'Customer Response Report' : 'Quotation Report'}
                </h2>
                <div className="absolute right-4 top-0 flex items-center gap-2 z-30">
                  <button onClick={() => { setReportVisible(false); setReportType(null); }} className="px-3 py-1 bg-gray-100 rounded">Back</button>
                  <button onClick={exportToCSV} className="px-3 py-1 bg-cyan-600 text-white rounded">Export CSV</button>
                </div>
              </div>
              {reportLoading ? (
                <p>Loading {reportType === 'contacts' ? 'customer responses' : 'quotations'}...</p>
              ) : reportError ? (
                <p className="text-red-500">{reportError}</p>
              ) : reportType === 'contacts' ? (
                contacts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="max-h-[60vh] overflow-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">ID</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Name</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Email</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Phone</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Subject</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Message</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {contacts.map((c) => (
                            <tr key={c.id}>
                              <td className="px-4 py-2 text-sm text-gray-700">{c.id}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{c.full_name}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{c.email}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{c.phone ?? '-'}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{c.subject ?? '-'}</td>
                              <td className="px-4 py-2 text-sm text-gray-700 truncate max-w-xs" title={c.message ?? ''}>{c.message ?? '-'}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{c.created_at ? new Date(c.created_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p>No customer responses found.</p>
                )
              ) : (
                quotations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="max-h-[60vh] overflow-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">ID</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Name</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Email</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Phone</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Project Type</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Budget</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Details</th>
                            <th className="sticky top-0 px-4 py-2 text-left text-xs font-medium text-gray-500 bg-gray-50 z-20">Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {quotations.map((q) => (
                            <tr key={q.id}>
                              <td className="px-4 py-2 text-sm text-gray-700">{q.id}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{q.full_name}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{q.email}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{q.phone}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{q.project_type}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{q.estimated_budgets}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{q.project_details}</td>
                              <td className="px-4 py-2 text-sm text-gray-700">{q.created_at ? new Date(q.created_at).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <p>No quotations found.</p>
                )
              )}
            </div>
          ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Welcome back, {user.name}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-medium">Total Projects</h3>
                <p className="text-3xl font-bold mt-2">24</p>
                <p className="text-sm opacity-80 mt-1">+12% from last month</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
                <h3 className="text-lg font-medium">Active Users</h3>
                <p className="text-3xl font-bold mt-2">1,243</p>
                <p className="text-sm opacity-80 mt-1">+8.1% from last month</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white">
                <h3 className="text-lg font-medium">Total Designs</h3>
                <p className="text-3xl font-bold mt-2">{images.length}</p>
                <p className="text-sm opacity-80 mt-1">Interior designs</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload New Interior Design</h3>
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
                  <div className="flex items-center space-x-4">
                    <label className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-500 transition-colors">
                      <FiUpload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        {selectedFile ? selectedFile.name : 'Click to select an image'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={isUploading || !selectedFile || !description}
                      className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                      <FiUpload className="ml-2" />
                    </button>
                  </div>
                </div>
              </form>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Uploads</h3>
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="border rounded-lg overflow-hidden">
                        <div className="h-40 bg-gray-100 relative">
                          <img
                            src={`/uploads/${image.image_path}`}
                            alt={image.image_description}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleDelete(image.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                            title="Delete image"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-gray-700 truncate">{image.image_description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(image.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400" />
                    <h4 className="mt-2 text-sm font-medium text-gray-900">No uploads yet</h4>
                    <p className="mt-1 text-sm text-gray-500">Upload your first interior design image</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
}