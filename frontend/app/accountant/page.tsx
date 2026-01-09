'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiDollarSign, FiFileText, FiLogOut, FiPlus, FiEdit, FiTrash2, FiX, FiMenu, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { getAuthToken, clearAuthData, getUserData } from '@/lib/auth-storage';

// Types
interface Expenditure {
    id: number;
    slno: string;
    itemDescription: string;
    qty: number;
    unit: string;
    rate: number;
    projectName: string;
    location: string;
    date: string;
    total: number;
}

interface Payment {
    id: number;
    labourName: string;
    siteName: string;
    payAmount: number;
    date: string;
    type: 'payment' | 'receipt';
    description?: string;
}

export default function AccountantPage() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'expenditure' | 'payment'>('expenditure');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userName, setUserName] = useState('');

    // Expenditure State
    const [expenditures, setExpenditures] = useState<Expenditure[]>([]);

    const [showExpenditureForm, setShowExpenditureForm] = useState(false);
    const [editingExpenditure, setEditingExpenditure] = useState<Expenditure | null>(null);
    const [expenditureForm, setExpenditureForm] = useState({
        slno: '',
        itemDescription: '',
        qty: 0,
        unit: 'pcs',
        rate: 0,
        projectName: '',
        location: '',
        date: new Date().toISOString().split('T')[0]
    });

    // Payment State
    const [payments, setPayments] = useState<Payment[]>([]);

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
    const [paymentForm, setPaymentForm] = useState({
        labourName: '',
        siteName: '',
        payAmount: 0,
        date: new Date().toISOString().split('T')[0],
        type: 'payment' as 'payment' | 'receipt',
        description: ''
    });

    // Fetch expenditures from API
    const fetchExpenditures = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch('/api/accountant/expenditures', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Map database fields to component state
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    slno: item.slno,
                    itemDescription: item.item_description,
                    qty: parseFloat(item.qty),
                    unit: item.unit,
                    rate: parseFloat(item.rate),
                    projectName: item.project_name,
                    location: item.location,
                    date: item.date,
                    total: parseFloat(item.total)
                }));
                setExpenditures(mapped);
            }
        } catch (error) {
            console.error('Error fetching expenditures:', error);
        }
    };

    // Fetch payments from API
    const fetchPayments = async () => {
        try {
            const token = getAuthToken();
            const response = await fetch('/api/accountant/payments', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                // Map database fields to component state
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    labourName: item.labour_name,
                    siteName: item.site_name,
                    payAmount: parseFloat(item.pay_amount),
                    date: item.date,
                    type: item.type,
                    description: item.description
                }));
                setPayments(mapped);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        }
    };

    // Authentication check
    useEffect(() => {
        const checkAuth = async () => {
            const token = getAuthToken();
            const userData = getUserData();

            if (!token) {
                router.replace('/login');
                return;
            }

            // Check if user has accountant role
            if (userData?.role !== 'accountant') {
                router.replace('/');
                return;
            }

            try {
                const response = await fetch('/api/auth/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                    setUserName(userData?.username || userData?.email || 'Accountant');
                    // Fetch data after authentication
                    await fetchExpenditures();
                    await fetchPayments();
                } else {
                    clearAuthData();
                    router.replace('/login');
                }
            } catch (error) {
                clearAuthData();
                router.replace('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogout = () => {
        clearAuthData();
        router.push('/login');
    };

    // Expenditure handlers
    const handleExpenditureInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setExpenditureForm(prev => ({
            ...prev,
            [name]: name === 'qty' || name === 'rate' ? parseFloat(value) || 0 : value
        }));
    };

    const handleExpenditureSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getAuthToken();

        try {
            if (editingExpenditure) {
                // Update existing expenditure
                const response = await fetch(`/api/accountant/expenditures/${editingExpenditure.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(expenditureForm),
                });

                if (response.ok) {
                    await fetchExpenditures(); // Refresh list
                    setEditingExpenditure(null);
                    resetExpenditureForm();
                } else {
                    const error = await response.json();
                    alert(error.error || 'Failed to update expenditure');
                }
            } else {
                // Create new expenditure
                const response = await fetch('/api/accountant/expenditures', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(expenditureForm),
                });

                if (response.ok) {
                    await fetchExpenditures(); // Refresh list
                    resetExpenditureForm();
                } else {
                    const error = await response.json();
                    alert(error.error || 'Failed to create expenditure');
                }
            }
        } catch (error) {
            console.error('Error submitting expenditure:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const resetExpenditureForm = () => {
        setExpenditureForm({
            slno: '',
            itemDescription: '',
            qty: 0,
            unit: 'pcs',
            rate: 0,
            projectName: '',
            location: '',
            date: new Date().toISOString().split('T')[0]
        });
        setShowExpenditureForm(false);
    };

    const handleEditExpenditure = (expenditure: Expenditure) => {
        setEditingExpenditure(expenditure);
        setExpenditureForm({
            slno: expenditure.slno,
            itemDescription: expenditure.itemDescription,
            qty: expenditure.qty,
            unit: expenditure.unit,
            rate: expenditure.rate,
            projectName: expenditure.projectName,
            location: expenditure.location,
            date: expenditure.date
        });
        setShowExpenditureForm(true);
    };

    const handleDeleteExpenditure = async (id: number) => {
        if (confirm('Are you sure you want to delete this expenditure?')) {
            const token = getAuthToken();

            try {
                const response = await fetch(`/api/accountant/expenditures/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    await fetchExpenditures(); // Refresh list
                } else {
                    const error = await response.json();
                    alert(error.error || 'Failed to delete expenditure');
                }
            } catch (error) {
                console.error('Error deleting expenditure:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    // Payment handlers
    const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPaymentForm(prev => ({
            ...prev,
            [name]: name === 'payAmount' ? parseFloat(value) || 0 : value
        }));
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = getAuthToken();

        try {
            if (editingPayment) {
                // Update existing payment
                const response = await fetch(`/api/accountant/payments/${editingPayment.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(paymentForm),
                });

                if (response.ok) {
                    await fetchPayments(); // Refresh list
                    setEditingPayment(null);
                    resetPaymentForm();
                } else {
                    const error = await response.json();
                    alert(error.error || 'Failed to update payment');
                }
            } else {
                // Create new payment
                const response = await fetch('/api/accountant/payments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(paymentForm),
                });

                if (response.ok) {
                    await fetchPayments(); // Refresh list
                    resetPaymentForm();
                } else {
                    const error = await response.json();
                    alert(error.error || 'Failed to create payment');
                }
            }
        } catch (error) {
            console.error('Error submitting payment:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const resetPaymentForm = () => {
        setPaymentForm({
            labourName: '',
            siteName: '',
            payAmount: 0,
            date: new Date().toISOString().split('T')[0],
            type: 'payment',
            description: ''
        });
        setShowPaymentForm(false);
    };

    const handleEditPayment = (payment: Payment) => {
        setEditingPayment(payment);
        setPaymentForm({
            labourName: payment.labourName,
            siteName: payment.siteName,
            payAmount: payment.payAmount,
            date: payment.date,
            type: payment.type,
            description: payment.description || ''
        });
        setShowPaymentForm(true);
    };

    const handleDeletePayment = async (id: number) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            const token = getAuthToken();

            try {
                const response = await fetch(`/api/accountant/payments/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    await fetchPayments(); // Refresh list
                } else {
                    const error = await response.json();
                    alert(error.error || 'Failed to delete payment');
                }
            } catch (error) {
                console.error('Error deleting payment:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };

    // Calculate totals
    const totalExpenditure = expenditures.reduce((sum, exp) => sum + exp.total, 0);
    const totalPayments = payments.filter(p => p.type === 'payment').reduce((sum, pay) => sum + pay.payAmount, 0);
    const totalReceipts = payments.filter(p => p.type === 'receipt').reduce((sum, pay) => sum + pay.payAmount, 0);
    const netBalance = totalReceipts - totalPayments - totalExpenditure;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Logo and Title */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <FiMenu className="w-6 h-6 text-gray-600" />
                            </button>
                            <img src="/logo.png" alt="Ratala" className="h-10 w-10" />
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                                    Ratala Accountant
                                </h1>
                                <p className="text-xs text-gray-500">Financial Management</p>
                            </div>
                        </div>

                        {/* Right: User Info */}
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-700">{userName}</p>
                                <p className="text-xs text-gray-500">Accountant</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            >
                                <FiLogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out mt-16 lg:mt-0`}>
                    <nav className="p-4 space-y-2">
                        <button
                            onClick={() => setActiveTab('expenditure')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'expenditure'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <FiFileText className="w-5 h-5" />
                            <span>Expenditure</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('payment')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'payment'
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <FiDollarSign className="w-5 h-5" />
                            <span>Payments & Receipts</span>
                        </button>
                    </nav>

                    {/* Summary Cards in Sidebar */}
                    <div className="p-4 space-y-3 border-t border-gray-200 mt-4">
                        <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200">
                            <p className="text-xs text-red-600 font-medium mb-1">Total Expenditure</p>
                            <p className="text-lg font-bold text-red-700">NPR {totalExpenditure.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-3 rounded-lg border border-orange-200">
                            <p className="text-xs text-orange-600 font-medium mb-1">Total Payments</p>
                            <p className="text-lg font-bold text-orange-700">NPR {totalPayments.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                            <p className="text-xs text-green-600 font-medium mb-1">Total Receipts</p>
                            <p className="text-lg font-bold text-green-700">NPR {totalReceipts.toLocaleString()}</p>
                        </div>
                        <div className={`bg-gradient-to-br p-3 rounded-lg border ${netBalance >= 0
                            ? 'from-blue-50 to-blue-100 border-blue-200'
                            : 'from-red-50 to-red-100 border-red-200'
                            }`}>
                            <p className={`text-xs font-medium mb-1 ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                Net Balance
                            </p>
                            <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                                NPR {netBalance.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Expenditure</p>
                                    <p className="text-2xl font-bold text-gray-800">NPR {totalExpenditure.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <FiTrendingDown className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Payments</p>
                                    <p className="text-2xl font-bold text-gray-800">NPR {totalPayments.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <FiTrendingDown className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Receipts</p>
                                    <p className="text-2xl font-bold text-gray-800">NPR {totalReceipts.toLocaleString()}</p>
                                </div>
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <FiTrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Net Balance</p>
                                    <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        NPR {netBalance.toLocaleString()}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg ${netBalance >= 0 ? 'bg-blue-100' : 'bg-red-100'}`}>
                                    <FiDollarSign className={`w-6 h-6 ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Expenditure Section */}
                    {activeTab === 'expenditure' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Expenditure Management</h2>
                                        <p className="text-sm text-gray-600 mt-1">Track assets and material purchases</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingExpenditure(null);
                                            resetExpenditureForm();
                                            setShowExpenditureForm(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                        <span className="hidden sm:inline">Add Expenditure</span>
                                    </button>
                                </div>
                            </div>

                            {/* Expenditure Form */}
                            {showExpenditureForm && (
                                <div className="p-6 bg-gray-50 border-b border-gray-200">
                                    <form onSubmit={handleExpenditureSubmit} className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {editingExpenditure ? 'Edit Expenditure' : 'New Expenditure'}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={resetExpenditureForm}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FiX className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">SL No.</label>
                                                <input
                                                    type="text"
                                                    name="slno"
                                                    value={expenditureForm.slno}
                                                    onChange={handleExpenditureInputChange}
                                                    required
                                                    placeholder="EXP-001"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Description</label>
                                                <input
                                                    type="text"
                                                    name="itemDescription"
                                                    value={expenditureForm.itemDescription}
                                                    onChange={handleExpenditureInputChange}
                                                    required
                                                    placeholder="Office Chairs, Furniture, etc."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                                <input
                                                    type="number"
                                                    name="qty"
                                                    value={expenditureForm.qty}
                                                    onChange={handleExpenditureInputChange}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                                <select
                                                    name="unit"
                                                    value={expenditureForm.unit}
                                                    onChange={handleExpenditureInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                >
                                                    <option value="pcs">Pieces</option>
                                                    <option value="sqft">Square Feet</option>
                                                    <option value="sqm">Square Meter</option>
                                                    <option value="kg">Kilogram</option>
                                                    <option value="ltr">Liter</option>
                                                    <option value="bag">Bag</option>
                                                    <option value="bundle">Bundle</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Rate (NPR)</label>
                                                <input
                                                    type="number"
                                                    name="rate"
                                                    value={expenditureForm.rate}
                                                    onChange={handleExpenditureInputChange}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                                <input
                                                    type="text"
                                                    name="projectName"
                                                    value={expenditureForm.projectName}
                                                    onChange={handleExpenditureInputChange}
                                                    required
                                                    placeholder="Project name"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={expenditureForm.location}
                                                    onChange={handleExpenditureInputChange}
                                                    required
                                                    placeholder="Kathmandu, Nepal"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={expenditureForm.date}
                                                    onChange={handleExpenditureInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                            <p className="text-sm text-blue-700 font-medium">
                                                Total Amount: NPR {(expenditureForm.qty * expenditureForm.rate).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md"
                                            >
                                                {editingExpenditure ? 'Update' : 'Add'} Expenditure
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetExpenditureForm}
                                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Expenditure Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL No.</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {expenditures.map((exp) => (
                                            <tr key={exp.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{exp.slno}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{exp.itemDescription}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.qty}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.unit}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">NPR {exp.rate.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">NPR {exp.total.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{exp.projectName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{exp.location}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{exp.date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditExpenditure(exp)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FiEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteExpenditure(exp.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Payment Section */}
                    {activeTab === 'payment' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">Payment & Receipt Management</h2>
                                        <p className="text-sm text-gray-600 mt-1">Track payments and receipts</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingPayment(null);
                                            resetPaymentForm();
                                            setShowPaymentForm(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                        <span className="hidden sm:inline">Add Transaction</span>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Form */}
                            {showPaymentForm && (
                                <div className="p-6 bg-gray-50 border-b border-gray-200">
                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {editingPayment ? 'Edit Transaction' : 'New Transaction'}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={resetPaymentForm}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FiX className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                                                <select
                                                    name="type"
                                                    value={paymentForm.type}
                                                    onChange={handlePaymentInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                >
                                                    <option value="payment">Payment (Outgoing)</option>
                                                    <option value="receipt">Receipt (Incoming)</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {paymentForm.type === 'payment' ? 'Labour/Vendor Name' : 'Client Name'}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="labourName"
                                                    value={paymentForm.labourName}
                                                    onChange={handlePaymentInputChange}
                                                    required
                                                    placeholder={paymentForm.type === 'payment' ? 'Ram Bahadur Thapa' : 'ABC Corporation'}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Site/Project Name</label>
                                                <input
                                                    type="text"
                                                    name="siteName"
                                                    value={paymentForm.siteName}
                                                    onChange={handlePaymentInputChange}
                                                    required
                                                    placeholder="Mega Dream Machhapokhari"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (NPR)</label>
                                                <input
                                                    type="number"
                                                    name="payAmount"
                                                    value={paymentForm.payAmount}
                                                    onChange={handlePaymentInputChange}
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={paymentForm.date}
                                                    onChange={handlePaymentInputChange}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                                <textarea
                                                    name="description"
                                                    value={paymentForm.description}
                                                    onChange={handlePaymentInputChange}
                                                    rows={2}
                                                    placeholder="Payment details..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-900"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md"
                                            >
                                                {editingPayment ? 'Update' : 'Add'} Transaction
                                            </button>
                                            <button
                                                type="button"
                                                onClick={resetPaymentForm}
                                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Payment Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {payments.map((pay) => (
                                            <tr key={pay.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{pay.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pay.type === 'payment'
                                                        ? 'bg-red-100 text-red-700'
                                                        : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {pay.type === 'payment' ? '↓ Payment' : '↑ Receipt'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{pay.labourName}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900">{pay.siteName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                                                    <span className={pay.type === 'payment' ? 'text-red-600' : 'text-green-600'}>
                                                        {pay.type === 'payment' ? '-' : '+'} NPR {pay.payAmount.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pay.date}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{pay.description || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEditPayment(pay)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FiEdit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePayment(pay.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
}
