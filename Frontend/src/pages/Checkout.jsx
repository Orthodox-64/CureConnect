import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../axios';

const Checkout = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        addressType: 'Home'
    });
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [placedOrders, setPlacedOrders] = useState([]); // capture order numbers

    useEffect(() => {
        const loadCart = () => {
            const savedCart = localStorage.getItem('medicineCart');
            if (savedCart) {
                const cartData = JSON.parse(savedCart);
                if (cartData.length === 0) {
                    navigate('/medicines');
                    return;
                }
                setCart(cartData);
            } else {
                navigate('/medicines');
            }
        };
        
        loadCart();
    }, [navigate]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getSubtotal = () => {
        return cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
    };

    const getDeliveryCharge = () => {
        return getSubtotal() < 500 ? 50 : 0;
    };

    const getFinalTotal = () => {
        return getSubtotal() + getDeliveryCharge();
    };

    // Group cart items by pharmacy
    const groupedCart = cart.reduce((groups, item) => {
        const pharmacyId = item.medicine.pharmacy._id;
        if (!groups[pharmacyId]) {
            groups[pharmacyId] = {
                pharmacy: item.medicine.pharmacy,
                items: []
            };
        }
        groups[pharmacyId].items.push(item);
        return groups;
    }, {});

    const validateForm = () => {
        if (!address.fullName || !address.phone || !address.street || 
            !address.city || !address.state || !address.pincode) {
            toast.error('Please fill all required address fields');
            return false;
        }

        if (!/^\d{10}$/.test(address.phone)) {
            toast.error('Please enter a valid 10-digit phone number');
            return false;
        }

        if (!/^\d{6}$/.test(address.pincode)) {
            toast.error('Please enter a valid 6-digit pincode');
            return false;
        }

        return true;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        
        try {
            // For each pharmacy, place a separate order
            const orderPromises = Object.values(groupedCart).map(async (group) => {
                const orderData = {
                    pharmacyId: group.pharmacy._id,
                    items: group.items.map(item => ({
                        medicine: item.medicine._id,
                        quantity: item.quantity
                    })),
                    shippingAddress: address,
                    paymentInfo: {
                        method: paymentMethod,
                        status: 'pending'
                    },
                    deliveryInfo: {
                        type: 'delivery'
                    },
                    specialInstructions: specialInstructions
                };

                const res = await axios.post('/orders', orderData);
                return res.data.order; // return created order
            });
            const created = await Promise.all(orderPromises);
            setPlacedOrders(created);
            
            // Clear cart
            localStorage.removeItem('medicineCart');
            
            toast.success('Orders placed successfully!');
            // Show a quick confirmation with order numbers, then go to tracking
            setTimeout(() => navigate('/orders'), 1200);
            
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={address.fullName}
                                        onChange={handleAddressChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={address.phone}
                                        onChange={handleAddressChange}
                                        required
                                        pattern="[0-9]{10}"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="10-digit phone number"
                                    />
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Street Address *
                                    </label>
                                    <textarea
                                        name="street"
                                        value={address.street}
                                        onChange={handleAddressChange}
                                        required
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="House/Flat no., Building, Street, Area"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={address.city}
                                        onChange={handleAddressChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter city"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={address.state}
                                        onChange={handleAddressChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter state"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={address.pincode}
                                        onChange={handleAddressChange}
                                        required
                                        pattern="[0-9]{6}"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="6-digit pincode"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Landmark (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={address.landmark}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Nearby landmark"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Address Type
                                    </label>
                                    <select
                                        name="addressType"
                                        value={address.addressType}
                                        onChange={handleAddressChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
                            
                            <div className="space-y-3">
                                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="mr-3"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">Cash on Delivery</div>
                                        <div className="text-sm text-gray-600">Pay when you receive your order</div>
                                    </div>
                                </label>
                                
                                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 opacity-50">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="online"
                                        disabled
                                        className="mr-3"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">Online Payment</div>
                                        <div className="text-sm text-gray-600">Pay online using UPI, Card, or Net Banking (Coming Soon)</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions</h2>
                            <textarea
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Any special instructions for delivery..."
                            />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                            
                            {/* Order Items by Pharmacy */}
                            <div className="space-y-4 mb-6">
                                {Object.values(groupedCart).map(group => (
                                    <div key={group.pharmacy._id} className="border border-gray-200 rounded-lg p-3">
                                        <div className="font-medium text-gray-900 mb-2">{group.pharmacy.name}</div>
                                        <div className="space-y-2">
                                            {group.items.map(item => (
                                                <div key={item.medicine._id} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">
                                                        {item.medicine.name} x {item.quantity}
                                                    </span>
                                                    <span className="text-gray-900">₹{item.medicine.price * item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-gray-900">₹{getSubtotal()}</span>
                                </div>
                                
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery Charges</span>
                                    <span className={getDeliveryCharge() === 0 ? "text-green-600" : "text-gray-900"}>
                                        {getDeliveryCharge() === 0 ? 'FREE' : `₹${getDeliveryCharge()}`}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-lg font-semibold text-gray-900">₹{getFinalTotal()}</span>
                                </div>
                            </div>
                            
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-medium mb-3"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                        Placing Order...
                                    </div>
                                ) : (
                                    'Place Order'
                                )}
                            </button>
                            
                            <div className="text-xs text-gray-500 text-center">
                                By placing this order, you agree to our Terms & Conditions
                            </div>

                            {placedOrders.length > 0 && (
                                <div className="mt-4 p-3 border border-green-200 bg-green-50 rounded-lg text-sm text-green-800">
                                    <div className="font-medium mb-1">Order Numbers</div>
                                    <ul className="list-disc list-inside">
                                        {placedOrders.map(o => (
                                            <li key={o._id}>#{o.orderNumber}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
