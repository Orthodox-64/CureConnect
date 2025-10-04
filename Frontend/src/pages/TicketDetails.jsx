import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { getTicketDetails, clearTicketErrors } from '../actions/ticketActions';
import { 
    ArrowLeft, 
    Calendar, 
    User, 
    Tag, 
    AlertCircle, 
    Clock, 
    CheckCircle, 
    XCircle,
    MessageSquare,
    Mail,
    Phone
} from 'lucide-react';

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const { loading, ticket, error } = useSelector(state => state.ticketDetails);

    useEffect(() => {
        if (id) {
            dispatch(getTicketDetails(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearTicketErrors());
        }
    }, [dispatch, error]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open':
                return <AlertCircle className="w-5 h-5 text-orange-500" />;
            case 'In Progress':
                return <Clock className="w-5 h-5 text-blue-500" />;
            case 'Resolved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Closed':
                return <XCircle className="w-5 h-5 text-gray-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
        switch (status) {
            case 'Open':
                return `${baseClasses} bg-orange-100 text-orange-800`;
            case 'In Progress':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'Resolved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'Closed':
                return `${baseClasses} bg-gray-100 text-gray-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getPriorityBadge = (priority) => {
        const baseClasses = "inline-flex items-center px-2 py-1 rounded text-sm font-medium";
        switch (priority) {
            case 'Critical':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'High':
                return `${baseClasses} bg-orange-100 text-orange-800`;
            case 'Medium':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'Low':
                return `${baseClasses} bg-green-100 text-green-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading ticket details...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!ticket || !ticket._id) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Ticket not found</h3>
                        <p className="text-gray-500 mb-6">The ticket you're looking for doesn't exist or you don't have permission to view it.</p>
                        <button
                            onClick={() => navigate('/my-tickets')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to My Tickets
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/my-tickets')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to My Tickets
                    </button>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
                                <p className="text-blue-600 font-medium">{ticket.ticketId}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={getStatusBadge(ticket.status)}>
                                    {getStatusIcon(ticket.status)}
                                    <span className="ml-2">{ticket.status}</span>
                                </span>
                                <span className={getPriorityBadge(ticket.priority)}>
                                    {ticket.priority}
                                </span>
                            </div>
                        </div>
                        
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{ticket.subject}</h2>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <span className="flex items-center">
                                <Tag className="w-4 h-4 mr-1" />
                                {ticket.category}
                            </span>
                            <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Created {formatDate(ticket.createdAt)}
                            </span>
                            {ticket.assignedTo && (
                                <span className="flex items-center">
                                    <User className="w-4 h-4 mr-1" />
                                    Assigned to {ticket.assignedTo.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        {ticket.adminNotes && ticket.adminNotes.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <MessageSquare className="w-5 h-5 mr-2" />
                                    Admin Notes
                                </h3>
                                <div className="space-y-4">
                                    {ticket.adminNotes.map((note, index) => (
                                        <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                            <p className="text-gray-700 mb-2">{note.note}</p>
                                            <div className="text-sm text-gray-500">
                                                By {note.addedBy?.name || 'Admin'} on {formatDate(note.addedAt)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Timeline */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                    <div>
                                        <p className="font-medium text-gray-900">Created</p>
                                        <p className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</p>
                                    </div>
                                </div>
                                
                                {ticket.status !== 'Open' && (
                                    <div className="flex items-center">
                                        <Clock className="w-5 h-5 text-blue-500 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">In Progress</p>
                                            <p className="text-sm text-gray-500">Status updated</p>
                                        </div>
                                    </div>
                                )}
                                
                                {ticket.resolvedAt && (
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Resolved</p>
                                            <p className="text-sm text-gray-500">{formatDate(ticket.resolvedAt)}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {ticket.closedAt && (
                                    <div className="flex items-center">
                                        <XCircle className="w-5 h-5 text-gray-500 mr-3" />
                                        <div>
                                            <p className="font-medium text-gray-900">Closed</p>
                                            <p className="text-sm text-gray-500">{formatDate(ticket.closedAt)}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                            <div className="space-y-3">
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-4 h-4 mr-3" />
                                    <span className="text-sm">support@cureconnect.com</span>
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-4 h-4 mr-3" />
                                    <span className="text-sm">+1 (555) 123-4567</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    For urgent issues, please call our support hotline directly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
