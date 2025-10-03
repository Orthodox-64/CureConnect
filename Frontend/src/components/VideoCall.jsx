import { useSelector } from "react-redux";
import { Video, MessageSquare, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import { toast } from 'react-toastify';
import { useState } from 'react';

const VideoCall = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [roomId, setRoomId] = useState('general');
  const [isNotifying, setIsNotifying] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const navigateToChat = () => {
    navigate('/chat');
  };

  const handleLookupPatient = async () => {
    if (!patientId.trim()) {
      toast.error('Please enter a patient ID');
      return;
    }

    setIsLookingUp(true);
    try {
      const response = await axios.get(`/user/${patientId.trim()}`);
      if (response.data.success) {
        setPatientInfo(response.data.user);
        toast.success(`Found patient: ${response.data.user.name}`);
      }
    } catch (error) {
      console.error('Error looking up patient:', error);
      toast.error(error.response?.data?.message || 'Patient not found');
      setPatientInfo(null);
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleNotifyPatient = async () => {
    if (!patientId.trim()) {
      toast.error('Please enter a patient ID');
      return;
    }

    setIsNotifying(true);
    try {
      const response = await axios.post('/notify-doctor-joined', {
        patientId: patientId.trim(),
        roomId: roomId
      });

      if (response.data.success) {
        toast.success(`Notification sent to ${response.data.data.patientName} successfully!`);
        setPatientId(''); // Clear the input
        setPatientInfo(null); // Clear patient info
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setIsNotifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      {user?.role === "doctor" ? (
        <div className="max-w-16xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Doctor Portal
              <span className="block text-blue-600">Video Consultation</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Access your video consultation platform to connect with patients
            </p>
          </div>

          {/* Video Call Access */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Join Video Call */}
              <div 
                onClick={() => window.open(`https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=${roomId}`, '_blank')}
                className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="px-8 py-12 text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="p-4 bg-blue-50 rounded-2xl">
                      <Video size={32} className="text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Join Video Consultation</h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Access the video consultation platform to connect with patients
                  </p>
                  <div className="flex items-center justify-center text-blue-600 font-semibold text-lg">
                    Enter Video Platform
                    <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
              </div>
            </div>

              {/* Notify Patient */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <Bell size={32} className="text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">Notify Patient</h3>
                <p className="text-gray-600 mb-8 text-lg text-center">
                  Send email notification to patient when you join the call
                </p>

                <div className="space-y-6">
                  {/* Room ID Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room ID
                    </label>
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="Enter room ID"
                    />
                  </div>

                  {/* Patient ID Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient ID
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={patientId}
                        onChange={(e) => setPatientId(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                        placeholder="Enter patient ID"
                      />
                      <button
                        onClick={handleLookupPatient}
                        disabled={isLookingUp || !patientId.trim()}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-300"
                      >
                        {isLookingUp ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          'Lookup'
                        )}
                      </button>
                  </div>
                </div>

                  {/* Patient Info Display */}
                  {patientInfo && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Patient Information:</h4>
                      <p className="text-green-700"><strong>Name:</strong> {patientInfo.name}</p>
                      <p className="text-green-700"><strong>Email:</strong> {patientInfo.contact}</p>
                      <p className="text-green-700"><strong>Role:</strong> {patientInfo.role}</p>
                    </div>
                  )}

                  {/* Notify Button */}
                <button
                    onClick={handleNotifyPatient}
                    disabled={isNotifying || !patientId.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  >
                    {isNotifying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Bell className="w-5 h-5 mr-2" />
                        Notify Patient
                      </>
                    )}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-16xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              Telemedicine
              <span className="block text-blue-600">Consultation Portal</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Connect with healthcare professionals through video or chat consultations
            </p>
          </div>

          {/* Consultation Options */}
          <div className="max-w-2xl mx-auto">
            {/* Video Consultation Card */}
            <div 
              onClick={() => window.open('https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=general', '_blank')}
              className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer mb-8"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="px-8 py-12 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <Video size={32} className="text-blue-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Video Consultation</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Connect with healthcare professionals through secure video calls for comprehensive medical consultations
                </p>
                <div className="flex items-center justify-center text-blue-600 font-semibold text-lg">
                  Start Video Call
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Chat Consultation Card */}
            <div 
              onClick={navigateToChat}
              className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="px-8 py-12 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <MessageSquare size={32} className="text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Chat Consultation</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Get medical advice and support through text-based consultations with healthcare professionals
                </p>
                <div className="flex items-center justify-center text-green-600 font-semibold text-lg">
                  Start Chat
                  <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              For life-threatening emergencies, please call your local emergency services immediately.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VideoCall;