import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getUserTickets, clearTicketErrors } from '../actions/ticketActions';
import { 
    Plus, 
    Search, 
    Filter, 
    Eye, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    XCircle,
    Calendar,
    User,
    Tag,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

const MyTickets = () => {
    const dispatch = useDispatch();
    const { loading, tickets, error, totalTickets, currentPage, totalPages } = useSelector(state => state.userTickets);

    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        page: 1,
        limit: 10
    });

    const [showFilters, setShowFilters] = useState(false);

    const statusOptions = [
        { value: 'all', label: 'All Tickets' },
        { value: 'Open', label: 'Open' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Resolved', label: 'Resolved' },
        { value: 'Closed', label: 'Closed' }
    ];

    useEffect(() => {
        dispatch(getUserTickets(filters));
    }, [dispatch, filters]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearTicketErrors());
        }
    }, [dispatch, error]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filtering
        }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Open':
                return <AlertCircle className="w-4 h-4 text-orange-500" />;
            case 'In Progress':
                return <Clock className="w-4 h-4 text-blue-500" />;
            case 'Resolved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Closed':
                return <XCircle className="w-4 h-4 text-gray-500" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
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
        const baseClasses = "inline-flex items-center px-2 py-1 rounded text-xs font-medium";
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">My Support Tickets</h1>
                            <p className="text-gray-600 mt-1">
                                Track and manage your support requests
                            </p>
                        </div>
                        <Link
                            to="/raise-ticket"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Raise New Ticket
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center text-blue-600 hover:text-blue-700"
                        >
                            <Filter className="w-4 h-4 mr-1" />
                            {showFilters ? 'Hide' : 'Show'} Filters
                        </button>
                    </div>

                    <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search tickets..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {/* Results per page */}
                            <select
                                value={filters.limit}
                                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={25}>25 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="bg-white rounded-lg shadow-sm">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Loading tickets...</span>
                        </div>
                    ) : tickets && tickets.length > 0 ? (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ticket
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subject
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Priority
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tickets.map((ticket) => (
                                            <tr key={ticket._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-blue-600">
                                                        {ticket.ticketId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                                                        {ticket.subject}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {ticket.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={getPriorityBadge(ticket.priority)}>
                                                        {ticket.priority}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={getStatusBadge(ticket.status)}>
                                                        {getStatusIcon(ticket.status)}
                                                        <span className="ml-1">{ticket.status}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(ticket.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Link
                                                        to={`/ticket/${ticket._id}`}
                                                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden">
                                {tickets.map((ticket) => (
                                    <div key={ticket._id} className="border-b border-gray-200 p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="text-sm font-medium text-blue-600">
                                                {ticket.ticketId}
                                            </div>
                                            <span className={getStatusBadge(ticket.status)}>
                                                {getStatusIcon(ticket.status)}
                                                <span className="ml-1">{ticket.status}</span>
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                                            {ticket.subject}
                                        </h3>
                                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                                            <span className="flex items-center">
                                                <Tag className="w-3 h-3 mr-1" />
                                                {ticket.category}
                                            </span>
                                            <span className={getPriorityBadge(ticket.priority)}>
                                                {ticket.priority}
                                            </span>
                                            <span className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDate(ticket.createdAt)}
                                            </span>
                                        </div>
                                        <Link
                                            to={`/ticket/${ticket._id}`}
                                            className="text-blue-600 hover:text-blue-900 text-sm font-medium inline-flex items-center"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Details
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-500">
                                            Showing {((currentPage - 1) * filters.limit) + 1} to{' '}
                                            {Math.min(currentPage * filters.limit, totalTickets)} of{' '}
                                            {totalTickets} tickets
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <span className="text-sm text-gray-700">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
                            <p className="text-gray-500 mb-6">
                                {filters.status !== 'all' || filters.search
                                    ? 'No tickets match your current filters.'
                                    : "You haven't raised any support tickets yet."}
                            </p>
                            <Link
                                to="/raise-ticket"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Raise Your First Ticket
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyTickets;
