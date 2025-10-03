import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Plus, Clock, User, Stethoscope, Filter, Search } from 'lucide-react';
import { myAppointments, clearErrors } from '../actions/appointmentActions';
import { toast } from 'react-toastify';
import AppointmentCard from '../components/AppointmentCard';
import AppointmentBooking from '../components/AppointmentBooking';
import LoadingSpinner from '../components/LoadingSpinner';

const Appointments = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.user);
    const { appointments, loading } = useSelector(state => state.myAppointment || { appointments: [], loading: false });
    const { error, appointment } = useSelector(state => state.newAppointment);

    // Debug: Log appointment data
    console.log('Appointments state:', { appointments, loading, error });

    const [showBookingModal, setShowBookingModal] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            console.log('Fetching appointments for user:', user);
            dispatch(myAppointments());
        }
    }, [dispatch, isAuthenticated, user]);

    useEffect(() => {
        if (error) {
            console.error('Appointment error:', error);
        }
    }, [error]);

    // Refresh appointments when a new appointment is created
    useEffect(() => {
        if (appointment) {
            toast.success('Appointment booked successfully! Check your email for details.');
            dispatch(myAppointments());
        }
    }, [appointment, dispatch]);

    const filteredAppointments = appointments?.filter(appointment => {
        const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
        const matchesSearch = searchTerm === '' || 
            appointment.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.symptoms?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesSearch;
    }) || [];

    const upcomingAppointments = filteredAppointments.filter(appointment => {
        const appointmentDate = new Date(`${appointment.day}T${appointment.time}`);
        return appointmentDate > new Date() && appointment.status !== 'cancelled';
    });

    const pastAppointments = filteredAppointments.filter(appointment => {
        const appointmentDate = new Date(`${appointment.day}T${appointment.time}`);
        return appointmentDate <= new Date() || appointment.status === 'cancelled';
    });

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-blue-600 rounded-xl">
                                <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    {user?.role === 'doctor' ? 'Patient Appointments' : 'My Appointments'}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {user?.role === 'doctor' 
                                        ? 'Manage your patient appointments and consultations'
                                        : 'Schedule and manage your medical appointments'
                                    }
                                </p>
                            </div>
                        </div>
                        
                        {user?.role === 'patient' && (
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Book Appointment</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                                <p className="text-2xl font-bold text-gray-900">{appointments?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Clock className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <User className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {filteredAppointments.filter(apt => apt.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Stethoscope className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {filteredAppointments.filter(apt => apt.status === 'confirmed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search appointments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        {/* Status Filter */}
                        <div className="flex items-center space-x-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Appointments Found</h3>
                        <p className="text-gray-500 mb-6">
                            {user?.role === 'doctor' 
                                ? 'No patient appointments scheduled yet.'
                                : 'You don\'t have any appointments yet.'
                            }
                        </p>
                        {user?.role === 'patient' && (
                            <button
                                onClick={() => setShowBookingModal(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Book Your First Appointment
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Upcoming Appointments */}
                        {upcomingAppointments.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {upcomingAppointments.map(appointment => (
                                        <AppointmentCard
                                            key={appointment._id}
                                            appointment={appointment}
                                            userRole={user?.role}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Past Appointments */}
                        {pastAppointments.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Appointments</h2>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {pastAppointments.map(appointment => (
                                        <AppointmentCard
                                            key={appointment._id}
                                            appointment={appointment}
                                            userRole={user?.role}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Booking Modal */}
                {showBookingModal && (
                    <AppointmentBooking onClose={() => setShowBookingModal(false)} />
                )}
            </div>
        </div>
    );
};

export default Appointments;
