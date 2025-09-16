import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../axios';

const MedicineCatalog = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [medicines, setMedicines] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]);
    
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || 'all',
        sortBy: searchParams.get('sortBy') || 'name',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        prescriptionRequired: searchParams.get('prescriptionRequired') || '',
        city: searchParams.get('city') || ''
    });

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        total: 0
    });

    useEffect(() => {
        fetchCategories();
        fetchMedicines();
        loadCart();
    }, []);

    useEffect(() => {
        fetchMedicines();
    }, [filters, pagination.page]);

    const loadCart = () => {
        const savedCart = localStorage.getItem('medicineCart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    };

    const saveCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('medicineCart', JSON.stringify(newCart));
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/medicines/categories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchMedicines = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== 'all') {
                    params.append(key, value);
                }
            });
            
            params.append('page', pagination.page);
            params.append('limit', 20);

            const response = await axios.get(`/medicines?${params}`);
            setMedicines(response.data.medicines);
            setPagination({
                ...pagination,
                totalPages: response.data.pagination.pages,
                total: response.data.pagination.total
            });
        } catch (error) {
            toast.error('Failed to fetch medicines');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        // Update URL params
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => {
            if (v && v !== 'all') {
                params.set(k, v);
            }
        });
        setSearchParams(params);
        
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const addToCart = (medicine, quantity = 1) => {
        const existingItem = cart.find(item => item.medicine._id === medicine._id);
        
        if (existingItem) {
            if (existingItem.quantity + quantity > medicine.stock) {
                toast.error('Insufficient stock');
                return;
            }
            const newCart = cart.map(item =>
                item.medicine._id === medicine._id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            );
            saveCart(newCart);
        } else {
            if (quantity > medicine.stock) {
                toast.error('Insufficient stock');
                return;
            }
            const newCart = [...cart, { medicine, quantity }];
            saveCart(newCart);
        }
        toast.success('Added to cart');
    };

    const getCartItemCount = (medicineId) => {
        const item = cart.find(item => item.medicine._id === medicineId);
        return item ? item.quantity : 0;
    };

    const MedicineCard = ({ medicine }) => {
        const discountPercentage = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);
        const cartQuantity = getCartItemCount(medicine._id);

        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                    <img
                        src={medicine.images?.[0]?.url || '/medicine-placeholder.jpg'}
                        alt={medicine.name}
                        className="w-full h-48 object-cover rounded-t-xl"
                    />
                    {discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            {discountPercentage}% OFF
                        </div>
                    )}
                    {medicine.prescriptionRequired && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                            Rx
                        </div>
                    )}
                </div>
                
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{medicine.name}</h3>
                    {medicine.genericName && (
                        <p className="text-sm text-gray-600 mb-2">{medicine.genericName}</p>
                    )}
                    <p className="text-xs text-gray-500 mb-2">{medicine.manufacturer}</p>
                    <p className="text-sm text-gray-600 mb-3">{medicine.strength} | {medicine.packSize}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <span className="text-lg font-bold text-gray-900">₹{medicine.price}</span>
                            {medicine.mrp > medicine.price && (
                                <span className="text-sm text-gray-500 line-through ml-2">₹{medicine.mrp}</span>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            Stock: {medicine.stock}
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-xs text-gray-500">
                            {medicine.pharmacy.name}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm text-gray-600">{medicine.rating || 0}</span>
                        </div>
                    </div>
                    
                    <div className="flex space-x-2">
                        {medicine.stock > 0 ? (
                            <>
                                <button
                                    onClick={() => addToCart(medicine)}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-sm"
                                >
                                    Add to Cart
                                    {cartQuantity > 0 && (
                                        <span className="ml-1">({cartQuantity})</span>
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate(`/medicine/${medicine._id}`)}
                                    className="px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <button
                                disabled
                                className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium text-sm cursor-not-allowed"
                            >
                                Out of Stock
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Medicine Store</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/cart')}
                                className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                Cart
                                {cart.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.reduce((sum, item) => sum + item.quantity, 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
                            
                            {/* Search */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                                <input
                                    type="text"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    placeholder="Search medicines..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                <div className="flex space-x-2">
                                    <input
                                        type="number"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        placeholder="Min"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <input
                                        type="number"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        placeholder="Max"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="name">Name A-Z</option>
                                    <option value="price-low">Price Low to High</option>
                                    <option value="price-high">Price High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="newest">Newest First</option>
                                    <option value="popular">Most Popular</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* Results Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="text-sm text-gray-600">
                                Showing {medicines.length} of {pagination.total} medicines
                            </div>
                        </div>

                        {/* Medicine Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse">
                                        <div className="h-48 bg-gray-300 rounded-t-xl"></div>
                                        <div className="p-4">
                                            <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-300 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-300 rounded mb-4"></div>
                                            <div className="h-10 bg-gray-300 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : medicines.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {medicines.map(medicine => (
                                    <MedicineCard key={medicine._id} medicine={medicine} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg mb-4">No medicines found</div>
                                <button
                                    onClick={() => setFilters({
                                        search: '',
                                        category: 'all',
                                        sortBy: 'name',
                                        minPrice: '',
                                        maxPrice: '',
                                        prescriptionRequired: '',
                                        city: ''
                                    })}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                        disabled={pagination.page === 1}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                                        const pageNum = pagination.page - 2 + index;
                                        if (pageNum < 1 || pageNum > pagination.totalPages) return null;
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                                className={`px-4 py-2 rounded-lg ${
                                                    pageNum === pagination.page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                        disabled={pagination.page === pagination.totalPages}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineCatalog;
