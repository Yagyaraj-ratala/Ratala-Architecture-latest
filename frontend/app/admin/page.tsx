'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiHome, FiUsers, FiSettings, FiFileText, FiLogOut, FiPlus, FiEdit, FiTrash2, FiX, FiEye, FiEyeOff, FiMenu } from 'react-icons/fi';
import { getAuthToken, clearAuthData } from '@/lib/auth-storage';

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

interface User {
    id: number;
    username: string;
    email: string;
    password?: string; // In a real app this wouldn't be here like this, but per request
    role?: string;
    created_at: string;
}

interface Ticket {
    id: number;
    username: string;
    service_name: string;
    problem_description: string;
    status: 'open' | 'solved' | 'closed';
    created_at: string;
    updated_at: string;
}

interface Blog {
    id: number;
    title: string;
    slug: string;
    summary: string | null;
    content: string;
    author: string | null;
    image_path: string | null;
    category: string | null;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
}

interface SiteSettings {
    id?: number;
    site_name: string;
    contact_email: string;
    contact_phone: string;
    office_address: string;
    facebook_url: string;
    instagram_url: string;
    linkedin_url: string;
    meta_description: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState<'dashboard' | 'users' | 'settings' | 'tickets' | 'contactreport' | 'quotationreport' | 'blogs'>('dashboard');

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketsLoading, setTicketsLoading] = useState(false);
    const [ticketsError, setTicketsError] = useState<string | null>(null);

    const [users, setUsers] = useState<User[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const [projects, setProjects] = useState<Project[]>([]);
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportError, setReportError] = useState<string | null>(null);
    const [reportType, setReportType] = useState<'quotations' | 'contacts' | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [blogsLoading, setBlogsLoading] = useState(false);
    const [blogsError, setBlogsError] = useState<string | null>(null);
    const [showBlogForm, setShowBlogForm] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [blogFormData, setBlogFormData] = useState({
        title: '',
        slug: '',
        summary: '',
        content: '',
        author: '',
        category: '',
        status: 'published' as 'draft' | 'published',
        image: null as File | null,
        delete_image: false
    });
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

    const [siteSettings, setSiteSettings] = useState<SiteSettings>({
        site_name: 'Ratala Architecture',
        contact_email: 'info@ratalaarchitecture.com',
        contact_phone: '+977 9851325508',
        office_address: '1st Floor, PepsiCola-32, Kathmandu, Nepal',
        facebook_url: '',
        instagram_url: '',
        linkedin_url: '',
        meta_description: ''
    });
    const [settingsLoading, setSettingsLoading] = useState(false);
    const [settingsSaving, setSettingsSaving] = useState(false);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [drawingPhotos, setDrawingPhotos] = useState<File[]>([]);
    const [projectPhotos, setProjectPhotos] = useState<File[]>([]);
    const [projectVideos, setProjectVideos] = useState<File[]>([]);

    useEffect(() => {
        // Restore active section from localStorage on refresh
        const savedSection = localStorage.getItem('adminActiveSection');
        if (savedSection && ['dashboard', 'users', 'settings', 'tickets', 'contactreport', 'quotationreport', 'blogs'].includes(savedSection)) {
            setActiveSection(savedSection as any);
        }
        fetchProjects();
    }, [filterStatus, filterType]);

    useEffect(() => {
        // Save active section to localStorage
        localStorage.setItem('adminActiveSection', activeSection);
    }, [activeSection]);

    useEffect(() => {
        if (activeSection === 'quotationreport') {
            fetchQuotations();
        }
        if (activeSection === 'blogs') {
            fetchBlogs();
        }
        if (activeSection === 'users') {
            fetchUsers();
        }
        if (activeSection === 'tickets') {
            fetchTickets();
        }
        if (activeSection === 'contactreport') {
            fetchContacts();
        }
        if (activeSection === 'settings') {
            fetchSettings();
        }
    }, [activeSection]);

    const fetchTickets = async () => {
        setTicketsLoading(true);
        setTicketsError(null);
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch('/api/admin/tickets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setTickets(data);
            } else {
                setTicketsError('Failed to load tickets');
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setTicketsError('Error loading tickets');
        } finally {
            setTicketsLoading(false);
        }
    };

    const handleTicketStatusUpdate = async (id: number, status: string) => {
        try {
            const token = getAuthToken();
            const response = await fetch(`/api/admin/tickets/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                fetchTickets();
            } else {
                alert('Failed to update ticket status');
            }
        } catch (error) {
            console.error('Error updating ticket status:', error);
            alert('Error updating ticket status');
        }
    };

    const handleTicketDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this ticket?')) return;

        try {
            const token = getAuthToken();
            const response = await fetch(`/api/admin/tickets/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchTickets();
            } else {
                alert('Failed to delete ticket');
            }
        } catch (error) {
            console.error('Error deleting ticket:', error);
            alert('Error deleting ticket');
        }
    };

    const fetchContacts = async () => {
        setReportLoading(true);
        setReportError(null);
        try {
            const token = getAuthToken();
            if (!token) return;

            const res = await fetch('/api/admin/contact-us', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setContacts(Array.isArray(data) ? data : []);
            } else {
                setReportError('Failed to load contact reports');
            }
        } catch (err) {
            console.error('Failed to fetch contacts', err);
            setReportError('Error loading contact reports');
        } finally {
            setReportLoading(false);
        }
    };

    const fetchQuotations = async () => {
        setReportLoading(true);
        setReportError(null);
        try {
            const token = getAuthToken();
            if (!token) return;

            const res = await fetch('/api/admin/quotations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setQuotations(Array.isArray(data) ? data : []);
            } else {
                setReportError('Failed to load quotations');
            }
        } catch (err) {
            console.error('Failed to fetch quotations', err);
            setReportError('Error loading quotations');
        } finally {
            setReportLoading(false);
        }
    };

    const fetchSettings = async () => {
        setSettingsLoading(true);
        try {
            const token = getAuthToken();
            if (!token) return;

            const res = await fetch('/api/admin/settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.id) {
                    setSiteSettings(data);
                }
            }
        } catch (err) {
            console.error('Failed to fetch settings', err);
        } finally {
            setSettingsLoading(false);
        }
    };

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSettingsSaving(true);
        try {
            const token = getAuthToken();
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(siteSettings)
            });

            if (res.ok) {
                alert('Settings updated successfully!');
            } else {
                alert('Failed to update settings');
            }
        } catch (err) {
            console.error('Error updating settings', err);
            alert('Error updating settings');
        } finally {
            setSettingsSaving(false);
        }
    };

    const handleContactDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this contact record?')) return;

        try {
            const token = getAuthToken();
            const response = await fetch(`/api/admin/contact-us/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchContacts();
            } else {
                alert('Failed to delete contact record');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Error deleting contact');
        }
    };

    const handleQuotationDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this quotation record?')) return;

        try {
            const token = getAuthToken();
            const response = await fetch(`/api/admin/quotations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchQuotations();
            } else {
                alert('Failed to delete quotation record');
            }
        } catch (error) {
            console.error('Error deleting quotation:', error);
            alert('Error deleting quotation');
        }
    };

    const fetchBlogs = async () => {
        setBlogsLoading(true);
        setBlogsError(null);
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch('/api/admin/blogs', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setBlogs(Array.isArray(data) ? data : []);
            } else {
                setBlogsError('Failed to load blogs');
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setBlogsError('Error loading blogs');
        } finally {
            setBlogsLoading(false);
        }
    };

    const resetBlogForm = () => {
        setBlogFormData({
            title: '',
            slug: '',
            summary: '',
            content: '',
            author: '',
            category: '',
            status: 'published',
            image: null,
            delete_image: false
        });
        setEditingBlog(null);
        setShowBlogForm(false);
    };

    const handleBlogEdit = (blog: Blog) => {
        setEditingBlog(blog);
        setBlogFormData({
            title: blog.title,
            slug: blog.slug,
            summary: blog.summary || '',
            content: blog.content,
            author: blog.author || '',
            category: blog.category || '',
            status: blog.status,
            image: null,
            delete_image: false
        });
        setShowBlogForm(true);
    };

    const handleBlogDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const token = getAuthToken();
            const response = await fetch(`/api/admin/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchBlogs();
            } else {
                alert('Failed to delete blog post');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog');
        }
    };

    const handleBlogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = getAuthToken();
            const formData = new FormData();
            formData.append('title', blogFormData.title);
            formData.append('slug', blogFormData.slug);
            formData.append('summary', blogFormData.summary);
            formData.append('content', blogFormData.content);
            formData.append('author', blogFormData.author);
            formData.append('category', blogFormData.category);
            formData.append('status', blogFormData.status);
            if (blogFormData.image) {
                formData.append('image', blogFormData.image);
            }
            if (blogFormData.delete_image) {
                formData.append('delete_image', 'true');
            }

            const url = editingBlog ? `/api/admin/blogs/${editingBlog.id}` : '/api/admin/blogs';
            const method = editingBlog ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                resetBlogForm();
                fetchBlogs();
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to save blog');
            }
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog');
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        setUsersError(null);
        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                setUsersError('Failed to load users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsersError('Error loading users');
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found');
            }

            let url = '/api/admin/projects';
            const params = new URLSearchParams();
            if (filterStatus !== 'all') params.append('status', filterStatus);
            if (filterType !== 'all') params.append('type', filterType);
            if (params.toString()) url += '?' + params.toString();

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                clearAuthData();
                router.push('/login');
                return;
            }

            if (!response.ok) throw new Error('Failed to fetch projects');
            const data = await response.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching projects:', error);
            if (error instanceof Error && error.message === 'No authentication token found') {
                clearAuthData();
                router.push('/login');
            } else {
                alert('Failed to load projects');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const target = e.target as HTMLInputElement;

        if (name === 'image' && target.files) {
            setFormData(prev => ({ ...prev, image: target.files?.[0] || null }));
        } else if (name === 'drawing_photos' && target.files) {
            const files = Array.from(target.files).slice(0, 4);
            setDrawingPhotos(files);
        } else if (name === 'project_photos' && target.files) {
            const files = Array.from(target.files).slice(0, 4);
            setProjectPhotos(files);
        } else if (name === 'project_videos' && target.files) {
            const files = Array.from(target.files).slice(0, 2);
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

            const token = getAuthToken();
            if (!token) {
                clearAuthData();
                router.push('/login');
                return;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
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
            const token = getAuthToken();
            if (!token) {
                clearAuthData();
                router.push('/login');
                return;
            }

            const response = await fetch(`/api/admin/projects/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
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

    // User Management Handlers
    const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userFormData.username || !userFormData.email) {
            alert('Username and Email are required');
            return;
        }

        try {
            const token = getAuthToken();
            if (!token) return;

            const url = editingUser ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
            const method = editingUser ? 'PUT' : 'POST';

            const body: any = {
                username: userFormData.username,
                email: userFormData.email,
            };
            if (userFormData.password) {
                body.password = userFormData.password;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save user');
            }

            alert(editingUser ? 'User updated successfully' : 'User added successfully');
            resetUserForm();
            fetchUsers();
        } catch (error) {
            console.error('Error saving user:', error);
            alert(error instanceof Error ? error.message : 'Failed to save user');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const token = getAuthToken();
            if (!token) return;

            const response = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to delete user');
            }

            alert('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete user');
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setUserFormData({ username: user.username, email: user.email, password: '' });
        setShowUserForm(true);
    };

    const resetUserForm = () => {
        setEditingUser(null);
        setUserFormData({ username: '', email: '', password: '' });
        setShowUserForm(false);
        setShowPassword(false);
    };

    const handleLogout = () => {
        clearAuthData();
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
            a.download = `customer_responses_${new Date().toISOString().slice(0, 10)}.csv`;
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
        a.download = `quotations_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const ongoingCount = projects.filter(p => p.status === 'ongoing').length;
    const completedCount = projects.filter(p => p.status === 'completed').length;

    return (
        <div className="flex flex-1 relative overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 bg-white shadow-xl h-[calc(100vh-64px)] 
                fixed lg:sticky top-16 left-0 
                flex flex-col z-40 lg:z-20 border-r border-gray-100
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Dashboard</h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <ul className="p-4 space-y-2">
                        <li>
                            <button onClick={() => { setActiveSection('dashboard'); setIsSidebarOpen(false); }} className={`w-full text-left flex items-center p-2 font-medium rounded-lg ${activeSection === 'dashboard' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FiHome className="mr-3" />
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { setActiveSection('users'); setIsSidebarOpen(false); }} className={`w-full text-left flex items-center p-2 font-medium rounded-lg ${activeSection === 'users' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FiUsers className="mr-3" />
                                Users
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { setActiveSection('tickets'); setIsSidebarOpen(false); }} className={`w-full text-left flex items-center p-2 font-medium rounded-lg ${activeSection === 'tickets' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FiFileText className="mr-3" />
                                Problem Tickets
                            </button>
                        </li>
                        <li>
                            <button onClick={() => { setActiveSection('blogs'); setIsSidebarOpen(false); }} className={`w-full text-left flex items-center p-2 font-medium rounded-lg ${activeSection === 'blogs' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FiFileText className="mr-3" />
                                Blogs & Articles
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => { setActiveSection('contactreport'); setIsSidebarOpen(false); }}
                                className={`w-full text-left flex items-center p-2 font-medium rounded-lg ${activeSection === 'contactreport' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <FiFileText className="mr-3" />
                                Contact Report
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => { setActiveSection('quotationreport'); setIsSidebarOpen(false); }}
                                className={`w-full text-left flex items-center p-2 font-medium rounded-lg ${activeSection === 'quotationreport' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <FiFileText className="mr-3" />
                                Quotation Report
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => { setActiveSection('settings'); setIsSidebarOpen(false); }}
                                className={`w-full text-left flex items-center p-2 font-medium rounded-lg ${activeSection === 'settings' ? 'text-cyan-600 bg-cyan-50' : 'text-gray-600 hover:bg-gray-100'}`}
                            >
                                <FiSettings className="mr-3" />
                                Settings
                            </button>
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

            <main className="flex-1 p-4 md:p-8 relative z-0">
                {/* Mobile Menu Toggle */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-600"
                    >
                        <FiMenu size={24} />
                    </button>
                </div>
                {activeSection === 'settings' ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Site Settings</h2>
                            <button
                                onClick={fetchSettings}
                                className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                            >
                                Refresh
                            </button>
                        </div>

                        {settingsLoading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                            </div>
                        ) : (
                            <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-4xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-900 border-b pb-2">General Information</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={siteSettings.site_name}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                                            <input
                                                type="email"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={siteSettings.contact_email}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={siteSettings.contact_phone}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
                                            <textarea
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none h-20 text-gray-900 bg-white"
                                                value={siteSettings.office_address}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, office_address: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-900 border-b pb-2">Social Media & SEO</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                                            <input
                                                type="url"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={siteSettings.facebook_url}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, facebook_url: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                                            <input
                                                type="url"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={siteSettings.instagram_url}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, instagram_url: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                            <input
                                                type="url"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={siteSettings.linkedin_url}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, linkedin_url: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                            <textarea
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none h-20 text-gray-900 bg-white"
                                                value={siteSettings.meta_description}
                                                onChange={(e) => setSiteSettings({ ...siteSettings, meta_description: e.target.value })}
                                                placeholder="Briefly describe your site for search engines"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={settingsSaving}
                                        className="bg-cyan-600 text-white px-8 py-2 rounded-lg hover:bg-cyan-700 transition disabled:opacity-50"
                                    >
                                        {settingsSaving ? 'Saving Changes...' : 'Save Settings'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : activeSection === 'contactreport' ? (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Contact Report</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={fetchContacts}
                                    className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                                >
                                    Refresh List
                                </button>
                                <button
                                    onClick={() => {
                                        setReportType('contacts');
                                        setTimeout(exportToCSV, 100);
                                    }}
                                    className="bg-cyan-600 text-white px-3 py-1 rounded text-sm hover:bg-cyan-700"
                                >
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {reportError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                                {reportError}
                            </div>
                        )}

                        {reportLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] sm:text-xs">
                                            <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                                            <th className="hidden lg:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                            <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="sticky right-0 bg-gray-50 z-10 px-2 sm:px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider border-l border-gray-100">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {contacts.map((c) => (
                                            <tr key={c.id} className="text-xs sm:text-sm">
                                                <td className="px-2 sm:px-4 py-4 whitespace-nowrap font-medium text-gray-900 truncate max-w-[80px] sm:max-w-none">{c.full_name}</td>
                                                <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-gray-500">{c.email}</td>
                                                <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-gray-500">{c.phone || '-'}</td>
                                                <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-gray-500">{c.subject || '-'}</td>
                                                <td className="px-2 sm:px-4 py-4 text-gray-500 max-w-[100px] sm:max-w-xs overflow-hidden">
                                                    <div className="truncate">{c.message}</div>
                                                </td>
                                                <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-gray-500">
                                                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="sticky right-0 bg-white z-10 px-2 sm:px-4 py-4 whitespace-nowrap text-right border-l border-gray-100 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                                                    <button
                                                        onClick={() => handleContactDelete(c.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {contacts.length === 0 && (
                                    <p className="text-center py-8 text-gray-500">No contact reports found.</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : activeSection === 'quotationreport' ? (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Quotation Report</h2>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={fetchQuotations}
                                    className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                                >
                                    Refresh List
                                </button>
                                <button
                                    onClick={() => {
                                        setReportType('quotations');
                                        setTimeout(exportToCSV, 100);
                                    }}
                                    className="bg-cyan-600 text-white px-3 py-1 rounded text-sm hover:bg-cyan-700"
                                >
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {reportError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                                {reportError}
                            </div>
                        )}

                        {reportLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] sm:text-xs">
                                            <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                            <th className="hidden lg:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                                            <th className="hidden xl:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="sticky right-0 bg-gray-50 z-10 px-2 sm:px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider border-l border-gray-100">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {quotations.map((q) => (
                                            <tr key={q.id} className="text-xs sm:text-sm">
                                                <td className="px-2 sm:px-4 py-4 whitespace-nowrap font-medium text-gray-900 truncate max-w-[80px] sm:max-w-none">{q.full_name}</td>
                                                <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-gray-500">{q.email}</td>
                                                <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-gray-500 capitalize">{q.project_type}</td>
                                                <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-gray-500">{q.estimated_budgets}</td>
                                                <td className="hidden xl:table-cell px-4 py-4 text-gray-500 max-w-xs">
                                                    <div className="truncate">{q.project_details || '-'}</div>
                                                </td>
                                                <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-gray-500">
                                                    {q.created_at ? new Date(q.created_at).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="sticky right-0 bg-white z-10 px-2 sm:px-4 py-4 whitespace-nowrap text-right border-l border-gray-100 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                                                    <button
                                                        onClick={() => handleQuotationDelete(q.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {quotations.length === 0 && (
                                    <p className="text-center py-8 text-gray-500">No quotation reports found.</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : activeSection === 'tickets' ? (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Problem Ticket Management</h2>
                            <button
                                onClick={fetchTickets}
                                className="text-cyan-600 hover:text-cyan-800 text-sm font-medium"
                            >
                                Refresh List
                            </button>
                        </div>

                        {ticketsError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                                {ticketsError}
                            </div>
                        )}

                        {ticketsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50 text-[10px] sm:text-xs">
                                            <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-2 sm:px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                            <th className="hidden lg:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="sticky right-0 bg-gray-50 z-10 px-2 sm:px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider border-l border-gray-100">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tickets.map((t) => (
                                            <tr key={t.id} className="text-xs sm:text-sm">
                                                <td className="px-2 sm:px-4 py-4 whitespace-nowrap font-medium text-gray-900 truncate max-w-[80px] sm:max-w-none">{t.username}</td>
                                                <td className="px-2 sm:px-4 py-4 whitespace-nowrap text-gray-500 truncate max-w-[100px] sm:max-w-none">{t.service_name}</td>
                                                <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${t.status === 'open' ? 'bg-red-100 text-red-600' : t.status === 'solved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
                                                <td className="sticky right-0 bg-white z-10 px-2 sm:px-4 py-4 whitespace-nowrap text-right border-l border-gray-100 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                                                    <button
                                                        onClick={() => handleTicketDelete(t.id)}
                                                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {tickets.length === 0 && (
                                    <p className="text-center py-8 text-gray-500">No problem tickets found.</p>
                                )}
                            </div>
                        )}
                    </div>
                ) : activeSection === 'blogs' ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Blog Management</h2>
                            <button
                                onClick={() => { resetBlogForm(); setShowBlogForm(true); }}
                                className="bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-cyan-700 transition"
                            >
                                <FiPlus className="mr-2" />
                                Add New Post
                            </button>
                        </div>

                        {showBlogForm && (
                            <div className="mb-8 border border-gray-200 rounded-lg p-6 bg-gray-50">
                                <form onSubmit={handleBlogSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={blogFormData.title}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (auto-generated if empty)</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={blogFormData.slug}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, slug: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none h-20 text-gray-900 bg-white"
                                            value={blogFormData.summary}
                                            onChange={(e) => setBlogFormData({ ...blogFormData, summary: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content (Markdown supported) *</label>
                                        <textarea
                                            required
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none h-48 text-gray-900 bg-white font-mono text-sm"
                                            value={blogFormData.content}
                                            onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={blogFormData.author}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={blogFormData.category}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 outline-none text-gray-900 bg-white"
                                                value={blogFormData.status}
                                                onChange={(e) => setBlogFormData({ ...blogFormData, status: e.target.value as 'draft' | 'published' })}
                                            >
                                                <option value="published">Published</option>
                                                <option value="draft">Draft</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                                                onChange={(e) => setBlogFormData({ ...blogFormData, image: e.target.files?.[0] || null })}
                                            />
                                            {editingBlog?.image_path && (
                                                <div className="flex items-center gap-2">
                                                    <img src={`/uploads/${editingBlog.image_path}`} className="h-10 w-10 object-cover rounded" />
                                                    <label className="flex items-center text-xs text-red-600 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            className="mr-1"
                                                            checked={blogFormData.delete_image}
                                                            onChange={(e) => setBlogFormData({ ...blogFormData, delete_image: e.target.checked })}
                                                        />
                                                        Delete Current
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-end pt-4">
                                        <button
                                            type="button"
                                            onClick={resetBlogForm}
                                            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
                                        >
                                            {editingBlog ? 'Update Blog' : 'Create Blog'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {blogsLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                            </div>
                        ) : blogsError ? (
                            <div className="text-red-500 text-center py-8">{blogsError}</div>
                        ) : blogs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr className="text-[10px] sm:text-xs text-gray-500 border-b">
                                            <th className="px-2 sm:px-4 py-3 text-left font-medium uppercase">Img</th>
                                            <th className="px-2 sm:px-4 py-3 text-left font-medium uppercase">Title</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left font-medium uppercase">Status</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left font-medium uppercase">Date</th>
                                            <th className="sticky right-0 bg-gray-50 z-10 px-2 sm:px-4 py-3 text-right font-medium uppercase border-l border-gray-100">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {blogs.map((blog) => (
                                            <tr key={blog.id} className="text-xs sm:text-sm">
                                                <td className="px-2 sm:px-4 py-3">
                                                    {blog.image_path ? (
                                                        <img src={`/uploads/${blog.image_path}`} className="h-10 w-16 object-cover rounded shadow-sm" />
                                                    ) : (
                                                        <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center text-[8px] text-gray-400 font-bold uppercase">No Img</div>
                                                    )}
                                                </td>
                                                <td className="px-2 sm:px-4 py-3 font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">{blog.title}</td>
                                                <td className="hidden sm:table-cell px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {blog.status}
                                                    </span>
                                                </td>
                                                <td className="hidden md:table-cell px-4 py-3 text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</td>
                                                <td className="sticky right-0 bg-white z-10 px-2 sm:px-4 py-3 text-right border-l border-gray-100 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                                                    <div className="flex gap-1 sm:gap-2 justify-end">
                                                        <button
                                                            onClick={() => handleBlogEdit(blog)}
                                                            className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FiEdit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleBlogDelete(blog.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                                <p className="text-gray-500">No blogs found. Start writing!</p>
                            </div>
                        )}
                    </div>
                ) : activeSection === 'users' ? (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
                            <button
                                onClick={() => {
                                    resetUserForm();
                                    setShowUserForm(true);
                                }}
                                className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700 flex items-center gap-2"
                            >
                                <FiPlus />
                                Add New User
                            </button>
                        </div>

                        {showUserForm && (
                            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-2 border-cyan-500">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {editingUser ? 'Edit User' : 'Add New User'}
                                    </h3>
                                    <button onClick={resetUserForm} className="text-gray-500 hover:text-gray-700">
                                        <FiX size={24} />
                                    </button>
                                </div>
                                <form onSubmit={handleSaveUser} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={userFormData.username}
                                            onChange={handleUserInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userFormData.email}
                                            onChange={handleUserInputChange}
                                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingUser && '(Leave blank to keep current)'}</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={userFormData.password}
                                                onChange={handleUserInputChange}
                                                className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white pr-10"
                                                required={!editingUser}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                            >
                                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button type="button" onClick={resetUserForm} className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                                            Cancel
                                        </button>
                                        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">
                                            {editingUser ? 'Update User' : 'Create User'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                                        <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                        <th className="sticky right-0 bg-gray-50 z-10 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l border-gray-100">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((u) => (
                                        <tr key={u.id}>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.username}</td>
                                            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                            <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{u.role || 'user'}</td>
                                            <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td className="sticky right-0 bg-white z-10 px-4 py-4 whitespace-nowrap text-right border-l border-gray-100 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                                                <div className="flex gap-1.5 justify-end">
                                                    <button
                                                        onClick={() => handleEditUser(u)}
                                                        className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <FiEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(u.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && (
                                <p className="text-center py-4 text-gray-500">No users found.</p>
                            )}
                        </div>
                    </div >
                ) : (
                    <div className="bg-white rounded-lg shadow p-4 md:p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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

                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value as any)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
                                >
                                    <option value="all">All</option>
                                    <option value="ongoing">Ongoing</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="flex-1 min-w-[150px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as any)}
                                    className="w-full p-2 border border-gray-300 rounded-md text-gray-900 bg-white"
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
                                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                            <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                                            <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                {filterStatus === 'ongoing' ? 'Start Date' : 'Done'}
                                            </th>
                                            <th className="sticky right-0 bg-gray-50 z-10 px-2 py-3 text-right text-xs font-medium text-gray-500 uppercase border-l border-gray-100">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {projects.map((project) => (
                                            <tr key={project.id}>
                                                <td className="px-2 py-3">
                                                    {project.image_path ? (
                                                        <img src={`/uploads/${project.image_path}`} alt={project.title} className="h-10 w-16 object-cover rounded" />
                                                    ) : (
                                                        <div className="h-10 w-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400 font-medium">N/A</div>
                                                    )}
                                                </td>
                                                <td className="px-2 py-3 text-sm font-medium text-gray-900 max-w-[120px] truncate">{project.title}</td>
                                                <td className="hidden sm:table-cell px-4 py-3 text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${project.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="hidden md:table-cell px-4 py-3 text-sm text-gray-500 capitalize">{project.project_type}</td>
                                                <td className="hidden lg:table-cell px-4 py-3 text-sm text-gray-500">{project.location}</td>
                                                <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-500">
                                                    {project.status === 'ongoing' ? (
                                                        <span className="text-cyan-600 font-medium">{project.progress}%</span>
                                                    ) : (
                                                        project.completed_date ? new Date(project.completed_date).toLocaleDateString() : '-'
                                                    )}
                                                </td>
                                                <td className="sticky right-0 bg-white z-10 px-2 py-3 text-right border-l border-gray-100 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                                                    <div className="flex gap-1.5 justify-end">
                                                        <button
                                                            onClick={() => handleEdit(project)}
                                                            className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FiEdit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(project.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 size={16} />
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
            </main >
        </div >
    );
}
