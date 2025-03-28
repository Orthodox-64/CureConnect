import React from 'react';
import { X, AlertCircle, FileText, Calendar, Activity } from 'lucide-react';

const MedicalHistoryModal = ({ isOpen, onClose, medicalHistory, isLoading, error }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">Patient Medical History</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)] bg-gray-50">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                                <div className="absolute inset-0 rounded-full border-t-4 border-blue-600 animate-spin"></div>
                            </div>
                            <p className="text-blue-600 font-medium">Loading medical records...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center">
                            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-3">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    ) : medicalHistory && medicalHistory.length > 0 ? (
                        <div className="grid gap-8">
                            {medicalHistory.map((record) => (
                                <div
                                    key={record._id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg group"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="md:w-1/3 p-5 relative">
                                            <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden shadow-sm">
                                                <img
                                                    src={record.image.url}
                                                    alt="Medical scan"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="flex items-center justify-center mt-3 bg-blue-50 rounded-lg py-2 px-3">
                                                <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                                                <p className="text-xs text-blue-700 font-medium">
                                                    {new Date(record.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Analysis */}
                                        <div className="md:w-2/3 p-5 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-white">
                                            <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
                                                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                                                <h4 className="text-lg font-medium text-gray-900">Medical Analysis</h4>
                                            </div>
                                            <div className="prose prose-sm max-w-none">
                                                {record.analysis.split('\n').map((paragraph, idx) => (
                                                    <p key={idx} className="mb-3 text-gray-700 leading-relaxed">
                                                        {paragraph}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <FileText className="w-10 h-10 text-blue-400" />
                            </div>
                            <h4 className="text-xl font-medium text-gray-800 mb-2">No medical history found</h4>
                            <p className="text-gray-500 max-w-md mx-auto">
                                No medical history records found for this patient. Records will appear here once they are added.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalHistoryModal;