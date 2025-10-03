import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, FileText, Stethoscope } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createPrescription } from '../actions/prescriptionActions';
import { myAppointments } from '../actions/appointmentActions';
import { toast } from 'react-toastify';

const PrescriptionModal = ({ isOpen, onClose, appointmentId, patientId, patientName }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.prescription);
  const { user } = useSelector(state => state.user);
  const { appointments } = useSelector(state => state.myAppointment);

  const [formData, setFormData] = useState({
    selectedAppointmentId: appointmentId || '',
    selectedPatientId: patientId || '',
    selectedPatientName: patientName || '',
    diagnosis: '',
    symptoms: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
    notes: '',
    followUpInstructions: ''
  });

  useEffect(() => {
    if (isOpen && !appointmentId && user.role === 'doctor') {
      dispatch(myAppointments());
    }
  }, [isOpen, appointmentId, user.role, dispatch]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        selectedAppointmentId: appointmentId || '',
        selectedPatientId: patientId || '',
        selectedPatientName: patientName || '',
        diagnosis: '',
        symptoms: '',
        medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        notes: '',
        followUpInstructions: ''
      });
    }
  }, [isOpen, appointmentId, patientId, patientName]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index][field] = value;
    setFormData(prev => ({
      ...prev,
      medications: updatedMedications
    }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const updatedMedications = formData.medications.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        medications: updatedMedications
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalAppointmentId = formData.selectedAppointmentId || appointmentId;
    const finalPatientId = formData.selectedPatientId || patientId;
    
    if (!finalAppointmentId) {
      toast.error('Please select an appointment');
      return;
    }
    
    if (!finalPatientId) {
      toast.error('Please select a patient');
      return;
    }
    
    if (!formData.diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }

    const validMedications = formData.medications.filter(med => 
      med.name.trim() && med.dosage.trim() && med.frequency.trim()
    );

    if (validMedications.length === 0) {
      toast.error('Please add at least one medication');
      return;
    }

    const prescriptionData = {
      patientId: finalPatientId,
      appointmentId: finalAppointmentId,
      diagnosis: formData.diagnosis,
      symptoms: formData.symptoms,
      medications: validMedications,
      notes: formData.notes,
      followUpInstructions: formData.followUpInstructions
    };

    try {
      await dispatch(createPrescription(prescriptionData));
      toast.success('Prescription created successfully!');
      onClose();
      setFormData({
        selectedAppointmentId: appointmentId || '',
        selectedPatientId: patientId || '',
        selectedPatientName: patientName || '',
        diagnosis: '',
        symptoms: '',
        medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        notes: '',
        followUpInstructions: ''
      });
    } catch (error) {
      toast.error('Failed to create prescription');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Crimson+Text:wght@600&display=swap');
        
        .doctor-signature {
          font-family: 'Dancing Script', cursive;
          font-size: 2rem;
          font-weight: 700;
          color: #1e40af;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        .prescription-header {
          font-family: 'Crimson Text', serif;
          font-weight: 600;
        }
        
        .rx-symbol {
          font-size: 3rem;
          font-weight: bold;
          color: #2563eb;
          font-style: italic;
        }
        
        .prescription-paper {
          background: linear-gradient(to bottom, #ffffff 0%, #fefefe 100%);
          box-shadow: 0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8);
        }
        
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 8rem;
          color: rgba(37, 99, 235, 0.03);
          font-weight: 900;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }
      `}</style>
      
      <div className="prescription-paper rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <div className="watermark">℞</div>
        
        {/* Medical Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 border-b-4 border-blue-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all z-10 backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl border-2 border-white/30">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
            <div className="text-white">
              <h1 className="prescription-header text-3xl font-bold mb-1">Dr. {user?.name || 'Doctor Name'}</h1>
              <p className="text-blue-100 text-sm">{user?.contact || 'Contact Information'}</p>
              <div className="mt-2 pt-2 border-t border-white/30">
                <p className="text-xs text-blue-100">Medical Registration: {user?.registrationNumber || 'REG123456'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 relative z-10">
          {/* Patient Information Section */}
          <div className="mb-8 pb-6 border-b-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="prescription-header text-xl text-gray-900 flex items-center space-x-2">
                <span className="text-2xl">📋</span>
                <span>Patient Information</span>
              </h2>
              <div className="text-sm text-gray-600">
                Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {!appointmentId && (
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Appointment *
                </label>
                <select
                  value={formData.selectedAppointmentId}
                  onChange={(e) => {
                    const selectedAppointment = appointments?.find(apt => apt._id === e.target.value);
                    const patientId = selectedAppointment?.patient?._id || selectedAppointment?.patient?.id || '';
                    
                    setFormData(prev => ({
                      ...prev,
                      selectedAppointmentId: e.target.value,
                      selectedPatientId: patientId,
                      selectedPatientName: selectedAppointment?.patient?.name || ''
                    }));
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
                  required
                >
                  <option value="">Select an appointment</option>
                  {appointments?.filter(apt => apt.status !== 'cancelled').map(appointment => (
                    <option key={appointment._id} value={appointment._id}>
                      {appointment.patient?.name} - {appointment.day} at {appointment.time}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {(formData.selectedPatientName || patientName) && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <p className="text-lg font-semibold text-gray-900">
                  Patient: <span className="text-blue-700">{formData.selectedPatientName || patientName}</span>
                </p>
              </div>
            )}
          </div>

          {/* Rx Symbol & Diagnosis */}
          <div className="mb-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="rx-symbol">℞</div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Diagnosis *
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-amber-50/30 text-gray-900 shadow-sm"
                  rows="3"
                  placeholder="Medical diagnosis..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Presenting Symptoms
            </label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-amber-50/30 text-gray-900 shadow-sm"
              rows="3"
              placeholder="Patient's reported symptoms..."
            />
          </div>

          {/* Medications Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-gray-200">
              <h3 className="prescription-header text-lg text-gray-900 flex items-center space-x-2">
                <span>💊</span>
                <span>Prescribed Medications</span>
              </h3>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <div key={index} className="border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-5 shadow-sm relative">
                  <div className="absolute top-3 left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                  
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="absolute top-3 right-3 p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                        Medicine Name *
                      </label>
                      <input
                        type="text"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                        placeholder="e.g., Paracetamol"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                        Dosage *
                      </label>
                      <input
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                        Frequency *
                      </label>
                      <input
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                        placeholder="e.g., Twice daily"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                        placeholder="e.g., 7 days"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                        Special Instructions
                      </label>
                      <textarea
                        value={medication.instructions}
                        onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                        className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                        rows="2"
                        placeholder="e.g., Take after meals, avoid alcohol..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Clinical Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-amber-50/30 text-gray-900 shadow-sm"
              rows="3"
              placeholder="Additional medical notes, precautions, or recommendations..."
            />
          </div>

          {/* Follow-up Instructions */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Follow-up Care Instructions
            </label>
            <textarea
              name="followUpInstructions"
              value={formData.followUpInstructions}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-amber-50/30 text-gray-900 shadow-sm"
              rows="3"
              placeholder="Follow-up appointment schedule, monitoring instructions..."
            />
          </div>

          {/* Doctor Signature Section */}
          <div className="mb-8 pt-6 border-t-2 border-gray-200">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="mb-2">
                  <div className="doctor-signature">Dr. {user?.name || 'Doctor Name'}</div>
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {user?.speciality || 'General Medicine'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Registration No: {user?.registrationNumber || 'REG123456'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating Prescription...</span>
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  <span>Issue Prescription</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prescription Footer */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-8 py-4 border-t-2 border-gray-200 text-center">
          <p className="text-xs text-gray-600">
            This is a digitally generated prescription. Valid for 30 days from date of issue.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            For any queries or concerns, please contact the prescribing physician.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;