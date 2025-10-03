import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, MessageSquare, AlertCircle, ChevronDown, ChevronUp, Brain, Mail, Phone, FileText, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { markAppointmentComplete } from '../actions/appointmentActions';

const AppointmentCard = ({ appointment, userRole }) => {
    const [showAISuggestions, setShowAISuggestions] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading: completeLoading, success: completeSuccess, error: completeError } = useSelector(state => state.appointmentComplete);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleJoinCall = () => {
        if (appointment.roomId) {
            window.open(`https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${appointment.roomId}`, '_blank');
        }
    };

    const handleMarkComplete = async () => {
        try {
            await dispatch(markAppointmentComplete(appointment._id));
            // Show success message
            alert('Appointment marked as completed successfully!');
        } catch (error) {
            // Show error message
            alert('Failed to mark appointment as complete. Please try again.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {userRole === 'doctor' ? 'Patient Appointment' : 'Your Appointment'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {formatDate(appointment.day)} at {formatTime(appointment.time)}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-2">
                                <Stethoscope className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    {userRole === 'doctor' ? 'Patient' : 'Doctor'}: {appointment.doctor?.name || appointment.patient?.name}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Speciality:</span>
                                <span className="text-sm font-medium text-blue-600">
                                    {appointment.doctor?.speciality}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                        </span>
                        {appointment.roomId && (
                            <button
                                onClick={handleJoinCall}
                                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Join Call
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Description */}
                <div className="mb-4">
                    <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-gray-400 mt-1" />
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Description</h4>
                            <p className="text-sm text-gray-600">{appointment.description}</p>
                        </div>
                    </div>
                </div>

                {/* Symptoms */}
                <div className="mb-4">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-orange-400 mt-1" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Symptoms</h4>
                            <p className="text-sm text-gray-600">{appointment.symptoms}</p>
                        </div>
                    </div>
                </div>

                {/* AI Suggestions - Note: AI suggestions are now generated client-side */}
                {false && appointment.aiSuggestions && (
                    <div className="mb-4">
                        <button
                            onClick={() => setShowAISuggestions(!showAISuggestions)}
                            className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <Brain className="w-4 h-4" />
                            <span>AI Health Suggestions</span>
                            {showAISuggestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {showAISuggestions && (
                            <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                                <div className="prose prose-sm max-w-none prose-blue">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ children }) => <h1 className="text-lg font-semibold text-blue-800 mb-2">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-base font-semibold text-blue-800 mb-2">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-sm font-semibold text-blue-800 mb-1">{children}</h3>,
                                            p: ({ children }) => <p className="text-blue-700 mb-2 leading-relaxed">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc list-inside text-blue-700 mb-2 space-y-1">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal list-inside text-blue-700 mb-2 space-y-1">{children}</ol>,
                                            li: ({ children }) => <li className="text-blue-700">{children}</li>,
                                            strong: ({ children }) => <strong className="font-semibold text-blue-800">{children}</strong>,
                                            em: ({ children }) => <em className="italic text-blue-600">{children}</em>,
                                            code: ({ children }) => <code className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">{children}</code>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-blue-600 my-2">{children}</blockquote>
                                        }}
                                    >
                                        {appointment.aiSuggestions}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Contact Information (for doctors) */}
                {userRole === 'doctor' && appointment.patient && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Patient Contact</h4>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">{appointment.patient.contact}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Details Toggle */}
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <span>{showDetails ? 'Hide' : 'Show'} Details</span>
                    {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Additional Details */}
                {showDetails && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Appointment ID:</span>
                                <span className="ml-2 font-mono text-gray-700">{appointment._id}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Room ID:</span>
                                <span className="ml-2 font-mono text-gray-700">{appointment.roomId}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Created:</span>
                                <span className="ml-2 text-gray-700">
                                    {new Date(appointment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500">Status:</span>
                                <span className="ml-2 text-gray-700 capitalize">{appointment.status}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-3">
                        {appointment.roomId && (
                            <button
                                onClick={handleJoinCall}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Join Call</span>
                            </button>
                        )}
                        
                        {userRole === 'doctor' && (
                            <>
                                <button
                                    onClick={() => navigate('/prescriptions', { state: { appointmentId: appointment._id, patientId: appointment.patient?._id, patientName: appointment.patient?.name } })}
                                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                    <FileText className="w-4 h-4" />
                                    <span>Create Prescription</span>
                                </button>
                                
                                {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                                    <button
                                        onClick={handleMarkComplete}
                                        disabled={completeLoading}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:bg-blue-400 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>{completeLoading ? 'Completing...' : 'Mark Complete'}</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentCard;
