import React, { useState } from 'react';
import {
  Calendar, Clock, User, Stethoscope, MessageSquare, AlertCircle,
  ChevronDown, ChevronUp, Brain, Mail, FileText
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

const AppointmentCard = ({ appointment, userRole }) => {
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

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
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const handleJoinCall = () => {
    if (appointment.roomId) {
      window.open(
        `https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${appointment.roomId}`,
        '_blank'
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl transition-all transform hover:-translate-y-1 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">
            {userRole === 'doctor' ? 'Patient Appointment' : 'Your Appointment'}
          </h3>
          <p className="text-sm opacity-90 mt-1">
            <Calendar className="inline-block w-4 h-4 mr-1" />
            {formatDate(appointment.day)} at {formatTime(appointment.time)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            appointment.status
          )} bg-opacity-80`}
        >
          {appointment.status}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Doctor/Patient Info */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-4 h-4 text-gray-500" />
            <p className="text-sm text-gray-700">
              {userRole === 'doctor' ? 'Patient:' : 'Doctor:'}{' '}
              <span className="font-semibold text-blue-700">
                {appointment.doctor?.name || appointment.patient?.name}
              </span>
            </p>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Speciality:</span>{' '}
            <span className="text-blue-600 font-semibold">
              {appointment.doctor?.speciality}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 rounded-md py-2">
          <div className="flex items-center mb-1">
            <MessageSquare className="w-4 h-4 text-blue-500 mr-1" />
            <h4 className="text-sm font-semibold text-gray-700">Description</h4>
          </div>
          <p className="text-gray-700 text-sm">{appointment.description}</p>
        </div>

        {/* Symptoms */}
        <div className="border-l-4 border-orange-400 pl-4 bg-orange-50 rounded-md py-2">
          <div className="flex items-center mb-1">
            <AlertCircle className="w-4 h-4 text-orange-500 mr-1" />
            <h4 className="text-sm font-semibold text-gray-700">Symptoms</h4>
          </div>
          <p className="text-gray-700 text-sm">{appointment.symptoms}</p>
        </div>

        {/* AI Suggestions */}
        {appointment.aiSuggestions && (
          <div>
            <button
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium text-sm"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Health Suggestions
              {showAISuggestions ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>

            {showAISuggestions && (
              <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  className="prose prose-sm max-w-none text-blue-800"
                >
                  {appointment.aiSuggestions}
                </ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* Contact Info */}
        {userRole === 'doctor' && appointment.patient && (
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Patient Contact
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-500" />
              <span>{appointment.patient.contact}</span>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center text-gray-600 hover:text-gray-900 text-sm font-medium transition"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
            {showDetails ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>

          {showDetails && (
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
              <div>
                <span className="text-gray-500">Appointment ID:</span>{' '}
                <span className="font-mono">{appointment._id}</span>
              </div>
              <div>
                <span className="text-gray-500">Room ID:</span>{' '}
                <span className="font-mono">{appointment.roomId}</span>
              </div>
              <div>
                <span className="text-gray-500">Created:</span>{' '}
                {new Date(appointment.createdAt).toLocaleDateString()}
              </div>
              <div>
                <span className="text-gray-500">Status:</span>{' '}
                <span className="capitalize">{appointment.status}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
          {appointment.roomId && (
            <button
              onClick={handleJoinCall}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Join Call
            </button>
          )}

          {userRole === 'doctor' && (
            <button
              onClick={() =>
                navigate('/prescriptions', {
                  state: {
                    appointmentId: appointment._id,
                    patientId: appointment.patient?._id,
                    patientName: appointment.patient?.name
                  }
                })
              }
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Prescription
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
