import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ShoppingCart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        const savedCart = localStorage.getItem('medicineCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
        setLoading(false);
    };

    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('medicineCart', JSON.stringify(newCart));
    };

    const updateQuantity = (medicineId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(medicineId);
            return;
        }

        const item = cart.find(item => item.medicine._id === medicineId);
        if (item && newQuantity > item.medicine.stock) {
            toast.error('Insufficient stock');
            return;
        }

        const newCart = cart.map(item =>
            item.medicine._id === medicineId
                ? { ...item, quantity: newQuantity }
                : item
        );
        saveCart(newCart);
    };

    const removeFromCart = (medicineId) => {
        const newCart = cart.filter(item => item.medicine._id !== medicineId);
        saveCart(newCart);
        toast.success('Item removed from cart');
    };

    const clearCart = () => {
        saveCart([]);
        toast.success('Cart cleared');
    };

    const getTotalItems = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    const getSubtotal = () => {
        return cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
    };

    const getTotalMRP = () => {
        return cart.reduce((total, item) => total + (item.medicine.mrp * item.quantity), 0);
    };

    const getTotalSavings = () => {
        return getTotalMRP() - getSubtotal();
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

    const CartItem = ({ item }) => {
        const discountPercentage = Math.round(((item.medicine.mrp - item.medicine.price) / item.medicine.mrp) * 100);

        return (
            <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                    src={item.medicine.images?.[0]?.url || '/medicine-placeholder.jpg'}
                    alt={item.medicine.name}
                    className="w-16 h-16 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{item.medicine.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.medicine.manufacturer}</p>
                    <p className="text-sm text-gray-500">{item.medicine.strength} | {item.medicine.packSize}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="text-lg font-semibold text-gray-900">₹{item.medicine.price}</span>
                        {item.medicine.mrp > item.medicine.price && (
                            <>
                                <span className="text-sm text-gray-500 line-through">₹{item.medicine.mrp}</span>
                                <span className="text-sm text-green-600 font-medium">{discountPercentage}% off</span>
                            </>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                            onClick={() => updateQuantity(item.medicine._id, item.quantity - 1)}
                            className="px-3 py-2 hover:bg-gray-50"
                        >
                            -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.medicine._id, item.quantity + 1)}
                            className="px-3 py-2 hover:bg-gray-50"
                        >
                            +
                        </button>
                    </div>
                    
                    <button
                        onClick={() => removeFromCart(item.medicine._id)}
                        className="text-red-500 hover:text-red-700 p-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                        <button
                            onClick={() => navigate('/medicines')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5m6-10.5a.5.5 0 11-1 0 .5.5 0 011 0zM17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
                        <button
                            onClick={() => navigate('/medicines')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                        >
                            Browse Medicines
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Cart Items ({getTotalItems()})
                                </h2>
                                <button
                                    onClick={clearCart}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    Clear Cart
                                </button>
                            </div>

                            {/* Group by pharmacy */}
                            {Object.values(groupedCart).map(group => (
                                <div key={group.pharmacy._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{group.pharmacy.name}</h3>
                                            <p className="text-sm text-gray-600">{group.pharmacy.address?.city}</p>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {group.items.length} item{group.items.length > 1 ? 's' : ''}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {group.items.map(item => (
                                            <CartItem key={item.medicine._id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Items ({getTotalItems()})</span>
                                        <span className="text-gray-900">₹{getSubtotal()}</span>
                                    </div>
                                    
                                    {getTotalSavings() > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total MRP</span>
                                            <span className="text-gray-500 line-through">₹{getTotalMRP()}</span>
                                        </div>
                                    )}
                                    
                                    {getTotalSavings() > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">You Save</span>
                                            <span className="text-green-600">₹{getTotalSavings()}</span>
                                        </div>
                                    )}
                                    
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery Charges</span>
                                        <span className={getDeliveryCharge() === 0 ? "text-green-600" : "text-gray-900"}>
                                            {getDeliveryCharge() === 0 ? 'FREE' : `₹${getDeliveryCharge()}`}
                                        </span>
                                    </div>
                                    
                                    {getSubtotal() < 500 && (
                                        <div className="text-xs text-gray-500">
                                            Add ₹{500 - getSubtotal()} more for FREE delivery
                                        </div>
                                    )}
                                </div>
                                
                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-gray-900">Total</span>
                                        <span className="text-lg font-semibold text-gray-900">₹{getFinalTotal()}</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium mb-3"
                                >
                                    Proceed to Checkout
                                </button>
                                
                                <div className="text-xs text-gray-500 text-center">
                                    By placing this order, you agree to our Terms & Conditions
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;
