import React, { useEffect } from 'react'
import { Mail, Stethoscope, Calendar, Phone, MapPin, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Profile = () => {
    const navigate = useNavigate()
    const { user, loading, isAuthenticated } = useSelector(state => state.user);

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('/login')
        }
    }, [navigate, isAuthenticated])

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-900 to-indigo-600">
                        <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 pt-32 bg-gradient-to-t from-black/50">
                            <h1 className="text-3xl font-bold text-white">{user?.name || 'User'}</h1>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Information */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-800">Basic Information</h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-gray-500 mt-1" />
                                        <div>
                                            <p className="text-gray-800">{user?.contact || 'No email provided'}</p>
                                            <p className="text-sm text-gray-500">Email</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-500 mt-1" />
                                        <div>
                                            <p className="text-gray-800">{user?.contact || "Not provided"}</p>
                                            <p className="text-sm text-gray-500">Phone</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information (Doctor Only) */}
                            {user?.role === 'doctor' && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold text-gray-800">Professional Information</h2>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Stethoscope className="w-5 h-5 text-gray-500 mt-1" />
                                            <div>
                                                <p className="text-gray-800">{user?.speciality || 'Not specified'}</p>
                                                <p className="text-sm text-gray-500">Speciality</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Award className="w-5 h-5 text-gray-500 mt-1" />
                                            <div>
                                                <p className="text-gray-800">{user.role == 'doctor' ? `MBBS` : `Engg`}</p>
                                                <p className="text-sm text-gray-500">Education</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            <div className="flex items-center gap-2">
                                                <div className={`px-3 py-1 rounded-full text-sm ${user.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {user.availability ? 'Available for Appointments' : 'Not Available'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile