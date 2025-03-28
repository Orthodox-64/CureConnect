import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const MedicalHistoryModal = ({ isOpen, onClose, medicalHistory, isLoading, error }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-xl font-semibold text-gray-900">Medical History</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500 flex flex-col items-center">
                            <AlertCircle className="w-8 h-8 mb-2" />
                            <p>{error}</p>
                        </div>
                    ) : medicalHistory && medicalHistory.length > 0 ? (
                        <div className="grid gap-6">
                            {medicalHistory.map((record) => (
                                <div
                                    key={record._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                                >
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image */}
                                        <div className="md:w-1/3 p-4">
                                            <img
                                                src={record.image.url}
                                                alt="Medical scan"
                                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                                            />
                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                {new Date(record.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>

                                        {/* Analysis */}
                                        <div className="md:w-2/3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                                            <div className="prose prose-sm max-w-none">
                                                {record.analysis.split('\n').map((paragraph, idx) => (
                                                    <p key={idx} className="mb-2 text-gray-700">
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
                        <div className="text-center py-8 text-gray-500">
                            <p>No medical history records found for this patient.</p>
                            <p className="text-sm mt-2">Medical records will appear here once they are added.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalHistoryModal;