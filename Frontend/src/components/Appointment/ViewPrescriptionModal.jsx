import React from 'react';
import { X, Pill, Calendar, User, Clock, FileText } from 'lucide-react';

const ViewPrescriptionModal = ({ isOpen, onClose, prescription }) => {
    if (!isOpen || !prescription) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden relative">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Medical Prescription</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                    {/* Header Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <User className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold">Patient Details</span>
                            </div>
                            <p className="text-sm">Name: {prescription.patient.name}</p>
                            <p className="text-sm">Contact: {prescription.patient.contact}</p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold">Prescription Info</span>
                            </div>
                            <p className="text-sm">Date: {formatDate(prescription.createdAt)}</p>
                            <p className="text-sm">Doctor: Dr. {prescription.doctor.name}</p>
                        </div>
                    </div>

                    {/* Medications */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-lg mb-4">Medications</h3>
                        <div className="space-y-4">
                            {prescription.medications.map((med, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Pill className="w-4 h-4 text-indigo-600" />
                                        <span className="font-medium">{med.name}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <p>Dosage: {med.dosage}</p>
                                        <p>Frequency: {med.frequency}</p>
                                        <p>Duration: {med.duration}</p>
                                        {med.instructions && (
                                            <p className="col-span-2">
                                                Instructions: {med.instructions}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Additional Notes */}
                    {prescription.notes && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-lg mb-2">Additional Notes</h3>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm">{prescription.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Doctor's Signature */}
                    <div className="mt-8 flex flex-col items-end">
                        <div className="font-signature text-2xl text-indigo-600">
                            Dr. {prescription.doctor.name}
                        </div>
                        <div className="text-sm text-gray-500">
                            {prescription.doctor.speciality}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewPrescriptionModal;