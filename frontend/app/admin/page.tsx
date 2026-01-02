'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiHome, FiUsers, FiSettings, FiFileText, FiLogOut, FiPlus, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

interface Project {
  id: number;
  status: 'ongoing' | 'completed';
  project_type: 'residential' | 'commercial' | 'renovation' | 'hospitality';
  title: string;
  location: string;
  description?: string | null;
  image_path?: string | null;
  start_date?: string | null;
  completed_date?: string | null;
  progress?: number | null;
  plot_area?: number | null;
  plinth_area?: number | null;
  build_up_area?: number | null;
  drawing_photos?: string[] | null;
  project_photos?: string[] | null;
  project_videos?: string[] | null;
  created_at: string;
  updated_at: string;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'quotations' | 'contacts' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'residential' | 'commercial' | 'renovation' | 'hospitality'>('all');
  
  const [formData, setFormData] = useState({
    status: 'ongoing' as 'ongoing' | 'completed',
    project_type: 'residential' as 'residential' | 'commercial' | 'renovation' | 'hospitality',
    title: '',
    location: '',
    description: '',
    start_date: '',
    completed_date: '',
    progress: '0',
    plot_area: '',
    plinth_area: '',
    build_up_area: '',
    image: null as File | null,
    delete_image: false
  });

  const [drawingPhotos, setDrawingPhotos] = useState<File[]>([]);
  const [projectPhotos, setProjectPhotos] = useState<File[]>([]);
  const [projectVideos, setProjectVideos] = useState<File[]>([]);

