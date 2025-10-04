import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, Lock, User, Mail, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from '../axios';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        contact: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/admin/login', formData);
            
            if (response.data.success) {
                // Store admin data in localStorage
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
                
                // Dispatch admin login action
                dispatch({
                    type: 'LOGIN_ADMIN_SUCCESS',
                    payload: response.data.admin
                });

                toast.success('Admin login successful!');
                navigate('/admin/dashboard');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
            console.error('Admin login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-900 flex items-center justify-center px-4 py-8">
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
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4"
                    >
                        <Shield className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Portal</h1>
                    <p className="text-gray-600">Sign in to access admin dashboard</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Email or Phone
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                placeholder="Enter admin email or phone"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                            />
                            {formData.contact.includes('@') ? (
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            ) : (
                                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            )}
                        </div>
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
                                placeholder="Enter admin password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <Shield className="w-4 h-4" />
                                Sign In as Admin
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Links */}
                <div className="mt-8 text-center space-y-3">
                    <p className="text-sm text-gray-600">
                        Need to register as admin?{' '}
                        <Link 
                            to="/admin/register" 
                            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                            Admin Registration
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
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <strong>Security Notice:</strong> This is a restricted admin area. Only authorized personnel should access this portal.
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
