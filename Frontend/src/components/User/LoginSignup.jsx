import { Mail, Lock, User, Stethoscope, Calendar, CheckCircle, X } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"
import { login, register, clearErrors } from '../../actions/userActions';

const LoginSignup = () => {
    const dispatch = useDispatch();
    const { error, loading, isAuthenticated } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation();

    const [authMode, setAuthMode] = useState('login');
    const [role, setRole] = useState('patient');
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        password: '',
        speciality: 'general',
        availability: "false"
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (authMode === "login") {
            dispatch(login(formData.contact, formData.password));
        } else {
            dispatch(register(
                formData.contact,
                formData.password,
                formData.name,
                role,
                formData.speciality,
                formData.availability
            ));
        }
    };

    // Add useEffect for handling authentication state
    useEffect(() => {
        if (error) {
            console.error(error);
            dispatch(clearErrors());
        }

        if (isAuthenticated) {
            navigate('/account');
        }
    }, [dispatch, error, isAuthenticated, navigate]);

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
            {/* Dynamic Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-indigo-900 z-0">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Glowing orbs */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-soft-light blur-3xl opacity-60 animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-indigo-500 rounded-full mix-blend-soft-light blur-3xl opacity-50" style={{ animationDelay: '2s', animationDuration: '8s' }}></div>
                    <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-cyan-400 rounded-full mix-blend-soft-light blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>

                    {/* Particle effect - small floating dots */}
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animation: `float ${5 + Math.random() * 10}s linear infinite`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        ></div>
                    ))}

                    {/* Soft grid overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '80px 80px'
                        }}>
                    </div>

                    {/* Abstract wave pattern */}
                    <svg className="absolute bottom-0 left-0 w-full opacity-20" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#0099ff" fillOpacity="1" d="M0,160L48,144C96,128,192,96,288,85.3C384,75,480,85,576,117.3C672,149,768,203,864,202.7C960,203,1056,149,1152,128C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                    <svg className="absolute bottom-0 left-0 w-full opacity-10" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#ffffff" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </div>

            {/* Content area - split card design */}
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-white bg-opacity-10 backdrop-blur-xl border border-white/20">

                    {/* Left Section - Branding & Info */}
                    <div className="lg:w-5/12 relative bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white overflow-hidden">
                        {/* Abstract shapes */}
                        <div className="absolute -right-24 -top-24 w-64 h-64 bg-white opacity-10 rounded-full"></div>
                        <div className="absolute -right-32 -bottom-32 w-80 h-80 bg-white opacity-10 rounded-full"></div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="mb-10">
                                <h1 className="text-4xl font-bold mb-6">Healthcare Portal</h1>
                                <p className="text-blue-100 text-lg">Access your healthcare journey with a secure, personalized experience.</p>
                            </div>

                            <div className="mt-auto space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/10 p-2 rounded-full">
                                        <CheckCircle size={20} className="text-cyan-300" />
                                    </div>
                                    <p>Secure and HIPAA compliant platform</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/10 p-2 rounded-full">
                                        <CheckCircle size={20} className="text-cyan-300" />
                                    </div>
                                    <p>Connect with healthcare professionals</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/10 p-2 rounded-full">
                                        <CheckCircle size={20} className="text-cyan-300" />
                                    </div>
                                    <p>Access your medical records anytime</p>
                                </div>
                            </div>

                            {/* Decorative element */}
                            <div className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2">
                                <svg width="120" height="120" viewBox="0 0 120 120" className="opacity-10">
                                    <path d="M60 0C26.9 0 0 26.9 0 60s26.9 60 60 60 60-26.9 60-60S93.1 0 60 0zm0 110c-27.6 0-50-22.4-50-50s22.4-50 50-50 50 22.4 50 50-22.4 50-50 50z" fill="currentColor" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <div className="lg:w-7/12 p-8 md:p-12">
                        <div className="mb-8 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">
                                {authMode === 'login' ? 'Sign In' : 'Create Account'}
                            </h2>

                            {/* Auth toggle pills */}
                            <div className="inline-flex p-1 bg-blue-700/30 rounded-xl">
                                <button
                                    onClick={() => setAuthMode('login')}
                                    className={`px-4 py-2 text-sm rounded-lg transition-all ${authMode === 'login'
                                        ? 'bg-white text-blue-800 shadow-md'
                                        : 'text-blue-100 hover:text-white'
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setAuthMode('signup')}
                                    className={`px-4 py-2 text-sm rounded-lg transition-all ${authMode === 'signup'
                                        ? 'bg-white text-blue-800 shadow-md'
                                        : 'text-blue-100 hover:text-white'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-900/30 backdrop-blur-sm border border-red-500/50 text-red-100 rounded-xl">
                                <div className="flex items-center">
                                    <div className="p-1 bg-red-500/20 rounded-full mr-3">
                                        <X size={18} className="text-red-300" />
                                    </div>
                                    {error}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {authMode === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium text-blue-100 mb-2">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                            <User className="text-blue-300" size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-blue-300/30 text-black rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-blue-200/50"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <Mail className="text-blue-300" size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        name="contact"
                                        placeholder="you@example.com"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-blue-300/30 text-black rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-blue-200/50"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-blue-100 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                        <Lock className="text-blue-300" size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-blue-300/30 text-black rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-blue-200/50"
                                        required
                                    />
                                </div>
                            </div>

                            {authMode === 'signup' && (
                                <>
                                    <div className="pt-2">
                                        <label className="block text-sm font-medium text-blue-100 mb-3">Select Role</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className={`relative flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all ${role === 'patient'
                                                ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-800/30'
                                                : 'bg-white/10 border-blue-300/30 hover:bg-white/20'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="patient"
                                                    checked={role === 'patient'}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    className="sr-only" // Hide the actual radio button
                                                />
                                                <div className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${role === 'patient' ? 'bg-blue-500' : 'bg-blue-700/50'
                                                    }`}>
                                                    <User size={24} className={role === 'patient' ? 'text-black' : 'text-blue-300'} />
                                                </div>
                                                <span className={`text-center ${role === 'patient' ? 'text-black' : 'text-blue-100'}`}>Patient</span>
                                                {role === 'patient' && (
                                                    <div className="absolute top-2 right-2 bg-blue-500 p-1 rounded-full">
                                                        <CheckCircle size={16} className="text-white" />
                                                    </div>
                                                )}
                                            </label>
                                            <label className={`relative flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all ${role === 'doctor'
                                                ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-800/30'
                                                : 'bg-white/10 border-blue-300/30 hover:bg-white/20'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="doctor"
                                                    checked={role === 'doctor'}
                                                    onChange={(e) => setRole(e.target.value)}
                                                    className="sr-only" // Hide the actual radio button
                                                />
                                                <div className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${role === 'doctor' ? 'bg-blue-500' : 'bg-blue-700/50'
                                                    }`}>
                                                    <Stethoscope size={24} className={role === 'doctor' ? 'text-white' : 'text-blue-300'} />
                                                </div>
                                                <span className={`text-center ${role === 'doctor' ? 'text-white' : 'text-blue-100'}`}>Doctor</span>
                                                {role === 'doctor' && (
                                                    <div className="absolute top-2 right-2 bg-blue-500 p-1 rounded-full">
                                                        <CheckCircle size={16} className="text-white" />
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {role === 'doctor' && (
                                        <div className="space-y-5 mt-4 pt-4 border-t border-blue-500/20">
                                            <div>
                                                <label className="block text-sm font-medium text-blue-100 mb-2">Medical Speciality</label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                                                        <Stethoscope className="text-blue-300" size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="speciality"
                                                        placeholder="e.g. Cardiology, Pediatrics"
                                                        value={formData.speciality}
                                                        onChange={handleInputChange}
                                                        className="w-full pl-12 pr-4 py-4 bg-white/10 border border-blue-300/30 text-black rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all placeholder:text-blue-200/50"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <label className="flex items-center space-x-3 p-4 border border-blue-300/30 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                                                <input
                                                    type="checkbox"
                                                    name="availability"
                                                    checked={formData.availability}
                                                    onChange={handleInputChange}
                                                    className="form-checkbox h-5 w-5 text-blue-600 rounded-md bg-white/20 border-blue-300/50"
                                                />
                                                <span className="text-blue-100">Available for new appointments</span>
                                            </label>
                                        </div>
                                    )}
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full mt-8 py-4 px-6 rounded-xl font-medium text-white shadow-xl transition-all ${loading
                                    ? 'bg-blue-700/50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 cursor-pointer'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    authMode === 'login' ? 'Sign In to Dashboard' : 'Create Your Account'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-blue-500/20 text-center">
                            <p className="text-blue-200">
                                {authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                                <button
                                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                                    className="text-cyan-300 hover:text-cyan-100 font-semibold transition-colors"
                                >
                                    {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                                </button>
                            </p>
                        </div>
                    </div >
                </div >
            </div >

            {/* Style injections for animations */}
            <style jsx > {`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                
                .animate-pulse {
                    animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 0.7; }
                    50% { opacity: 0.3; }
                }
            `}</style >
        </div >
    )
}

export default LoginSignup