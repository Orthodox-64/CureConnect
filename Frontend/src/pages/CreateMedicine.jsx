import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addMedicine, quickPharmacySetup } from '../actions/pharmacyActions';
import axios from '../axios';

const CreateMedicine = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { loading, error, success } = useSelector(state => state.medicineOperation || {});
    const [pharmacyLoading, setPharmacyLoading] = useState(true);
    const [showQuickSetup, setShowQuickSetup] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        genericName: '',
        manufacturer: '',
        category: '',
        strength: '',
        formType: '',
        packSize: '',
        mrp: '',
        price: '',
        stock: '',
        minStock: '',
        expiryDate: '',
        batchNumber: '',
        description: '',
        prescriptionRequired: false,
        composition: '',
        sideEffects: '',
        uses: '',
    });

    const [images, setImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);

    // Check if user has a pharmacy registered
    useEffect(() => {
        const checkPharmacy = async () => {
            try {
                await axios.get('/pharmacy/my');
                setPharmacyLoading(false);
            } catch (error) {
                if (error.response?.status === 404) {
                    setShowQuickSetup(true);
                    setPharmacyLoading(false);
                } else {
                    toast.error('Error checking pharmacy status');
                    setPharmacyLoading(false);
                }
            }
        };

        if (user?.role === 'pharmacist') {
            checkPharmacy();
        }
    }, [user, navigate]);

    // Handle quick pharmacy setup
    const handleQuickSetup = async () => {
        try {
            await dispatch(quickPharmacySetup());
            toast.success('Test pharmacy created successfully!');
            setShowQuickSetup(false);
            // Refresh the page to load with pharmacy
            window.location.reload();
        } catch (err) {
            console.error('Quick setup error:', err);
            toast.error('Failed to create test pharmacy');
        }
    };

    // Handle useEffect for success/error
    useEffect(() => {
        console.log('CreateMedicine component mounted');
        console.log('User role:', user?.role);
        
        if (error) {
            toast.error(error);
        }

        if (success) {
            toast.success('Medicine added successfully!');
            navigate('/pharmacist/dashboard');
        }
    }, [error, success, navigate, user]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData({
            ...formData,
            [name]: checked
        });
    };

    // Handle image changes
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 5) {
            toast.error('You can upload maximum 5 images');
            return;
        }

        setImages(files);

        // Create image previews
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    // Remove image
    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        const newPreviews = previewImages.filter((_, i) => i !== index);
        setImages(newImages);
        setPreviewImages(newPreviews);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submission started');
        console.log('Form data:', formData);

        // Basic validation
        if (!formData.name || !formData.category || !formData.price || !formData.stock || !formData.mrp || !formData.manufacturer || !formData.strength || !formData.formType || !formData.composition || !formData.packSize || !formData.expiryDate || !formData.batchNumber) {
            toast.error('Please complete all required fields');
            return;
        }

        // Validate price and stock
        if (parseFloat(formData.price) <= 0 || parseInt(formData.stock) < 0) {
            toast.error('Please enter valid price and stock values');
            return;
        }

        // Validate MRP vs Price
    if (formData.mrp && parseFloat(formData.mrp) < parseFloat(formData.price)) {
            toast.error('MRP cannot be less than selling price');
            return;
        }

        // Create FormData for file upload
        const submitData = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });

        // Append images
        images.forEach((image) => {
            submitData.append('images', image);
        });

        console.log('Dispatching addMedicine action');
        dispatch(addMedicine(submitData));
    };

    if (showQuickSetup) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full mx-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Pharmacy Setup Required</h2>
                    <p className="text-gray-600 mb-6">
                        You need to register your pharmacy before you can add medicines. 
                        You can either register properly or create a quick test pharmacy for development.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={handleQuickSetup}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Quick Setup (Test Pharmacy)
                        </button>
                        <button
                            onClick={() => navigate('/pharmacy/register')}
                            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Full Pharmacy Registration
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (pharmacyLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/pharmacist/dashboard')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Add New Medicine</h1>
                    <p className="text-gray-600 mt-2">Fill in the details to add a new medicine to your inventory</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Medicine Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter medicine name"
                                />
                            </div>

                <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                    <option value="">Select a category</option>
                    <option value="Pain Relief">Pain Relief</option>
                    <option value="Antibiotics">Antibiotics</option>
                    <option value="Vitamins & Supplements">Vitamins & Supplements</option>
                    <option value="Cold & Flu">Cold & Flu</option>
                    <option value="Digestive Health">Digestive Health</option>
                    <option value="Heart & Blood Pressure">Heart & Blood Pressure</option>
                    <option value="Diabetes">Diabetes</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Eye Care">Eye Care</option>
                    <option value="Women Health">Women Health</option>
                    <option value="Men Health">Men Health</option>
                    <option value="Child Care">Child Care</option>
                    <option value="First Aid">First Aid</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selling Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Selling price"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Available stock"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Generic Name
                                </label>
                                <input
                                    type="text"
                                    name="genericName"
                                    value={formData.genericName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter generic name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manufacturer *
                                </label>
                                <input
                                    type="text"
                                    name="manufacturer"
                                    value={formData.manufacturer}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter manufacturer name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Strength *
                                </label>
                                <input
                                    type="text"
                                    name="strength"
                                    value={formData.strength}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., 500mg, 10ml"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Form Type *
                                </label>
                                <select
                                    name="formType"
                                    value={formData.formType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select form type</option>
                                    <option value="Tablet">Tablet</option>
                                    <option value="Capsule">Capsule</option>
                                    <option value="Syrup">Syrup</option>
                                    <option value="Injection">Injection</option>
                                    <option value="Drops">Drops</option>
                                    <option value="Cream">Cream</option>
                                    <option value="Ointment">Ointment</option>
                                    <option value="Gel">Gel</option>
                                    <option value="Powder">Powder</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Composition *
                                </label>
                                <input
                                    type="text"
                                    name="composition"
                                    value={formData.composition}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Paracetamol 500mg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pack Size *
                                </label>
                                <input
                                    type="text"
                                    name="packSize"
                                    value={formData.packSize}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Strip of 10 tablets"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date *
                                </label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Batch Number *
                                </label>
                                <input
                                    type="text"
                                    name="batchNumber"
                                    value={formData.batchNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter batch number"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="prescriptionRequired"
                                    name="prescriptionRequired"
                                    checked={formData.prescriptionRequired}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="prescriptionRequired" className="ml-2 block text-sm text-gray-900">
                                    Prescription Required
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Brief description of the medicine"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    MRP (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="mrp"
                                        value={formData.mrp}
                                        onChange={handleInputChange}
                    required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Maximum Retail Price"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stock
                                    </label>
                                    <input
                                        type="number"
                    name="minStock"
                    value={formData.minStock}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Alert level"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Images (Maximum 5 images)
                            </label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {previewImages.length > 0 && (
                            <div className="mt-4">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {previewImages.map((preview, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/pharmacist/dashboard')}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding Medicine...' : 'Add Medicine'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMedicine;
