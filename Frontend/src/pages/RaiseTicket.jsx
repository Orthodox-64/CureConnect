import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { createTicket, clearTicketErrors, clearTicketMessages } from '../actions/ticketActions';
import { AlertCircle, Send, X } from 'lucide-react';

const RaiseTicket = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, success, error, message } = useSelector(state => state.createTicket);

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        category: 'General Inquiry',
        priority: 'Medium'
    });

    const categories = [
        'Technical Issue',
        'Account Problem',
        'Appointment Issue',
        'Payment Issue',
        'Medical Records',
        'Prescription Issue',
        'General Inquiry',
        'Bug Report',
        'Feature Request',
        'Other'
    ];

    const priorities = ['Low', 'Medium', 'High', 'Critical'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.subject.trim()) {
            toast.error('Please enter a subject');
            return;
        }
        
        if (!formData.description.trim()) {
            toast.error('Please describe your issue');
            return;
        }

        dispatch(createTicket(formData));
    };

    React.useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearTicketErrors());
        }

        if (success && message) {
            toast.success(message);
            dispatch(clearTicketMessages());
            // Reset form
            setFormData({
                subject: '',
                description: '',
                category: 'General Inquiry',
                priority: 'Medium'
            });
            // Navigate to tickets page
            navigate('/my-tickets');
        }
    }, [dispatch, error, success, message, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Raise a Support Ticket</h1>
                            <p className="text-gray-600 mt-1">
                                Having an issue? Let us know and we'll help you resolve it quickly.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/my-tickets')}
                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Brief description of your issue"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                maxLength={100}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.subject.length}/100 characters
                            </p>
                        </div>

                        {/* Category and Priority Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    id="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    id="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {priorities.map((priority) => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                rows={6}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Please provide detailed information about your issue. Include steps to reproduce the problem if applicable."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                maxLength={1000}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.description.length}/1000 characters
                            </p>
                        </div>

                        {/* Priority Help Text */}
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                            <div className="flex">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div className="text-sm text-blue-800">
                                    <p className="font-medium mb-2">Priority Guidelines:</p>
                                    <ul className="space-y-1">
                                        <li><span className="font-medium">Critical:</span> System down, security issues, or medical emergencies</li>
                                        <li><span className="font-medium">High:</span> Major functionality broken, urgent medical records issues</li>
                                        <li><span className="font-medium">Medium:</span> General issues, feature requests, minor bugs</li>
                                        <li><span className="font-medium">Low:</span> Questions, suggestions, cosmetic issues</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/my-tickets')}
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Submit Ticket
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">What happens next?</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>• You'll receive a confirmation email with your ticket ID</p>
                        <p>• Our support team will review your ticket based on priority</p>
                        <p>• You'll get email notifications when your ticket status changes</p>
                        <p>• You can track your ticket progress in the "My Tickets" section</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RaiseTicket;
