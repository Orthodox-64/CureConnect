import React, { useState, useEffect } from 'react';
import { Pill, Plus, Trash2, Clock, CheckCircle2, Circle, Bell, Calendar, AlertCircle, Edit2, X, Save } from 'lucide-react';

const MedicationReminder = () => {
  const [medications, setMedications] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    times: ['09:00'],
    startDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const timeSlots = [
    { value: '06:00', label: 'Morning (6 AM)', icon: '🌅' },
    { value: '09:00', label: 'Breakfast (9 AM)', icon: '☕' },
    { value: '12:00', label: 'Noon (12 PM)', icon: '☀️' },
    { value: '14:00', label: 'Afternoon (2 PM)', icon: '🌤️' },
    { value: '18:00', label: 'Evening (6 PM)', icon: '🌆' },
    { value: '21:00', label: 'Night (9 PM)', icon: '🌙' }
  ];

  // Load medications from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('medications');
    if (saved) {
      setMedications(JSON.parse(saved));
    }
  }, []);

  // Save medications to localStorage
  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAddMedication = () => {
    if (formData.name && formData.dosage) {
      const newMedication = {
        id: Date.now(),
        ...formData,
        takenToday: []
      };
      setMedications([...medications, newMedication]);
      resetForm();
    }
  };

  const handleUpdateMedication = () => {
    setMedications(medications.map(med => 
      med.id === editingId ? { ...med, ...formData } : med
    ));
    setEditingId(null);
    resetForm();
  };

  const handleDeleteMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleEditMedication = (med) => {
    setEditingId(med.id);
    setFormData({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      times: med.times,
      startDate: med.startDate,
      notes: med.notes || ''
    });
    setShowAddForm(true);
  };

  const markAsTaken = (medId, time) => {
    setMedications(medications.map(med => {
      if (med.id === medId) {
        const today = new Date().toDateString();
        const takenToday = med.takenToday || [];
        
        // Check if already taken at this time today
        const alreadyTaken = takenToday.some(
          t => t.date === today && t.time === time
        );
        
        if (alreadyTaken) {
          // Remove from taken
          return {
            ...med,
            takenToday: takenToday.filter(t => !(t.date === today && t.time === time))
          };
        } else {
          // Mark as taken
          return {
            ...med,
            takenToday: [...takenToday, { date: today, time, timestamp: Date.now() }]
          };
        }
      }
      return med;
    }));
  };

  const isTaken = (med, time) => {
    const today = new Date().toDateString();
    return med.takenToday?.some(t => t.date === today && t.time === time) || false;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'daily',
      times: ['09:00'],
      startDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setShowAddForm(false);
    setEditingId(null);
  };

  const toggleTimeSlot = (time) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.includes(time)
        ? prev.times.filter(t => t !== time)
        : [...prev.times, time].sort()
    }));
  };

  const getUpcomingMedications = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    
    const upcoming = [];
    medications.forEach(med => {
      med.times.forEach(time => {
        if (time >= currentTimeStr && !isTaken(med, time)) {
          upcoming.push({ ...med, scheduledTime: time });
        }
      });
    });
    
    return upcoming.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime)).slice(0, 3);
  };

  const getTodayStats = () => {
    let total = 0;
    let taken = 0;
    
    medications.forEach(med => {
      total += med.times.length;
      med.times.forEach(time => {
        if (isTaken(med, time)) taken++;
      });
    });
    
    return { total, taken, percentage: total > 0 ? Math.round((taken / total) * 100) : 0 };
  };

  const stats = getTodayStats();
  const upcoming = getUpcomingMedications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
              <Pill className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Medication Reminder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Never miss a dose! Track and manage your medications easily
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Progress */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                  Today's Progress
                </h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-600">{stats.percentage}%</div>
                  <div className="text-sm text-gray-500">{stats.taken} of {stats.total} doses</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>

              {/* Add Medication Button */}
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {showAddForm ? <X className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                {showAddForm ? 'Cancel' : 'Add New Medication'}
              </button>

              {/* Add/Edit Form */}
              {showAddForm && (
                <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl animate-fadeIn">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {editingId ? 'Edit Medication' : 'Add New Medication'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Medication Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g., Aspirin"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Dosage *
                        </label>
                        <input
                          type="text"
                          value={formData.dosage}
                          onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                          placeholder="e.g., 500mg"
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Times
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => toggleTimeSlot(slot.value)}
                            className={`p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                              formData.times.includes(slot.value)
                                ? 'border-purple-500 bg-purple-100'
                                : 'border-gray-300 hover:border-purple-300'
                            }`}
                          >
                            <div className="text-lg mb-1">{slot.icon}</div>
                            <div className="text-xs text-gray-600">{slot.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="e.g., Take with food"
                        rows="2"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={editingId ? handleUpdateMedication : handleAddMedication}
                      disabled={!formData.name || !formData.dosage || formData.times.length === 0}
                      className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      {editingId ? 'Update Medication' : 'Save Medication'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Medications List */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Pill className="w-6 h-6 mr-2 text-purple-600" />
                My Medications ({medications.length})
              </h2>

              {medications.length === 0 ? (
                <div className="text-center py-12">
                  <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No medications added yet</p>
                  <p className="text-gray-400 text-sm mt-2">Click "Add New Medication" to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      className="border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800">{med.name}</h3>
                          <p className="text-gray-600">{med.dosage}</p>
                          {med.notes && (
                            <p className="text-sm text-gray-500 mt-1 italic">💡 {med.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditMedication(med)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedication(med.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {med.times.sort().map((time) => {
                          const taken = isTaken(med, time);
                          const timeSlot = timeSlots.find(s => s.value === time);
                          
                          return (
                            <button
                              key={time}
                              onClick={() => markAsTaken(med.id, time)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
                                taken
                                  ? 'bg-green-100 border-green-500 text-green-700'
                                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-purple-400'
                              }`}
                            >
                              {taken ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                              <span className="text-sm">{timeSlot?.icon} {time}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Doses */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-purple-600" />
                Upcoming Doses
              </h3>
              
              {upcoming.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">All caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((item, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{item.name}</span>
                        <Clock className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-sm text-gray-600">{item.dosage}</div>
                      <div className="text-xs text-purple-600 font-semibold mt-1">
                        {item.scheduledTime}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
                Medication Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Take medications at the same time each day</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Store medicines in a cool, dry place</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Don't skip doses even if you feel better</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Check expiration dates regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">✓</span>
                  <span>Consult your doctor before stopping</span>
                </li>
              </ul>
            </div>

            {/* Current Time */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 text-white text-center">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm opacity-90 mt-1">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
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

export default MedicationReminder;
