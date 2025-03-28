import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createPrescription } from '../../actions/prescriptionActions';

const PrescriptionModal = ({ isOpen, onClose, appointment }) => {
    const dispatch = useDispatch();
    const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    const [notes, setNotes] = useState('');

    if (!isOpen || !appointment) return null;

    const handleAddMedication = () => {
        setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const handleRemoveMedication = (index) => {
        setMedications(medications.filter((_, i) => i !== index));
    };

    const handleMedicationChange = (index, field, value) => {
        const newMedications = [...medications];
        newMedications[index][field] = value;
        setMedications(newMedications);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createPrescription({
            patientId: appointment.patient.id,
            appointmentId: appointment._id,
            medications,
            notes
        }));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Write Prescription</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
                    <div className="space-y-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="font-semibold mb-2">Patient Details</h3>
                            <p>Name: {appointment.patient.name}</p>
                            <p>Contact: {appointment.patient.contact}</p>
                            <p>Date: {new Date(appointment.day).toLocaleDateString()}</p>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold">Medications</h3>
                                <button
                                    type="button"
                                    onClick={handleAddMedication}
                                    className="text-blue-600 hover:text-blue-700 flex items-center"
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Medication
                                </button>
                            </div>

                            {medications.map((med, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Medicine Name</label>
                                            <input
                                                type="text"
                                                value={med.name}
                                                onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Dosage</label>
                                            <input
                                                type="text"
                                                value={med.dosage}
                                                onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Frequency</label>
                                            <input
                                                type="text"
                                                value={med.frequency}
                                                onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                                                className="w-full p-2 border rounded"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Duration</label>
                                            <input
                                                type="text"
                                                value={med.duration}
                                                onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium mb-1">Special Instructions</label>
                                        <input
                                            type="text"
                                            value={med.instructions}
                                            onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    {medications.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedication(index)}
                                            className="mt-2 text-red-600 hover:text-red-700 flex items-center"
                                        >
                                            <Minus className="w-4 h-4 mr-1" />
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Additional Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full p-2 border rounded h-24"
                                placeholder="Any additional notes or instructions..."
                            />
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Prescription
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PrescriptionModal;