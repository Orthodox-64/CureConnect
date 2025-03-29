import React, { useEffect, useState } from 'react'
import { Mail, Stethoscope, Calendar, Phone, MapPin, Clock, Award, Edit, Briefcase, UserCircle, Calendar as CalendarIcon, Clock as ClockIcon, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getMedicalHistory } from '../../actions/userActions';

// Default profile images
import doctorDefaultImage from '../../assets/doctor-default.png';
import patientDefaultImage from '../../assets/patient-default.png';
import MedicalHistoryModal from '../Appointment/MedicalHistoryModal';

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const [activeTab, setActiveTab] = useState('profile');
    const [defaultImage, setDefaultImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('/login')
        }

        // Set default image based on user role
        if (user?.role === 'doctor') {
            setDefaultImage(doctorDefaultImage);
        } else {
            setDefaultImage(patientDefaultImage);
        }
    }, [navigate, isAuthenticated, user])

    const handleViewMedicalHistory = async (userId) => {
        setIsLoadingHistory(true);
        setHistoryError(null);
        try {
            const response = await dispatch(getMedicalHistory(userId));
            setSelectedPatientHistory(response);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch medical history:', error);
            setHistoryError(error.response?.data?.message || 'Failed to fetch medical history');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // Handle image loading errors
    const handleImageError = (e) => {
        if (user?.role === 'doctor') {
            e.target.src = doctorDefaultImage;
        } else {
            e.target.src = patientDefaultImage;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-600">No user data available</div>
            </div>
        );
    }

    // Generate initials for avatar fallback
    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Profile Header with Cover and Avatar */}
                    <div className="relative">
                        {/* Cover Image */}
                        <div className={`h-60 bg-gradient-to-r ${user?.role === 'doctor' ? 'from-blue-700 to-indigo-800' : 'from-blue-600 to-indigo-700'}`}>
                            {/* Optional: Add profession-specific decorative elements */}
                            {user?.role === 'doctor' && (
                                <div className="absolute inset-0 opacity-10">
                                    <div className="w-full h-full" style={{
                                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                                        backgroundSize: '30px 30px'
                                    }}></div>
                                </div>
                            )}
                        </div>

                        {/* Profile Info Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>

                        {/* Profile Picture */}
                        <div className="absolute -bottom-16 left-8">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                    onError={handleImageError}
                                />
                            ) : defaultImage ? (
                                <img
                                    src={defaultImage}
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        // Fallback to initials if default image fails
                                        e.target.style.display = 'none';
                                        document.getElementById('initials-fallback').style.display = 'flex';
                                    }}
                                />
                            ) : (
                                <div
                                    id="initials-fallback"
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center"
                                >
                                    <span className="text-white text-3xl font-bold">{getInitials(user.name)}</span>
                                </div>
                            )}
                        </div>

                        {/* Role Badge */}
                        <div className="absolute -bottom-6 left-36">
                            <div className={`rounded-full p-2 ${user?.role === 'doctor' ? 'bg-blue-600' : 'bg-indigo-500'} shadow-md`}>
                                {user?.role === 'doctor' ? (
                                    <Stethoscope className="w-5 h-5 text-white" />
                                ) : (
                                    <UserCircle className="w-5 h-5 text-white" />
                                )}
                            </div>
                        </div>

                        {/* Name and Role */}
                        <div className="absolute bottom-4 left-48 text-white">
                            <h1 className="text-3xl font-bold">{user?.name || 'User'}</h1>
                            <div className="flex items-center mt-1">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                                    {user?.role === 'doctor' ? 'Healthcare Professional' : 'Patient'}
                                </span>
                                {user?.role === 'doctor' && user?.speciality && (
                                    <span className="ml-2 px-3 py-1 bg-indigo-500/70 backdrop-blur-sm rounded-full text-sm font-medium">
                                        {user.speciality}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Edit Profile Button */}
                        <button className="absolute top-4 right-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full px-4 py-2 flex items-center gap-2 transition-all duration-200">
                            <Edit size={16} />
                            <span>Edit Profile</span>
                        </button>
                    </div>

                    {/* Tab Navigation - with spacing to avoid avatar overlay */}
                    <div className="mt-20 px-8 border-b">
                        <nav className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'profile'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'activity'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Activity
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'settings'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Settings
                            </button>
                        </nav>
                    </div>

                    {/* Profile Content */}
                    {activeTab === 'profile' && (
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Left Column - Basic Information */}
                                <div>
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                            <UserCircle className="w-5 h-5 mr-2 text-blue-600" />
                                            Personal Information
                                        </h2>

                                        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                                            {/* Email */}
                                            <div className="mb-6">
                                                <div className="flex items-start">
                                                    <Mail className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Email Address</p>
                                                        <p className="text-gray-800 font-medium">{user?.contact || 'No email provided'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Phone */}
                                            <div className="mb-6">
                                                <div className="flex items-start">
                                                    <Phone className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                                        <p className="text-gray-800 font-medium">{user?.contact || "Not provided"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Location - placeholder since we don't have this data */}
                                            <div>
                                                <div className="flex items-start">
                                                    <MapPin className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                                    <div>
                                                        <p className="text-sm text-gray-500 mb-1">Location</p>
                                                        <p className="text-gray-800 font-medium">Not provided</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Account Information */}
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                            <Shield className="w-5 h-5 mr-2 text-blue-600" />
                                            Account Information
                                        </h2>

                                        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                        <Shield className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Account Status</p>
                                                        <p className="text-sm text-gray-500">Your account is active</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                                    Active
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Member since {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Professional Information (Doctor Only) */}
                                <div>
                                    {user?.role === 'doctor' ? (
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                                <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                                                Professional Information
                                            </h2>

                                            <div className="bg-gray-50 rounded-xl p-6 shadow-sm mb-8">
                                                {/* Specialty */}
                                                <div className="mb-6">
                                                    <div className="flex items-start">
                                                        <Stethoscope className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Specialty</p>
                                                            <p className="text-gray-800 font-medium">{user?.speciality || 'Not specified'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Education */}
                                                <div className="mb-6">
                                                    <div className="flex items-start">
                                                        <Award className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Education</p>
                                                            <p className="text-gray-800 font-medium">MBBS</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Availability */}
                                                <div>
                                                    <div className="flex items-start">
                                                        <Calendar className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                                                        <div>
                                                            <p className="text-sm text-gray-500 mb-1">Availability Status</p>
                                                            <div className={`px-3 py-1 rounded-full text-sm inline-block ${user.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                {user.availability ? 'Available for Appointments' : 'Not Available'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Schedule Information - Placeholder as we don't have this data */}
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                                    <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                                                    Schedule Information
                                                </h2>

                                                <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                                <ClockIcon className="w-5 h-5 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">Office Hours</p>
                                                                <p className="text-sm text-gray-500">Your regular consultation hours</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Monday - Friday</span>
                                                            <span className="font-medium">9:00 AM - 5:00 PM</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Saturday</span>
                                                            <span className="font-medium">10:00 AM - 2:00 PM</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-gray-500">Sunday</span>
                                                            <span className="font-medium">Closed</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                                <CalendarIcon className="w-5 h-5 mr-2 text-blue-600" />
                                                Medical Records
                                            </h2>

                                            <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500 mb-4">No medical records available at this time.</p>
                                                    <button
                                                        onClick={() => handleViewMedicalHistory(user._id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                        View Medical History
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Activity Tab - Placeholder content */}
                    {activeTab === 'activity' && (
                        <div className="p-8">
                            <div className="text-center py-12">
                                <h2 className="text-xl font-semibold text-gray-600 mb-2">Activity History</h2>
                                <p className="text-gray-500">Your recent activities will appear here</p>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab - Placeholder content */}
                    {activeTab === 'settings' && (
                        <div className="p-8">
                            <div className="text-center py-12">
                                <h2 className="text-xl font-semibold text-gray-600 mb-2">Account Settings</h2>
                                <p className="text-gray-500">Account settings will appear here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <MedicalHistoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedPatientHistory(null);
                    setHistoryError(null);
                }}
                medicalHistory={selectedPatientHistory}
                isLoading={isLoadingHistory}
                error={historyError}
            />
        </div>
    );
}

export default Profile      