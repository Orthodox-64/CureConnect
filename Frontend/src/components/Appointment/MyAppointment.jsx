import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, myAppointments } from '../../actions/appointmentActions';
import { getMedicalHistory } from '../../actions/userActions';
import MedicalHistoryModal from './MedicalHistoryModal';
import {
    Calendar, Clock, MapPin, Users, CalendarCheck, UserPlus, X, Calendar as CalendarIcon,
    Clock as ClockIcon, FileText, User, UserCheck, Video, Filter, ChevronLeft
} from 'lucide-react';

const MyAppointment = () => {
    const dispatch = useDispatch();
    const { loading, error, appointments } = useSelector((state) => state.myAppointment);
    const [filter, setFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatientHistory, setSelectedPatientHistory] = useState(null);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyError, setHistoryError] = useState(null);

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        confirmed: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
        completed: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filteredAppointments = appointments?.filter(appt => {
        const appointmentDate = new Date(appt.day);

        if (filter === 'upcoming') {
            return appointmentDate >= today;
        } else if (filter === 'past') {
            return appointmentDate < today;
        }
        return true;
    });

    useEffect(() => {
        if (error) {
            dispatch(clearErrors());
        }
        dispatch(myAppointments());
    }, [dispatch, error]);

    const handleViewMedicalHistory = async (patientId) => {
        setIsLoadingHistory(true);
        setHistoryError(null);
        try {
            const response = await dispatch(getMedicalHistory(patientId));
            setSelectedPatientHistory(response);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Failed to fetch medical history:', error);
            setHistoryError(error.response?.data?.message || 'Failed to fetch medical history');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-600 font-medium">Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
                <div className="bg-white rounded-xl shadow-xl p-8">
                    {/* Filter tabs */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Your Appointments</h2>
                    </div>

                    {filteredAppointments.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredAppointments.map((appt) => (
                                <div className="bg-white rounded-lg shadow-md p-6 space-y-4" key={appt._id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{appt.doctor.name}</h3>
                                            <p className="text-sm text-gray-600">{appt.doctor.speciality}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[appt.status]}`}>
                                            <a href={`https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${appt.roomId}`}>
                                                {appt.roomId}
                                            </a>
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center text-gray-600">
                                            <CalendarIcon className="h-4 w-4 mr-2" />
                                            <span>{formatDate(appt.day)}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <ClockIcon className="h-4 w-4 mr-2" />
                                            <span>{appt.time}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <User className="h-4 w-4 mr-2" />
                                            <span>{appt.patient.name}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            <span>{appt.patient.contact}</span>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 mt-4">
                                        <div className="flex items-start">
                                            <FileText className="h-4 w-4 mr-2 mt-1 text-gray-500" />
                                            <p className="text-sm text-gray-600">{appt.description}</p>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 mt-4">
                                        Booked on {formatDate(appt.createdAt)}
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={() => handleViewMedicalHistory(appt.patient.id)}
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 
                                                       bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                        >
                                            <FileText className="w-4 h-4 mr-2" />
                                            View Medical History
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No appointments found.</p>
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
};

export default MyAppointment;