import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../axios';

const PharmacyDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [pharmacy, setPharmacy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, pharmacyRes] = await Promise.all([
                axios.get('/pharmacy/stats'),
                axios.get('/pharmacy/my')
            ]);

            setStats(statsRes.data.stats);
            setPharmacy(pharmacyRes.data.pharmacy);
        } catch (error) {
            if (error.response?.status === 404) {
                // User doesn't have a pharmacy registered
                navigate('/pharmacy/register');
            } else {
                toast.error('Failed to fetch dashboard data');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Pharmacy Dashboard</h1>
                            <p className="text-gray-600">{pharmacy?.name}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => navigate('/pharmacy/medicines/add')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                            >
                                Add Medicine
                            </button>
                            <button
                                onClick={() => navigate('/pharmacy/profile')}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-8">
                        {['overview', 'medicines', 'orders'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Medicines"
                                value={stats?.medicines?.total || 0}
                                subtitle={`${stats?.medicines?.active || 0} active`}
                                color="bg-blue-100 text-blue-600"
                                icon={
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM10 18a8 8 0 100-16 8 8 0 000 16zm1-11H9a1 1 0 00-1 1v4a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Total Orders"
                                value={stats?.orders?.total || 0}
                                subtitle={`${stats?.orders?.pending || 0} pending`}
                                color="bg-green-100 text-green-600"
                                icon={
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Today's Orders"
                                value={stats?.orders?.today || 0}
                                color="bg-orange-100 text-orange-600"
                                icon={
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Low Stock Items"
                                value={stats?.medicines?.lowStock || 0}
                                color="bg-red-100 text-red-600"
                                icon={
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => navigate('/pharmacy/medicines/add')}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <div className="text-blue-600 mb-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-gray-900">Add New Medicine</h3>
                                    <p className="text-sm text-gray-500">Add medicines to your inventory</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <div className="text-green-600 mb-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-gray-900">Manage Orders</h3>
                                    <p className="text-sm text-gray-500">View and process orders</p>
                                </button>
                                <button
                                    onClick={() => setActiveTab('medicines')}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <div className="text-orange-600 mb-2">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-medium text-gray-900">Inventory Management</h3>
                                    <p className="text-sm text-gray-500">Manage medicine stock</p>
                                </button>
                            </div>
                        </div>

                        {/* Pharmacy Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy Status</h2>
                            <div className="flex items-center space-x-4">
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    pharmacy?.isVerified 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {pharmacy?.isVerified ? 'Verified' : 'Pending Verification'}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    pharmacy?.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {pharmacy?.status === 'active' ? 'Active' : 'Inactive'}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Rating: {pharmacy?.rating || 0}/5 ({pharmacy?.totalReviews || 0} reviews)
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'medicines' && (
                    <div>
                        <MedicineManagement />
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <OrderManagement />
                    </div>
                )}
            </div>
        </div>
    );
};

// Medicine Management Component (placeholder)
const MedicineManagement = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Medicine Management</h2>
        <p className="text-gray-600">Medicine management functionality will be implemented here.</p>
    </div>
);

// Order Management Component (placeholder)
const OrderManagement = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Management</h2>
        <p className="text-gray-600">Order management functionality will be implemented here.</p>
    </div>
);

export default PharmacyDashboard;
