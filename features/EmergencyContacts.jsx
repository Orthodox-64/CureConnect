import React, { useState, useEffect } from 'react';
import { Phone, MapPin, AlertCircle, Plus, Edit2, Trash2, Save, X, Navigation, Hospital, Ambulance, Shield, Heart, Users, Clock, CheckCircle2, Info } from 'lucide-react';

const EmergencyContacts = () => {
  const [personalContacts, setPersonalContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    isPrimary: false
  });

  const emergencyNumbers = [
    {
      id: 'ambulance',
      name: 'Ambulance',
      number: '108',
      icon: <Ambulance className="w-8 h-8" />,
      color: 'red',
      description: 'Medical Emergency'
    },
    {
      id: 'police',
      name: 'Police',
      number: '100',
      icon: <Shield className="w-8 h-8" />,
      color: 'blue',
      description: 'Law Enforcement'
    },
    {
      id: 'fire',
      name: 'Fire Brigade',
      number: '101',
      icon: <AlertCircle className="w-8 h-8" />,
      color: 'orange',
      description: 'Fire Emergency'
    },
    {
      id: 'women',
      name: 'Women Helpline',
      number: '1091',
      icon: <Users className="w-8 h-8" />,
      color: 'pink',
      description: 'Women Safety'
    },
    {
      id: 'child',
      name: 'Child Helpline',
      number: '1098',
      icon: <Heart className="w-8 h-8" />,
      color: 'purple',
      description: 'Child Protection'
    },
    {
      id: 'disaster',
      name: 'Disaster Management',
      number: '108',
      icon: <Navigation className="w-8 h-8" />,
      color: 'yellow',
      description: 'Natural Disasters'
    }
  ];

  const medicalServices = [
    { name: 'Poison Control', number: '1800-116-117', available: '24/7' },
    { name: 'Mental Health', number: '1800-599-0019', available: '24/7' },
    { name: 'Blood Bank', number: '104', available: '24/7' },
    { name: 'Senior Citizen', number: '14567', available: '8 AM - 8 PM' },
    { name: 'AIDS Helpline', number: '1097', available: '24/7' },
    { name: 'Anti-Poison', number: '1066', available: '24/7' }
  ];

  // Load contacts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
      setPersonalContacts(JSON.parse(saved));
    }
  }, []);

  // Save contacts to localStorage
  useEffect(() => {
    localStorage.setItem('emergencyContacts', JSON.stringify(personalContacts));
  }, [personalContacts]);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const handleAddContact = () => {
    if (formData.name && formData.phone) {
      const newContact = {
        id: Date.now(),
        ...formData
      };
      setPersonalContacts([...personalContacts, newContact]);
      resetForm();
    }
  };

  const handleUpdateContact = () => {
    setPersonalContacts(personalContacts.map(contact => 
      contact.id === editingId ? { ...contact, ...formData } : contact
    ));
    setEditingId(null);
    resetForm();
  };

  const handleDeleteContact = (id) => {
    setPersonalContacts(personalContacts.filter(contact => contact.id !== id));
  };

  const handleEditContact = (contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email || '',
      isPrimary: contact.isPrimary || false
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      isPrimary: false
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const makeCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const findNearbyHospitals = () => {
    if (userLocation) {
      const url = `https://www.google.com/maps/search/hospitals/@${userLocation.lat},${userLocation.lng},15z`;
      window.open(url, '_blank');
    } else {
      getUserLocation();
      setTimeout(() => {
        if (userLocation) {
          findNearbyHospitals();
        }
      }, 1000);
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
    };
    return colors[color] || colors.red;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-4 rounded-full animate-pulse">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Emergency Contacts & SOS
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Quick access to emergency services and important contacts when you need them most
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Emergency Services */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Phone className="w-6 h-6 mr-2 text-red-600" />
                Emergency Services
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {emergencyNumbers.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => makeCall(service.number)}
                    className={`bg-gradient-to-r ${getColorClasses(service.color)} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                        {service.icon}
                      </div>
                      <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{service.name}</h3>
                    <p className="text-3xl font-extrabold mb-2">{service.number}</p>
                    <p className="text-sm opacity-90">{service.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Find Hospitals */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Hospital className="w-6 h-6 mr-2 text-red-600" />
                Find Nearby Medical Facilities
              </h2>
              
              <button
                onClick={findNearbyHospitals}
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
              >
                <MapPin className="w-8 h-8 mr-3" />
                <div className="text-left">
                  <div className="text-xl font-bold">Find Hospitals Near Me</div>
                  <div className="text-sm opacity-90">Opens in Google Maps</div>
                </div>
              </button>

              {userLocation && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-700 text-sm">Location access granted</span>
                </div>
              )}
            </div>

            {/* Medical Helplines */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Heart className="w-6 h-6 mr-2 text-red-600" />
                Medical Helplines
              </h2>
              
              <div className="space-y-3">
                {medicalServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{service.name}</h3>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">{service.available}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => makeCall(service.number)}
                      className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {service.number}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Emergency Contacts */}
            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-red-600" />
                  My Emergency Contacts
                </h2>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 flex items-center"
                >
                  {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {showAddForm ? 'Cancel' : 'Add Contact'}
                </button>
              </div>

              {/* Add/Edit Form */}
              {showAddForm && (
                <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {editingId ? 'Edit Contact' : 'Add New Contact'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Relationship
                        </label>
                        <input
                          type="text"
                          value={formData.relationship}
                          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                          placeholder="e.g., Spouse, Parent, Friend"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 234 567 8900"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        checked={formData.isPrimary}
                        onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                        className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="isPrimary" className="ml-2 text-gray-700 font-medium">
                        Set as primary emergency contact
                      </label>
                    </div>

                    <button
                      onClick={editingId ? handleUpdateContact : handleAddContact}
                      disabled={!formData.name || !formData.phone}
                      className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {editingId ? 'Update Contact' : 'Save Contact'}
                    </button>
                  </div>
                </div>
              )}

              {/* Contacts List */}
              {personalContacts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No emergency contacts added yet</p>
                  <p className="text-gray-400 text-sm mt-2">Add your trusted contacts for quick access during emergencies</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {personalContacts
                    .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
                    .map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-5 border-2 rounded-2xl hover:shadow-lg transition-all duration-300 ${
                          contact.isPrimary
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-800">{contact.name}</h3>
                              {contact.isPrimary && (
                                <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                  Primary
                                </span>
                              )}
                            </div>
                            {contact.relationship && (
                              <p className="text-sm text-gray-600 mb-2">{contact.relationship}</p>
                            )}
                            <div className="flex flex-wrap gap-3">
                              <button
                                onClick={() => makeCall(contact.phone)}
                                className="flex items-center text-red-600 hover:text-red-700 font-semibold"
                              >
                                <Phone className="w-4 h-4 mr-1" />
                                {contact.phone}
                              </button>
                              {contact.email && (
                                <a
                                  href={`mailto:${contact.email}`}
                                  className="text-gray-600 hover:text-gray-700 text-sm"
                                >
                                  {contact.email}
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditContact(contact)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* SOS Button */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Emergency SOS
              </h3>
              <button
                onClick={() => makeCall('108')}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-pulse"
              >
                <AlertCircle className="w-16 h-16 mx-auto mb-3" />
                <div className="text-3xl font-extrabold mb-2">SOS</div>
                <div className="text-sm opacity-90">Tap for Immediate Help</div>
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Calls emergency medical services
              </p>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-red-600" />
                Emergency Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Stay calm and speak clearly when calling emergency services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Provide your exact location and describe the emergency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Don't hang up until told to do so</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Keep this page bookmarked for quick access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">•</span>
                  <span>Update your emergency contacts regularly</span>
                </li>
              </ul>
            </div>

            {/* Medical Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                When to Call Emergency
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Difficulty breathing or shortness of breath</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Chest pain or pressure</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Severe bleeding or injury</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Loss of consciousness</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Sudden confusion or slurred speech</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Severe allergic reaction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmergencyContacts;