  useEffect(() => {
    fetchProjects();
  }, [filterStatus, filterType]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      let url = '/api/admin/projects';
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterType !== 'all') params.append('type', filterType);
      if (params.toString()) url += '?' + params.toString();
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      alert('Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'image' && e.target instanceof HTMLInputElement && e.target.files) {
      setFormData(prev => ({ ...prev, image: e.target.files?.[0] || null }));
    } else if (name === 'drawing_photos' && e.target instanceof HTMLInputElement && e.target.files) {
      const files = Array.from(e.target.files).slice(0, 4);
      setDrawingPhotos(files);
    } else if (name === 'project_photos' && e.target instanceof HTMLInputElement && e.target.files) {
      const files = Array.from(e.target.files).slice(0, 4);
      setProjectPhotos(files);
    } else if (name === 'project_videos' && e.target instanceof HTMLInputElement && e.target.files) {
      const files = Array.from(e.target.files).slice(0, 2);
      setProjectVideos(files);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData.image) {
        submitData.append('image', formData.image);
      } else if (key !== 'image') {
        submitData.append(key, (formData as any)[key]);
      }
    });

    // Append multiple files
    drawingPhotos.forEach(file => {
      submitData.append('drawing_photos', file);
    });
    projectPhotos.forEach(file => {
      submitData.append('project_photos', file);
    });
    projectVideos.forEach(file => {
      submitData.append('project_videos', file);
    });

    try {
      const url = editingProject 
        ? `/api/admin/projects/${editingProject.id}`
        : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save project');
      }

      alert(`Project ${editingProject ? 'updated' : 'created'} successfully!`);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to save project'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      status: 'ongoing',
      project_type: 'residential',
      title: '',
      location: '',
      description: '',
      start_date: '',
      completed_date: '',
      progress: '0',
      plot_area: '',
      plinth_area: '',
      build_up_area: '',
      image: null,
      delete_image: false
    });
    setDrawingPhotos([]);
    setProjectPhotos([]);
    setProjectVideos([]);
    setEditingProject(null);
    setShowProjectForm(false);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      status: project.status,
      project_type: project.project_type,
      title: project.title,
      location: project.location,
      description: project.description || '',
      start_date: project.start_date || '',
      completed_date: project.completed_date || '',
      progress: project.progress?.toString() || '0',
      plot_area: project.plot_area?.toString() || '',
      plinth_area: project.plinth_area?.toString() || '',
      build_up_area: project.build_up_area?.toString() || '',
      image: null,
      delete_image: false
    });
    setDrawingPhotos([]);
    setProjectPhotos([]);
    setProjectVideos([]);
    setShowProjectForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete project');
      }

      alert('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to delete project'}`);
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

  const ongoingCount = projects.filter(p => p.status === 'ongoing').length;
  const completedCount = projects.filter(p => p.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Project Management</h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowProjectForm(true);
                }}
                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center gap-2"
              >
                <FiPlus />
                Add New Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-6 text-white">
                <h3 className="text-lg font-medium">Total Projects</h3>
                <p className="text-3xl font-bold mt-2">{projects.length}</p>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
                <h3 className="text-lg font-medium">Ongoing Projects</h3>
                <p className="text-3xl font-bold mt-2">{ongoingCount}</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white">
                <h3 className="text-lg font-medium">Completed Projects</h3>
                <p className="text-3xl font-bold mt-2">{completedCount}</p>
              </div>
            </div>

            {showProjectForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-2 border-cyan-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {editingProject ? 'Edit Project' : 'Add New Project'}
                  </h3>
                  <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                    <FiX size={24} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        required
                      >
                        <option value="ongoing">Ongoing</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Type *</label>
                      <select
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        required
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="renovation">Renovation</option>
                        <option value="hospitality">Hospitality</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.status === 'ongoing' ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                          <input
                            type="number"
                            name="progress"
                            value={formData.progress}
                            onChange={handleInputChange}
                            min="0"
                            max="100"
                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                          />
                        </div>
                      </>
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Completed Date</label>
                        <input
                          type="date"
                          name="completed_date"
                          value={formData.completed_date}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plot Area (sq ft)</label>
                      <input
                        type="number"
                        name="plot_area"
                        value={formData.plot_area}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        placeholder="e.g., 1500.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plinth Area (sq ft)</label>
                      <input
                        type="number"
                        name="plinth_area"
                        value={formData.plinth_area}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        placeholder="e.g., 1200.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Build Up Area (sq ft)</label>
                      <input
                        type="number"
                        name="build_up_area"
                        value={formData.build_up_area}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                        placeholder="e.g., 1000.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                    {editingProject?.image_path && !formData.delete_image && (
                      <div className="mb-2">
                        <img src={`/uploads/${editingProject.image_path}`} alt={editingProject.title} className="h-32 w-auto rounded" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, delete_image: true }))}
                          className="mt-2 text-red-600 text-sm"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Drawing Photos (Max 4)
                    </label>
                    <input
                      type="file"
                      name="drawing_photos"
                      accept="image/*"
                      multiple
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {drawingPhotos.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {drawingPhotos.length} file(s) selected
                      </p>
                    )}
                    {editingProject?.drawing_photos && editingProject.drawing_photos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">Existing: {editingProject.drawing_photos.length} photo(s)</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Photos (Max 4)
                    </label>
                    <input
                      type="file"
                      name="project_photos"
                      accept="image/*"
                      multiple
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {projectPhotos.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {projectPhotos.length} file(s) selected
                      </p>
                    )}
                    {editingProject?.project_photos && editingProject.project_photos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">Existing: {editingProject.project_photos.length} photo(s)</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Videos (Max 2)
                    </label>
                    <input
                      type="file"
                      name="project_videos"
                      accept="video/*"
                      multiple
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    {projectVideos.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {projectVideos.length} file(s) selected
                      </p>
                    )}
                    {editingProject?.project_videos && editingProject.project_videos.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 mb-1">Existing: {editingProject.project_videos.length} video(s)</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-cyan-600 text-white px-6 py-2 rounded-md hover:bg-cyan-700"
                    >
                      {editingProject ? 'Update Project' : 'Create Project'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="mb-4 flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                >
                  <option value="all">All</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                >
                  <option value="all">All</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="renovation">Renovation</option>
                  <option value="hospitality">Hospitality</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
              </div>
            ) : projects.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {filterStatus === 'ongoing' ? 'Start Date / Progress' : 'Completed Date'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td className="px-4 py-3">
                          {project.image_path ? (
                            <img src={`/uploads/${project.image_path}`} alt={project.title} className="h-16 w-24 object-cover rounded" />
                          ) : (
                            <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            project.status === 'ongoing' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 capitalize">{project.project_type}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{project.location}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {project.status === 'ongoing' ? (
                            <div>
                              <div>{project.start_date ? new Date(project.start_date).toLocaleDateString() : '-'}</div>
                              {project.progress !== null && (
                                <div className="mt-1">
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                                  </div>
                                  <span className="text-xs text-gray-500">{project.progress}%</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            project.completed_date ? new Date(project.completed_date).toLocaleDateString() : '-'
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="text-cyan-600 hover:text-cyan-800"
                              title="Edit"
                            >
                              <FiEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed rounded-lg">
                <p className="text-gray-500">No projects found. Add your first project!</p>
              </div>
            )}
          </div>
          )}
        </main>
      </div>
    </div>
  );
}
