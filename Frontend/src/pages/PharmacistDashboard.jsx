import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../axios';

const PharmacistDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [pharmacy, setPharmacy] = useState(null);
    const [stats, setStats] = useState(null);
    const [medicines, setMedicines] = useState([]);
    const [lowStockMedicines, setLowStockMedicines] = useState([]);
    const [expiringMedicines, setExpiringMedicines] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
    const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    
    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    
    // New medicine form data
    const [newMedicine, setNewMedicine] = useState({
        name: '',
        genericName: '',
        category: '',
        manufacturer: '',
        composition: '',
        strength: '',
        formType: '',
        packSize: '',
        price: '',
        mrp: '',
        discount: 0,
        stock: '',
        minStock: 10,
        expiryDate: '',
        batchNumber: '',
        description: '',
        uses: '',
        sideEffects: '',
        precautions: '',
        dosage: '',
        prescriptionRequired: false
    });

    const categories = [
        'Pain Relief', 'Antibiotics', 'Vitamins & Supplements', 'Cold & Flu',
        'Digestive Health', 'Heart & Blood Pressure', 'Diabetes', 'Skin Care',
        'Eye Care', 'Women Health', 'Men Health', 'Child Care', 'First Aid',
        'Prescription', 'Other'
    ];

    const formTypes = [
        'Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 
        'Cream', 'Ointment', 'Gel', 'Powder', 'Other'
    ];

    useEffect(() => {
        loadPharmacyData();
    }, []);

    const loadPharmacyData = async () => {
        try {
            setLoading(true);
            const [pharmacyRes, statsRes, medicinesRes] = await Promise.all([
                axios.get('/pharmacy/my'),
                axios.get('/pharmacy/stats'),
                axios.get('/pharmacy/medicines/search')
            ]);

            setPharmacy(pharmacyRes.data.pharmacy);
            setStats(statsRes.data.stats);
            setMedicines(medicinesRes.data.medicines);

            // Orders can be empty or unavailable; don't fail whole dashboard
            try {
                const ordersRes = await axios.get('/pharmacy/orders');
                setOrders(ordersRes.data.orders || []);
            } catch (ordersErr) {
                const code = ordersErr?.response?.status;
                if (code === 404 || code === 400) {
                    setOrders([]);
                } else {
                    // Bubble up unexpected errors
                    throw ordersErr;
                }
            }

            // Load low stock and expiring medicines
            loadAlerts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const loadAlerts = async () => {
        try {
            const [lowStockRes, expiringRes] = await Promise.all([
                axios.get('/pharmacy/medicines/low-stock'),
                axios.get('/pharmacy/medicines/expiring?days=30')
            ]);
            
            setLowStockMedicines(lowStockRes.data.medicines);
            setExpiringMedicines(expiringRes.data.medicines);
        } catch (error) {
            console.error('Failed to load alerts:', error);
        }
    };

    const handleAddMedicine = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/pharmacy/medicines', newMedicine);
            toast.success('Medicine added successfully');
            setShowAddMedicineModal(false);
            setNewMedicine({
                name: '', genericName: '', category: '', manufacturer: '',
                composition: '', strength: '', formType: '', packSize: '',
                price: '', mrp: '', discount: 0, stock: '', minStock: 10,
                expiryDate: '', batchNumber: '', description: '', uses: '',
                sideEffects: '', precautions: '', dosage: '', prescriptionRequired: false
            });
            loadPharmacyData();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add medicine');
        }
    };

    const handleUpdateStock = async (medicineId, newStock) => {
        try {
            await axios.put('/pharmacy/medicines/bulk-stock-update', {
                stockUpdates: [{ medicineId, newStock }]
            });
            toast.success('Stock updated successfully');
            loadPharmacyData();
    } catch {
            toast.error('Failed to update stock');
        }
    };

    const handleDeleteMedicine = async (medicineId) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                await axios.delete(`/pharmacy/medicine/${medicineId}`);
                toast.success('Medicine deleted successfully');
                loadPharmacyData();
            } catch {
                toast.error('Failed to delete medicine');
            }
        }
    };

    const handleSearch = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('keyword', searchTerm);
            if (filterCategory) params.append('category', filterCategory);
            if (stockFilter) params.append('stockStatus', stockFilter);

            const response = await axios.get(`/pharmacy/medicines/search?${params}`);
            setMedicines(response.data.medicines);
    } catch {
            toast.error('Search failed');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN');
    };

    const getStockStatus = (medicine) => {
        if (medicine.stock === 0) return { text: 'Out of Stock', color: 'text-red-600' };
        if (medicine.stock <= medicine.minStock) return { text: 'Low Stock', color: 'text-yellow-600' };
        return { text: 'In Stock', color: 'text-green-600' };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {pharmacy?.name} - Dashboard
                        </h1>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowBulkUploadModal(true)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                                Bulk Upload
                            </button>
                            <button
                                onClick={() => navigate('/pharmacist/create-medicine')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                            >
                                Add Medicine
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex space-x-1 mb-6">
                    {[
                        { id: 'overview', label: 'Overview' },
                        { id: 'medicines', label: 'Medicines' },
                        { id: 'orders', label: 'Orders' },
                        { id: 'alerts', label: 'Alerts' },
                        { id: 'reports', label: 'Reports' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-sm font-medium text-gray-500">Total Medicines</div>
                                <div className="text-2xl font-bold text-blue-600">{stats?.medicines?.total || 0}</div>
                                <div className="text-sm text-green-600">
                                    {stats?.medicines?.active || 0} active
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-sm font-medium text-gray-500">Total Orders</div>
                                <div className="text-2xl font-bold text-green-600">{stats?.orders?.total || 0}</div>
                                <div className="text-sm text-orange-600">
                                    {stats?.orders?.pending || 0} pending
                                </div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-sm font-medium text-gray-500">Today&apos;s Orders</div>
                                <div className="text-2xl font-bold text-purple-600">{stats?.orders?.today || 0}</div>
                                <div className="text-sm text-gray-600">Last 24 hours</div>
                            </div>
                            
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="text-sm font-medium text-gray-500">Low Stock Items</div>
                                <div className="text-2xl font-bold text-red-600">{stats?.medicines?.lowStock || 0}</div>
                                <div className="text-sm text-red-600">Need attention</div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => setActiveTab('medicines')}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <div className="text-sm font-medium text-gray-900">Manage Inventory</div>
                                    <div className="text-xs text-gray-600">Add, edit, or remove medicines</div>
                                </button>
                                
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <div className="text-sm font-medium text-gray-900">Process Orders</div>
                                    <div className="text-xs text-gray-600">View and manage customer orders</div>
                                </button>
                                
                                <button
                                    onClick={() => setActiveTab('alerts')}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                                >
                                    <div className="text-sm font-medium text-gray-900">View Alerts</div>
                                    <div className="text-xs text-gray-600">Low stock and expiry warnings</div>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Medicines Tab */}
                {activeTab === 'medicines' && (
                    <div className="space-y-6">
                        {/* Search and Filter */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    placeholder="Search medicines..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                                
                                <select
                                    value={stockFilter}
                                    onChange={(e) => setStockFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">All Stock</option>
                                    <option value="inStock">In Stock</option>
                                    <option value="lowStock">Low Stock</option>
                                    <option value="outOfStock">Out of Stock</option>
                                </select>
                                
                                <button
                                    onClick={handleSearch}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                        {/* Medicines List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Medicine Inventory ({medicines.length})
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Medicine
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Expiry
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {medicines.map(medicine => {
                                            const stockStatus = getStockStatus(medicine);
                                            return (
                                                <tr key={medicine._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {medicine.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {medicine.manufacturer} • {medicine.strength}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {medicine.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ₹{medicine.price}
                                                        {medicine.mrp > medicine.price && (
                                                            <div className="text-xs text-gray-500 line-through">
                                                                ₹{medicine.mrp}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center space-x-2">
                                                            <input
                                                                type="number"
                                                                value={medicine.stock}
                                                                onChange={(e) => handleUpdateStock(medicine._id, e.target.value)}
                                                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                                min="0"
                                                            />
                                                            <span className={`text-xs font-medium ${stockStatus.color}`}>
                                                                {stockStatus.text}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatDate(medicine.expiryDate)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => setSelectedMedicine(medicine)}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteMedicine(medicine._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Orders ({orders.length})</h2>
                                <div className="text-sm text-gray-500">Most recent first</div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                                                    No orders to display.
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((order) => (
                                                <tr key={order._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {order.orderNumber || order._id.slice(-6)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {order.customer?.name || '—'}
                                                        <div className="text-xs text-gray-500">{order.customer?.phone || order.customer?.email || ''}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {order.items?.length || 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ₹{order.pricing?.totalPrice ?? 0}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                            {order.orderStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {new Date(order.createdAt).toLocaleString('en-IN')}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alerts Tab */}
                {activeTab === 'alerts' && (
                    <div className="space-y-6">
                        {/* Low Stock Medicines */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-red-600">
                                    Low Stock Medicines ({lowStockMedicines.length})
                                </h2>
                            </div>
                            <div className="p-6">
                                {lowStockMedicines.length === 0 ? (
                                    <p className="text-gray-600">No medicines are currently low on stock.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {lowStockMedicines.map(medicine => (
                                            <div key={medicine._id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                                                <h3 className="font-medium text-gray-900">{medicine.name}</h3>
                                                <p className="text-sm text-gray-600">{medicine.manufacturer}</p>
                                                <p className="text-sm text-red-600 font-medium">
                                                    Stock: {medicine.stock} (Min: {medicine.minStock})
                                                </p>
                                                <button
                                                    onClick={() => setSelectedMedicine(medicine)}
                                                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Update Stock →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expiring Medicines */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-orange-600">
                                    Expiring Soon ({expiringMedicines.length})
                                </h2>
                                <p className="text-sm text-gray-600">Medicines expiring within 30 days</p>
                            </div>
                            <div className="p-6">
                                {expiringMedicines.length === 0 ? (
                                    <p className="text-gray-600">No medicines are expiring within the next 30 days.</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {expiringMedicines.map(medicine => (
                                            <div key={medicine._id} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                                                <h3 className="font-medium text-gray-900">{medicine.name}</h3>
                                                <p className="text-sm text-gray-600">{medicine.manufacturer}</p>
                                                <p className="text-sm text-orange-600 font-medium">
                                                    Expires: {formatDate(medicine.expiryDate)}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Stock: {medicine.stock}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Medicine Modal */}
            {showAddMedicineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Add New Medicine</h2>
                                <button
                                    onClick={() => setShowAddMedicineModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleAddMedicine} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-900">Basic Information</h3>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Medicine Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={newMedicine.name}
                                            onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Generic Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newMedicine.genericName}
                                            onChange={(e) => setNewMedicine({...newMedicine, genericName: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category *
                                        </label>
                                        <select
                                            value={newMedicine.category}
                                            onChange={(e) => setNewMedicine({...newMedicine, category: e.target.value})}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Manufacturer *
                                        </label>
                                        <input
                                            type="text"
                                            value={newMedicine.manufacturer}
                                            onChange={(e) => setNewMedicine({...newMedicine, manufacturer: e.target.value})}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Pricing and Stock */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-900">Pricing & Stock</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                MRP *
                                            </label>
                                            <input
                                                type="number"
                                                value={newMedicine.mrp}
                                                onChange={(e) => setNewMedicine({...newMedicine, mrp: e.target.value})}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Selling Price *
                                            </label>
                                            <input
                                                type="number"
                                                value={newMedicine.price}
                                                onChange={(e) => setNewMedicine({...newMedicine, price: e.target.value})}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Stock Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                value={newMedicine.stock}
                                                onChange={(e) => setNewMedicine({...newMedicine, stock: e.target.value})}
                                                required
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Stock
                                            </label>
                                            <input
                                                type="number"
                                                value={newMedicine.minStock}
                                                onChange={(e) => setNewMedicine({...newMedicine, minStock: e.target.value})}
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiry Date *
                                        </label>
                                        <input
                                            type="date"
                                            value={newMedicine.expiryDate}
                                            onChange={(e) => setNewMedicine({...newMedicine, expiryDate: e.target.value})}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowAddMedicineModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                                >
                                    Add Medicine
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacistDashboard;
