import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Lock, User, Mail, Phone, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from '../axios';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        password: '',
        confirmPassword: '',
        adminKey: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showAdminKey, setShowAdminKey] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Check if admin is already logged in
    useEffect(() => {
        const adminUser = localStorage.getItem('adminUser');
        const adminToken = localStorage.getItem('adminToken');
        
        if (adminUser && adminToken) {
            try {
                const parsedAdmin = JSON.parse(adminUser);
                if (parsedAdmin.role === 'admin') {
                    toast.success('You are already logged in as admin');
                    navigate('/admin/dashboard');
                    return;
                }
            } catch (error) {
                console.error('Error parsing admin user data:', error);
                // Clear invalid data
                localStorage.removeItem('adminUser');
                localStorage.removeItem('adminToken');
            }
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        
        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return false;
        }

        if (!formData.adminKey) {
            toast.error('Admin key is required');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);

        try {
            const response = await axios.post('/admin/register', {
                name: formData.name,
                contact: formData.contact,
                password: formData.password,
                adminKey: formData.adminKey
            });
            
            if (response.data.success) {
                // Store admin data in localStorage
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
                
                // Dispatch admin login action
                dispatch({
                    type: 'LOGIN_ADMIN_SUCCESS',
                    payload: response.data.admin
                });

                toast.success('Admin registration successful!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
            console.error('Admin registration error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-emerald-900 flex items-center justify-center px-4 py-8">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4"
                    >
                        <Shield className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Registration</h1>
                    <p className="text-gray-600">Create admin account for CureConnect</p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter admin full name"
                            required
                            minLength={4}
                            maxLength={30}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    {/* Contact Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            {formData.contact.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                            Email or Phone
                        </label>
                        <input
                            type="text"
                            name="contact"
                            value={formData.contact}
                            onChange={handleInputChange}
                            placeholder="Enter admin email or phone"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    {/* Admin Key Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            Admin Secret Key
                        </label>
                        <div className="relative">
                            <input
                                type={showAdminKey ? "text" : "password"}
                                name="adminKey"
                                value={formData.adminKey}
                                onChange={handleInputChange}
                                placeholder="Enter admin secret key"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowAdminKey(!showAdminKey)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showAdminKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">Contact system administrator for the secret key</p>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter secure password"
                                required
                                minLength={8}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Confirm your password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <Shield className="w-4 h-4" />
                                Create Admin Account
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Links */}
                <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-gray-600">
                        Already have an admin account?{' '}
                        <Link 
                            to="/admin/login" 
                            className="text-green-600 hover:text-green-700 font-medium transition-colors"
                        >
                            Sign In
                        </Link>
                    </p>
                    
                    <div className="border-t pt-4">
                        <Link 
                            to="/" 
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            ← Back to main site
                        </Link>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Key className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-800">
                            <strong>Important:</strong> Admin registration requires a secret key. Contact the system administrator to obtain this key before proceeding.
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminRegister;
