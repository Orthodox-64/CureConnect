import React, { useState } from 'react';
import { X, Calendar, Clock, FileText } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { scheduleFollowUp } from '../actions/appointmentActions';
import { toast } from 'react-toastify';

const FollowUpModal = ({ isOpen, onClose, appointment }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.followUp);

  const [formData, setFormData] = useState({
    followUpDate: '',
    followUpTime: '',
    followUpInstructions: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.followUpDate) {
      toast.error('Please select a follow-up date');
      return;
    }
    
    if (!formData.followUpTime) {
      toast.error('Please select a follow-up time');
      return;
    }
    
    const followUpDateTime = new Date(`${formData.followUpDate}T${formData.followUpTime}`);
    if (followUpDateTime <= new Date()) {
      toast.error('Follow-up date and time must be in the future');
      return;
    }

    try {
      await dispatch(scheduleFollowUp(
        appointment._id,
        formData.followUpDate,
        formData.followUpTime,
        formData.followUpInstructions
      ));
      toast.success('Follow-up appointment scheduled successfully!');
      onClose();
      setFormData({
        followUpDate: '',
        followUpTime: '',
        followUpInstructions: ''
      });
    } catch (error) {
      toast.error('Failed to schedule follow-up appointment');
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 border-b-4 border-blue-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl border-2 border-white/30">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold mb-1">Schedule Follow-up Appointment</h1>
              <p className="text-blue-100 text-sm">
                For patient: <span className="font-semibold">{appointment.patient?.name}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Patient Information */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Original Appointment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">Patient:</span> {appointment.patient?.name}
              </div>
              <div>
                <span className="font-medium">Date:</span> {appointment.day}
              </div>
              <div>
                <span className="font-medium">Time:</span> {appointment.time}
              </div>
              <div>
                <span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Follow-up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Follow-up Date *
                </label>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Tomorrow minimum
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Follow-up Time *
                </label>
                <select
                  name="followUpTime"
                  value={formData.followUpTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
                  required
                >
                  <option value="">Select time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="09:30">09:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="14:30">02:30 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="16:30">04:30 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Follow-up Instructions
              </label>
              <textarea
                name="followUpInstructions"
                value={formData.followUpInstructions}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 shadow-sm"
                rows="4"
                placeholder="Special instructions for the follow-up appointment (e.g., bring test reports, specific concerns to discuss, etc.)"
              />
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>The patient will receive an immediate email notification about this follow-up appointment</li>
                      <li>A reminder will be sent 24 hours before the scheduled appointment</li>
                      <li>Make sure the selected time slot is available before scheduling</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all flex items-center space-x-2 shadow-lg hover:shadow-xl font-semibold"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Follow-up</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
