import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { getPrescriptions } from '../actions/prescriptionActions';
import PrescriptionCard from '../components/PrescriptionCard';
import PrescriptionModal from '../components/PrescriptionModal';

const Prescriptions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(state => state.user);
  const { prescriptions, loading, error } = useSelector(state => state.prescription);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Fetching prescriptions for user:', user);
      dispatch(getPrescriptions()).catch(error => {
        console.error('Error fetching prescriptions:', error);
      });
    }
  }, [dispatch, isAuthenticated, user]);

  // Handle appointment data passed from navigation
  useEffect(() => {
    if (location.state?.appointmentId) {
      setSelectedAppointment({
        _id: location.state.appointmentId,
        patient: {
          _id: location.state.patientId,
          name: location.state.patientName
        }
      });
      setIsModalOpen(true);
    }
  }, [location.state]);

  // Debug: Log prescription data
  console.log('Prescriptions data:', { prescriptions, loading, error });

  const filteredPrescriptions = Array.isArray(prescriptions) ? prescriptions.filter(prescription => {
    if (!prescription) return false;
    
    const matchesSearch = 
      (prescription.prescriptionNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role === 'doctor' 
        ? (prescription.patient?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        : (prescription.doctor?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    return matchesSearch;
  }) : [];


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please log in to view your prescriptions.</p>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {user.role === 'doctor' ? 'Prescription Management' : 'My Prescriptions'}
              </h1>
              <p className="text-gray-600">
                {user.role === 'doctor' 
                  ? 'Create and manage patient prescriptions'
                  : 'View and download your prescriptions'
                }
              </p>
            </div>
            {user.role === 'doctor' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create Prescription</span>
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={`Search by prescription number or ${user.role === 'doctor' ? 'patient name' : 'doctor name'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="all">All Prescriptions</option>
                <option value="recent">Recent (Last 30 days)</option>
                <option value="older">Older than 30 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900">{Array.isArray(prescriptions) ? prescriptions.length : 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(prescriptions) ? prescriptions.filter(p => {
                    if (!p || !p.createdAt) return false;
                    const prescriptionDate = new Date(p.createdAt);
                    const now = new Date();
                    return prescriptionDate.getMonth() === now.getMonth() && 
                           prescriptionDate.getFullYear() === now.getFullYear();
                  }).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Array.isArray(prescriptions) ? prescriptions.filter(p => {
                    if (!p || !p.createdAt) return false;
                    const prescriptionDate = new Date(p.createdAt);
                    const now = new Date();
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return prescriptionDate >= weekAgo;
                  }).length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-500 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Prescriptions</h3>
                <p className="text-red-700 mt-1">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && filteredPrescriptions.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No prescriptions found' : 'No prescriptions yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : user.role === 'doctor' 
                  ? 'Create your first prescription to get started'
                  : 'You don\'t have any prescriptions yet'
              }
            </p>
            {user.role === 'doctor' && !searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Prescription
              </button>
            )}
          </div>
        ) : loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading prescriptions...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPrescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription._id}
                prescription={prescription}
                userRole={user.role}
              />
            ))}
          </div>
        )}

        {/* Prescription Modal */}
        <PrescriptionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          appointmentId={selectedAppointment?._id}
          patientId={selectedAppointment?.patient?._id}
          patientName={selectedAppointment?.patient?.name}
        />
      </div>
    </div>
  );
};

export default Prescriptions;
