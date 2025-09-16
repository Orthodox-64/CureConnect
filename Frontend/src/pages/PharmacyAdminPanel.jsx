import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../axios';

const PharmacyAdminPanel = () => {
    const [activeTab, setActiveTab] = useState('pharmacies');
    const [pharmacies, setPharmacies] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'pharmacies') {
                const response = await axios.get('/admin/pharmacies');
                setPharmacies(response.data.pharmacies);
            } else if (activeTab === 'orders') {
                const response = await axios.get('/admin/orders');
                setOrders(response.data.orders);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

    const updatePharmacyStatus = async (pharmacyId, status) => {
        try {
            await axios.put(`/admin/pharmacy/${pharmacyId}/status`, { status });
            toast.success('Pharmacy status updated successfully');
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'verified': 'bg-green-100 text-green-800',
            'rejected': 'bg-red-100 text-red-800',
            'suspended': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Pharmacy Admin Panel</h1>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex space-x-1 mb-6">
                    <button
                        onClick={() => setActiveTab('pharmacies')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            activeTab === 'pharmacies'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Pharmacies
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            activeTab === 'orders'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            activeTab === 'analytics'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        Analytics
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                ) : (
                    <>
                        {/* Pharmacies Tab */}
                        {activeTab === 'pharmacies' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Registered Pharmacies</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pharmacy
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Owner
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Registered
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pharmacies.map(pharmacy => (
                                                <tr key={pharmacy._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {pharmacy.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {pharmacy.licenseNumber}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{pharmacy.owner}</div>
                                                        <div className="text-sm text-gray-500">{pharmacy.contactInfo.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {pharmacy.address.city}, {pharmacy.address.state}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pharmacy.verificationStatus)}`}>
                                                            {pharmacy.verificationStatus}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(pharmacy.createdAt)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPharmacy(pharmacy);
                                                                setShowModal(true);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                                        >
                                                            View
                                                        </button>
                                                        {pharmacy.verificationStatus === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => updatePharmacyStatus(pharmacy._id, 'verified')}
                                                                    className="text-green-600 hover:text-green-900 mr-3"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => updatePharmacyStatus(pharmacy._id, 'rejected')}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Order #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pharmacy
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Customer
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {orders.map(order => (
                                                <tr key={order._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        #{order.orderNumber}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {order.pharmacyId.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {order.userId.name}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        ₹{order.totalAmount}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(order.createdAt)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Analytics Tab */}
                        {activeTab === 'analytics' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">Total Pharmacies</div>
                                    <div className="text-2xl font-bold text-gray-900">{pharmacies.length}</div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">Verified Pharmacies</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {pharmacies.filter(p => p.verificationStatus === 'verified').length}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">Pending Approvals</div>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {pharmacies.filter(p => p.verificationStatus === 'pending').length}
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <div className="text-sm font-medium text-gray-500">Total Orders</div>
                                    <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Pharmacy Details Modal */}
            {showModal && selectedPharmacy && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Pharmacy Details</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Pharmacy Name</h3>
                                    <p className="mt-1 text-sm text-gray-900">{selectedPharmacy.name}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Owner</h3>
                                    <p className="mt-1 text-sm text-gray-900">{selectedPharmacy.owner}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">License Number</h3>
                                    <p className="mt-1 text-sm text-gray-900">{selectedPharmacy.licenseNumber}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                    <p className="mt-1 text-sm text-gray-900">{selectedPharmacy.contactInfo.phone}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                    <p className="mt-1 text-sm text-gray-900">{selectedPharmacy.contactInfo.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                    <span className={`mt-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedPharmacy.verificationStatus)}`}>
                                        {selectedPharmacy.verificationStatus}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                <p className="mt-1 text-sm text-gray-900">
                                    {selectedPharmacy.address.street}<br />
                                    {selectedPharmacy.address.city}, {selectedPharmacy.address.state}<br />
                                    {selectedPharmacy.address.pincode}
                                </p>
                            </div>

                            {selectedPharmacy.description && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                    <p className="mt-1 text-sm text-gray-900">{selectedPharmacy.description}</p>
                                </div>
                            )}

                            {selectedPharmacy.verificationStatus === 'pending' && (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => {
                                            updatePharmacyStatus(selectedPharmacy._id, 'verified');
                                            setShowModal(false);
                                        }}
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            updatePharmacyStatus(selectedPharmacy._id, 'rejected');
                                            setShowModal(false);
                                        }}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PharmacyAdminPanel;
