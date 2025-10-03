import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../axios';

const OrderTracking = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const response = await axios.get('/orders/my');
                setOrders(response.data.orders);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load orders');
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-purple-100 text-purple-800',
            ready: 'bg-indigo-100 text-indigo-800',
            dispatched: 'bg-orange-100 text-orange-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusText = (status) => {
        const statusMap = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            preparing: 'Preparing',
            ready: 'Ready for Pickup',
            dispatched: 'Dispatched',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };
        return statusMap[status] || status;
    };

    const getProgressPercentage = (status) => {
        const statusProgress = {
            'pending': 10,
            'confirmed': 25,
            'preparing': 50,
            'ready': 75,
            'out_for_delivery': 90,
            'delivered': 100,
            'cancelled': 0
        };
        return statusProgress[status] || 0;
    };

    const viewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Loading orders...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                        <Link
                            to="/medicines"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                        <Link
                            to="/medicines"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            Browse Medicines
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200">
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Order #{order.orderNumber}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Placed on {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                                            {getStatusText(order.orderStatus)}
                                        </span>
                                    </div>

                                    {/* Progress Bar */}
                                    {order.orderStatus !== 'cancelled' && (
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-600 mb-2">
                                                <span>Order Progress</span>
                                                <span>{getProgressPercentage(order.orderStatus)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${getProgressPercentage(order.orderStatus)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Pharmacy:</span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                {order.pharmacy?.name}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Total Amount:</span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                ₹{order.pricing?.totalPrice}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Payment:</span>
                                            <span className="ml-2 font-medium text-gray-900">
                                                {order.paymentInfo.method === 'cod' ? 'Cash on Delivery' : 'Online'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium text-gray-900">
                                            Items ({order.items.length})
                                        </h4>
                                        <button
                                            onClick={() => viewOrderDetails(order)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {order.items.slice(0, 3).map(item => (
                                            <div key={item._id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                                                <img
                                                    src={item.medicine?.images?.[0]?.url || '/placeholder-medicine.png'}
                                                    alt={item.medicine?.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.medicine?.name}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        Qty: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="flex items-center justify-center p-3 border border-gray-200 rounded-lg bg-gray-50">
                                                <span className="text-sm text-gray-600">
                                                    +{order.items.length - 3} more items
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Order Actions */}
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="text-sm text-gray-600">
                                            {order.orderStatus === 'delivered' && order.deliveredAt && (
                                                <span>Delivered on {formatDate(order.deliveredAt)}</span>
                                            )}
                                            {order.status === 'out_for_delivery' && (
                                                <span>Expected delivery today</span>
                                            )}
                                        </div>
                                        <div className="flex space-x-3">
                                            {order.orderStatus === 'delivered' && (
                                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                                    Reorder
                                                </button>
                                            )}
                                            {(['pending', 'confirmed'].includes(order.orderStatus)) && (
                                                <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Order Details
                                </h2>
                                <button
                                    onClick={() => setShowOrderDetails(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Order Info */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Order Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Order Number:</span>
                                            <span className="ml-2 font-medium">{selectedOrder.orderNumber}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.orderStatus)}`}>
                                                {getStatusText(selectedOrder.orderStatus)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Order Date:</span>
                                            <span className="ml-2 font-medium">{formatDate(selectedOrder.createdAt)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Payment Method:</span>
                                            <span className="ml-2 font-medium">
                                                {selectedOrder.paymentInfo.method === 'cod' ? 'Cash on Delivery' : 'Online'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Items */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Order Items</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map(item => (
                                            <div key={item._id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                                                <img
                                                    src={item.medicine?.images?.[0]?.url || '/placeholder-medicine.png'}
                                                    alt={item.medicine?.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.medicine?.name}</h4>
                                                    <p className="text-sm text-gray-600">{item.medicine?.manufacturer}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Quantity: {item.quantity} × ₹{item.price}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-medium text-gray-900">
                                                        ₹{item.quantity * item.price}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Delivery Address</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg text-sm">
                                        <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.fullName}</p>
                                        <p className="text-gray-600">{selectedOrder.shippingAddress.phone}</p>
                                        <p className="text-gray-600 mt-1">
                                            {selectedOrder.shippingAddress.street}<br />
                                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                                            {selectedOrder.shippingAddress.pincode}
                                        </p>
                                        {selectedOrder.shippingAddress.landmark && (
                                            <p className="text-gray-600">
                                                Landmark: {selectedOrder.shippingAddress.landmark}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="text-gray-900">₹{selectedOrder.pricing?.itemsPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery Charges:</span>
                                            <span className="text-gray-900">₹{selectedOrder.pricing?.deliveryCharge}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2 flex justify-between font-medium">
                                            <span className="text-gray-900">Total:</span>
                                            <span className="text-gray-900">₹{selectedOrder.pricing?.totalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderTracking;
