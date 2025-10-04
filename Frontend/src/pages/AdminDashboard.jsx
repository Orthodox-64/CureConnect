import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Users, 
    UserCheck, 
    Building2, 
    TrendingUp, 
    Shield, 
    LogOut, 
    RefreshCw,
    Eye,
    Search,
    Filter,
    Calendar,
    UserX,
    Mail,
    Phone,
    Clock,
    Trash2,
    Ban,
    CheckCircle,
    Headphones,
    AlertCircle,
    Tag,
    MessageSquare,
    XCircle,
    User
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from '../axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTickets, updateTicketStatus, deleteTicket, clearTicketErrors, clearTicketMessages } from '../actions/ticketActions';

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { loading: ticketsLoading, tickets, error: ticketsError, totalTickets, stats: ticketStats } = useSelector(state => state.allTickets);
    const { loading: updateLoading, success: updateSuccess, error: updateError } = useSelector(state => state.updateTicket);
    const { loading: deleteLoading, success: deleteSuccess, error: deleteError } = useSelector(state => state.deleteTicket);

    const [stats, setStats] = useState({
        totalUsers: 15,
        totalDoctors: 8,
        totalPharmacists: 5,
        totalPharmacies: 3,
        recentUsers: 3,
        recentDoctors: 2,
        recentPharmacists: 1,
        total: 31
    });
    const [patients, setPatients] = useState([
        {
            _id: '1',
            name: 'John Doe',
            contact: 'john@example.com',
            medicalHistoryCount: 3,
            createdAt: new Date().toISOString(),
            avatar: { url: null },
            isBlocked: false
        },
        {
            _id: '2',
            name: 'Jane Smith',
            contact: '+1234567890',
            medicalHistoryCount: 1,
            createdAt: new Date().toISOString(),
            avatar: { url: null },
            isBlocked: true
        }
    ]);
    const [doctors, setDoctors] = useState([
        {
            _id: '1',
            name: 'Dr. Alice Johnson',
            contact: 'alice@hospital.com',
            speciality: 'Cardiology',
            availability: 'true',
            createdAt: new Date().toISOString(),
            avatar: { url: null },
            isBlocked: false
        },
        {
            _id: '2',
            name: 'Dr. Bob Wilson',
            contact: 'bob@clinic.com',
            speciality: 'Neurology',
            availability: 'true',
            createdAt: new Date().toISOString(),
            avatar: { url: null },
            isBlocked: false
        }
    ]);
    const [pharmacies, setPharmacies] = useState([
        {
            _id: '1',
            name: 'HealthCare Pharmacy',
            owner: { name: 'Mike Johnson', email: 'mike@pharmacy.com' },
            verificationStatus: 'verified',
            createdAt: new Date().toISOString(),
            isBlocked: false
        },
        {
            _id: '2',
            name: 'MediStore Plus',
            owner: { name: 'Sarah Davis', email: 'sarah@medistore.com' },
            verificationStatus: 'pending',
            createdAt: new Date().toISOString(),
            isBlocked: false
        }
    ]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    // Ticket filters
    const [ticketFilters, setTicketFilters] = useState({
        status: 'all',
        priority: 'all',
        category: 'all',
        search: '',
        page: 1,
        limit: 10
    });
    
    const navigate = useNavigate();

    // Load dashboard data directly without authentication check
    useEffect(() => {
        console.log('Admin Dashboard - Loading data directly');
        fetchDashboardData();
    }, [currentPage, filterRole]);

    // Load tickets when tickets tab is active
    useEffect(() => {
        if (activeTab === 'tickets') {
            dispatch(getAllTickets(ticketFilters));
        }
    }, [dispatch, activeTab, ticketFilters]);

    // Handle ticket-related success/error messages
    useEffect(() => {
        if (updateSuccess) {
            toast.success('Ticket updated successfully');
            dispatch(clearTicketMessages());
            dispatch(getAllTickets(ticketFilters)); // Refresh tickets
        }
        if (deleteSuccess) {
            toast.success('Ticket deleted successfully');
            dispatch(clearTicketMessages());
            dispatch(getAllTickets(ticketFilters)); // Refresh tickets
        }
        if (ticketsError) {
            toast.error(ticketsError);
            dispatch(clearTicketErrors());
        }
        if (updateError) {
            toast.error(updateError);
            dispatch(clearTicketErrors());
        }
        if (deleteError) {
            toast.error(deleteError);
            dispatch(clearTicketErrors());
        }
    }, [dispatch, updateSuccess, deleteSuccess, ticketsError, updateError, deleteError, ticketFilters]);

    const fetchDashboardData = async () => {
        setLoading(true);
        console.log('Dashboard - Starting data fetch');
        
        try {
            // Try to get token, but don't fail if missing
            const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
            console.log('Dashboard - Token found:', token ? 'yes' : 'no');
            
            const config = token ? {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } : {};

            // Set default/mock data in case API calls fail
            const defaultStats = {
                totalUsers: 0,
                totalDoctors: 0,
                totalPharmacists: 0,
                totalPharmacies: 0,
                recentUsers: 0,
                recentDoctors: 0,
                recentPharmacists: 0,
                total: 0
            };

            // Try to fetch real data, but use defaults if it fails
            try {
                console.log('Dashboard - Fetching stats');
                const statsResponse = await axios.get('/admin/stats', config);
                setStats(statsResponse.data.stats || defaultStats);
                console.log('Dashboard - Stats fetched successfully');
            } catch (error) {
                console.log('Dashboard - Stats fetch failed, using defaults');
                setStats(defaultStats);
            }

            // Fetch users with fallback
            try {
                console.log('Dashboard - Fetching users');
                const usersResponse = await axios.get(`/admin/users?page=${currentPage}&limit=10&role=${filterRole === 'all' ? '' : filterRole}`, config);
                setUsers(usersResponse.data.users || []);
                setTotalPages(usersResponse.data.totalPages || 1);
                console.log('Dashboard - Users fetched successfully');
            } catch (error) {
                console.log('Dashboard - Users fetch failed, using empty array');
                setUsers([]);
                setTotalPages(1);
            }

            // Fetch doctors with fallback
            try {
                console.log('Dashboard - Fetching doctors');
                const doctorsResponse = await axios.get('/admin/doctors', config);
                const doctorsData = doctorsResponse.data.doctors || [];
                setDoctors(doctorsData);
                console.log('Dashboard - Doctors fetched successfully:', doctorsData.length);
            } catch (error) {
                console.log('Dashboard - Doctors fetch failed, using fallback data');
                // Keep the existing mock data if API fails
            }

            // Fetch patients with fallback
            try {
                console.log('Dashboard - Fetching patients');
                const patientsResponse = await axios.get('/admin/patients', config);
                const patientsData = patientsResponse.data.patients || [];
                setPatients(patientsData);
                console.log('Dashboard - Patients fetched successfully:', patientsData.length);
            } catch (error) {
                console.log('Dashboard - Patients fetch failed, using fallback data');
                // Keep the existing mock data if API fails
            }

            // Fetch pharmacies with fallback
            try {
                console.log('Dashboard - Fetching pharmacies');
                const pharmaciesResponse = await axios.get('/admin/pharmacies', config);
                const pharmaciesData = pharmaciesResponse.data.pharmacies || [];
                setPharmacies(pharmaciesData);
                console.log('Dashboard - Pharmacies fetched successfully:', pharmaciesData.length);
            } catch (error) {
                console.log('Dashboard - Pharmacies fetch failed, using fallback data');
                // Keep the existing mock data if API fails
            }

            console.log('Dashboard - Data fetch completed');

        } catch (error) {
            console.error('Error in dashboard data fetch:', error);
            // Don't redirect on errors, just show the dashboard with empty data
            toast.error('Some data may not be available. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        localStorage.removeItem('token'); // Also remove regular token
        toast.success('Logged out successfully');
        navigate('/');
    };

    // Delete user handler
    const handleDeleteUser = async (userId, userName, userType) => {
        if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
            try {
                const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
                const config = token ? {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                } : {};

                console.log(`Attempting to delete user: ${userId} (${userType})`);
                const response = await axios.delete(`/admin/user/${userId}`, config);
                
                if (response.data.success) {
                    toast.success(`${userType} deleted successfully`);
                    
                    // Immediately update the local state to reflect the deletion
                    if (userType === 'Patient') {
                        setPatients(prev => prev.filter(p => p._id !== userId));
                    } else if (userType === 'Doctor') {
                        setDoctors(prev => prev.filter(d => d._id !== userId));
                    } else if (userType === 'Pharmacy') {
                        setPharmacies(prev => prev.filter(p => p._id !== userId));
                    }
                    setUsers(prev => prev.filter(u => u._id !== userId));
                    
                    // Also refresh data from server to sync stats
                    fetchDashboardData();
                } else {
                    toast.error('Failed to delete user');
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                console.error('Error response:', error.response?.data);
                toast.error(error.response?.data?.message || 'Failed to delete user');
            }
        }
    };

    // Block/Unblock user handler
    const handleToggleUserStatus = async (userId, userName, userType, isCurrentlyBlocked) => {
        const action = isCurrentlyBlocked ? 'unblock' : 'block';
        if (window.confirm(`Are you sure you want to ${action} ${userName}?`)) {
            try {
                const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
                const config = token ? {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                } : {};

                console.log(`Attempting to ${action} user: ${userId} (${userType})`);
                const response = await axios.patch(`/admin/user/${userId}/status`, {
                    isBlocked: !isCurrentlyBlocked
                }, config);
                
                if (response.data.success) {
                    toast.success(`${userType} ${action}ed successfully`);
                    
                    // Immediately update the local state
                    const updateFunction = (prev) => prev.map(item => 
                        item._id === userId ? { ...item, isBlocked: !isCurrentlyBlocked } : item
                    );
                    
                    if (userType === 'Patient') {
                        setPatients(updateFunction);
                    } else if (userType === 'Doctor') {
                        setDoctors(updateFunction);
                    } else if (userType === 'Pharmacy') {
                        setPharmacies(updateFunction);
                    }
                    setUsers(updateFunction);
                    
                    // Refresh data from server
                    fetchDashboardData();
                } else {
                    toast.error(`Failed to ${action} user`);
                }
            } catch (error) {
                console.error(`Error ${action}ing user:`, error);
                console.error('Error response:', error.response?.data);
                toast.error(error.response?.data?.message || `Failed to ${action} user`);
            }
        }
    };

    // Ticket handlers
    const handleTicketFilterChange = (key, value) => {
        setTicketFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filtering
        }));
    };

    const handleTicketPageChange = (newPage) => {
        setTicketFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const handleUpdateTicketStatus = async (ticketId, currentStatus) => {
        const statusMap = {
            'Open': 'In Progress',
            'In Progress': 'Resolved',
            'Resolved': 'Closed'
        };
        
        const newStatus = statusMap[currentStatus] || 'Open';
        dispatch(updateTicketStatus(ticketId, { status: newStatus }));
    };

    const handleDeleteTicket = async (ticketId) => {
        if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
            dispatch(deleteTicket(ticketId));
        }
    };

    const getTicketStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
        switch (status) {
            case 'Open':
                return `${baseClasses} bg-orange-100 text-orange-800`;
            case 'In Progress':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'Resolved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'Closed':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getTicketPriorityBadge = (priority) => {
        const baseClasses = "inline-flex items-center px-2 py-1 rounded text-xs font-medium";
        switch (priority) {
            case 'Critical':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'High':
                return `${baseClasses} bg-orange-100 text-orange-800`;
            case 'Medium':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'Low':
                return `${baseClasses} bg-green-100 text-green-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    // Function to get filtered data based on role and search
    const getFilteredData = () => {
        let dataToFilter = [];
        
        if (filterRole === 'all') {
            // Combine all users from different arrays
            dataToFilter = [
                ...patients.map(p => ({ ...p, role: 'patient' })),
                ...doctors.map(d => ({ ...d, role: 'doctor' })),
                ...pharmacies.map(p => ({ ...p, role: 'pharmacy' })),
                ...users // Include any other users from the API
            ];
        } else if (filterRole === 'patient') {
            dataToFilter = patients.map(p => ({ ...p, role: 'patient' }));
        } else if (filterRole === 'doctor') {
            dataToFilter = doctors.map(d => ({ ...d, role: 'doctor' }));
        } else if (filterRole === 'pharmacist') {
            dataToFilter = pharmacies.map(p => ({ ...p, role: 'pharmacy' }));
        }

        // Apply search filter
        return dataToFilter.filter(item => {
            const searchableText = [
                item.name,
                item.contact,
                item.speciality,
                item.owner?.name,
                item.owner?.email
            ].filter(Boolean).join(' ').toLowerCase();
            
            return searchableText.includes(searchTerm.toLowerCase());
        });
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contact.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDoctors = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPharmacies = pharmacies.filter(pharmacy =>
        pharmacy.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const StatCard = ({ icon: Icon, title, value, change, color, description }) => (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    {change !== undefined && (
                        <p className={`text-sm mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change} this month
                        </p>
                    )}
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </motion.div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-sm text-gray-600">CureConnect Healthcare Management</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <button
                                onClick={fetchDashboardData}
                                className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                title="Refresh"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="mb-8">
                    <nav className="flex space-x-8 border-b border-gray-200">
                        {[
                            { id: 'overview', label: 'Overview', icon: TrendingUp },
                            { id: 'patients', label: 'Patients', icon: Users },
                            { id: 'doctors', label: 'Doctors', icon: UserCheck },
                            { id: 'pharmacies', label: 'Pharmacies', icon: Building2 },
                            { id: 'tickets', label: 'Support Tickets', icon: Headphones }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={Users}
                                title="Total Users"
                                value={stats.totalUsers}
                                change={stats.recentUsers}
                                color="bg-blue-500"
                                description="Registered patients"
                            />
                            <StatCard
                                icon={UserCheck}
                                title="Total Doctors"
                                value={stats.totalDoctors}
                                change={stats.recentDoctors}
                                color="bg-green-500"
                                description="Active doctors"
                            />
                            <StatCard
                                icon={Building2}
                                title="Pharmacies"
                                value={stats.totalPharmacies}
                                color="bg-purple-500"
                                description="Registered pharmacies"
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Total Platform Users"
                                value={stats.total}
                                color="bg-orange-500"
                                description="All user types"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setActiveTab('patients')}
                                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Manage Patients</p>
                                        <p className="text-sm text-gray-600">View and manage all patients</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('doctors')}
                                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <UserCheck className="w-5 h-5 text-green-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Manage Doctors</p>
                                        <p className="text-sm text-gray-600">View doctor profiles</p>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('pharmacies')}
                                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Building2 className="w-5 h-5 text-purple-600" />
                                    <div className="text-left">
                                        <p className="font-medium text-gray-900">Manage Pharmacies</p>
                                        <p className="text-sm text-gray-600">View and manage pharmacies</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Patients Tab */}
                {activeTab === 'patients' && (
                    <div className="space-y-6">
                        {/* Search and Filter */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="patient">Patients</option>
                                        <option value="doctor">Doctors</option>
                                        <option value="pharmacist">Pharmacists</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {filterRole === 'all' ? 'All Users' : 
                                     filterRole === 'patient' ? 'All Patients' :
                                     filterRole === 'doctor' ? 'All Doctors' :
                                     filterRole === 'pharmacist' ? 'All Pharmacists' : 'All Users'}
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medical History</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {getFilteredData().map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {item.avatar?.url ? (
                                                                <img className="h-10 w-10 rounded-full object-cover" src={item.avatar.url} alt="" />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                                                                    <Users className="w-5 h-5 text-blue-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                                            <div className="text-sm text-gray-500">ID: {item._id.slice(-8)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        {(item.contact || item.email || '').includes('@') ? (
                                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                        ) : (
                                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                        )}
                                                        {item.contact || item.phone || item.email || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        item.isBlocked 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {item.isBlocked ? 'Blocked' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {item.medicalHistoryCount || 0} records
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        {formatDate(item.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleToggleUserStatus(item._id, item.name, 'Patient', item.isBlocked)}
                                                            className={`p-1 rounded ${item.isBlocked 
                                                                ? 'text-green-600 hover:text-green-900 hover:bg-green-50' 
                                                                : 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                                                            }`}
                                                            title={item.isBlocked ? 'Unblock Patient' : 'Block Patient'}
                                                        >
                                                            {item.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(item._id, item.name, 'Patient')}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            title="Delete Patient"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Page {currentPage} of {totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Doctors Tab */}
                {activeTab === 'doctors' && (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search doctors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Doctors Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDoctors.map((doctor) => (
                                <motion.div
                                    key={doctor._id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
                                >
                                    <div className="text-center">
                                        <div className="mx-auto h-20 w-20 rounded-full overflow-hidden mb-4">
                                            {doctor.avatar?.url ? (
                                                <img src={doctor.avatar.url} alt={doctor.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                                                    <UserCheck className="w-8 h-8 text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Dr. {doctor.name}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{doctor.speciality}</p>
                                        <div className="flex items-center justify-center text-sm text-gray-500 mb-3">
                                            {(doctor.contact || '').includes('@') ? (
                                                <Mail className="w-4 h-4 mr-2" />
                                            ) : (
                                                <Phone className="w-4 h-4 mr-2" />
                                            )}
                                            {doctor.contact || 'N/A'}
                                        </div>
                                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
                                            <span className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {doctor.availability === 'true' ? 'Available' : 'Unavailable'}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDate(doctor.createdAt)}
                                            </span>
                                        </div>
                                        
                                        {/* Status Badge */}
                                        <div className="mb-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                doctor.isBlocked 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {doctor.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
                                            <button 
                                                className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleToggleUserStatus(doctor._id, doctor.name, 'Doctor', doctor.isBlocked)}
                                                className={`p-2 rounded ${doctor.isBlocked 
                                                    ? 'text-green-600 hover:text-green-900 hover:bg-green-50' 
                                                    : 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                                                }`}
                                                title={doctor.isBlocked ? 'Unblock Doctor' : 'Block Doctor'}
                                            >
                                                {doctor.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteUser(doctor._id, doctor.name, 'Doctor')}
                                                className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                                                title="Delete Doctor"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pharmacies Tab */}
                {activeTab === 'pharmacies' && (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="relative max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search pharmacies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Pharmacies Table */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">All Pharmacies</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pharmacy</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredPharmacies.map((pharmacy) => (
                                            <tr key={pharmacy._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-purple-300 flex items-center justify-center">
                                                                <Building2 className="w-5 h-5 text-purple-600" />
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{pharmacy.name}</div>
                                                            <div className="text-sm text-gray-500">ID: {pharmacy._id.slice(-8)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{pharmacy.owner?.name || 'N/A'}</div>
                                                    <div className="text-sm text-gray-500">{pharmacy.owner?.email || ''}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        pharmacy.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                                                        pharmacy.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        pharmacy.verificationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {pharmacy.verificationStatus || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        pharmacy.isBlocked 
                                                            ? 'bg-red-100 text-red-800' 
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {pharmacy.isBlocked ? 'Blocked' : 'Active'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        {formatDate(pharmacy.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleToggleUserStatus(pharmacy._id, pharmacy.name, 'Pharmacy', pharmacy.isBlocked)}
                                                            className={`p-1 rounded ${pharmacy.isBlocked 
                                                                ? 'text-green-600 hover:text-green-900 hover:bg-green-50' 
                                                                : 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                                                            }`}
                                                            title={pharmacy.isBlocked ? 'Unblock Pharmacy' : 'Block Pharmacy'}
                                                        >
                                                            {pharmacy.isBlocked ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteUser(pharmacy._id, pharmacy.name, 'Pharmacy')}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            title="Delete Pharmacy"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Support Tickets Tab */}
                {activeTab === 'tickets' && (
                    <div className="space-y-6">
                        {/* Tickets Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-orange-100 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                                        <p className="text-2xl font-bold text-gray-900">{ticketStats?.open || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">In Progress</p>
                                        <p className="text-2xl font-bold text-gray-900">{ticketStats?.inProgress || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Resolved</p>
                                        <p className="text-2xl font-bold text-gray-900">{ticketStats?.resolved || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-gray-100 rounded-full">
                                        <XCircle className="w-6 h-6 text-gray-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Closed</p>
                                        <p className="text-2xl font-bold text-gray-900">{ticketStats?.closed || 0}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ticket Filters */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search tickets..."
                                        value={ticketFilters.search}
                                        onChange={(e) => handleTicketFilterChange('search', e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select
                                    value={ticketFilters.status}
                                    onChange={(e) => handleTicketFilterChange('status', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                </select>
                                <select
                                    value={ticketFilters.priority}
                                    onChange={(e) => handleTicketFilterChange('priority', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Priority</option>
                                    <option value="Critical">Critical</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <select
                                    value={ticketFilters.category}
                                    onChange={(e) => handleTicketFilterChange('category', e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="Technical Issue">Technical Issue</option>
                                    <option value="Account Problem">Account Problem</option>
                                    <option value="Appointment Issue">Appointment Issue</option>
                                    <option value="Payment Issue">Payment Issue</option>
                                    <option value="Medical Records">Medical Records</option>
                                    <option value="Prescription Issue">Prescription Issue</option>
                                    <option value="General Inquiry">General Inquiry</option>
                                    <option value="Bug Report">Bug Report</option>
                                    <option value="Feature Request">Feature Request</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Tickets Table */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
                            </div>
                            
                            {ticketsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading tickets...</span>
                                </div>
                            ) : tickets && tickets.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {tickets.map((ticket) => (
                                                <tr key={ticket._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-blue-600">
                                                            {ticket.ticketId}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                                            {ticket.subject}
                                                        </div>
                                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                                            {ticket.description}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-8 w-8">
                                                                {ticket.userId?.avatar?.url ? (
                                                                    <img className="h-8 w-8 rounded-full object-cover" src={ticket.userId.avatar.url} alt="" />
                                                                ) : (
                                                                    <div className="h-8 w-8 rounded-full bg-blue-300 flex items-center justify-center">
                                                                        <User className="w-4 h-4 text-blue-600" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {ticket.userId?.name || 'Unknown User'}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {ticket.userId?.email || 'No email'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            {ticket.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={getTicketPriorityBadge(ticket.priority)}>
                                                            {ticket.priority}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={getTicketStatusBadge(ticket.status)}>
                                                            {ticket.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(ticket.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            {ticket.status !== 'Closed' && (
                                                                <button 
                                                                    onClick={() => handleUpdateTicketStatus(ticket._id, ticket.status)}
                                                                    className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                                                    title="Update Status"
                                                                    disabled={updateLoading}
                                                                >
                                                                    <CheckCircle className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => handleDeleteTicket(ticket._id)}
                                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                                title="Delete Ticket"
                                                                disabled={deleteLoading}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets found</h3>
                                    <p className="text-gray-500">
                                        {ticketFilters.status !== 'all' || ticketFilters.search
                                            ? 'No tickets match your current filters.'
                                            : 'No support tickets have been created yet.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
