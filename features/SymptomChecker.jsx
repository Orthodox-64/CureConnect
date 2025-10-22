import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, ChevronRight, Heart, Info, Thermometer, Users, Stethoscope, Brain, Eye, Ear, Bone, Droplet, Wind, Zap, XCircle, Search } from 'lucide-react';

const SymptomChecker = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const symptomCategories = [
    {
      name: 'General',
      icon: <Activity className="w-5 h-5" />,
      color: 'blue',
      symptoms: [
        { id: 'fever', name: 'Fever', severity: 'moderate' },
        { id: 'fatigue', name: 'Fatigue', severity: 'mild' },
        { id: 'weakness', name: 'Weakness', severity: 'mild' },
        { id: 'chills', name: 'Chills', severity: 'mild' },
        { id: 'sweating', name: 'Night Sweats', severity: 'mild' },
        { id: 'weight-loss', name: 'Unexplained Weight Loss', severity: 'moderate' }
      ]
    },
    {
      name: 'Respiratory',
      icon: <Wind className="w-5 h-5" />,
      color: 'cyan',
      symptoms: [
        { id: 'cough', name: 'Cough', severity: 'mild' },
        { id: 'shortness', name: 'Shortness of Breath', severity: 'severe' },
        { id: 'sore-throat', name: 'Sore Throat', severity: 'mild' },
        { id: 'congestion', name: 'Nasal Congestion', severity: 'mild' },
        { id: 'wheezing', name: 'Wheezing', severity: 'moderate' },
        { id: 'chest-pain', name: 'Chest Pain', severity: 'severe' }
      ]
    },
    {
      name: 'Digestive',
      icon: <Droplet className="w-5 h-5" />,
      color: 'green',
      symptoms: [
        { id: 'nausea', name: 'Nausea', severity: 'mild' },
        { id: 'vomiting', name: 'Vomiting', severity: 'moderate' },
        { id: 'diarrhea', name: 'Diarrhea', severity: 'moderate' },
        { id: 'constipation', name: 'Constipation', severity: 'mild' },
        { id: 'abdominal-pain', name: 'Abdominal Pain', severity: 'moderate' },
        { id: 'bloating', name: 'Bloating', severity: 'mild' }
      ]
    },
    {
      name: 'Cardiovascular',
      icon: <Heart className="w-5 h-5" />,
      color: 'red',
      symptoms: [
        { id: 'chest-pressure', name: 'Chest Pressure', severity: 'severe' },
        { id: 'palpitations', name: 'Heart Palpitations', severity: 'moderate' },
        { id: 'irregular-heartbeat', name: 'Irregular Heartbeat', severity: 'severe' },
        { id: 'dizziness', name: 'Dizziness', severity: 'moderate' },
        { id: 'fainting', name: 'Fainting', severity: 'severe' },
        { id: 'swollen-legs', name: 'Swollen Legs', severity: 'moderate' }
      ]
    },
    {
      name: 'Neurological',
      icon: <Brain className="w-5 h-5" />,
      color: 'purple',
      symptoms: [
        { id: 'headache', name: 'Headache', severity: 'mild' },
        { id: 'migraine', name: 'Migraine', severity: 'moderate' },
        { id: 'numbness', name: 'Numbness/Tingling', severity: 'moderate' },
        { id: 'confusion', name: 'Confusion', severity: 'severe' },
        { id: 'memory-loss', name: 'Memory Problems', severity: 'moderate' },
        { id: 'seizure', name: 'Seizures', severity: 'severe' }
      ]
    },
    {
      name: 'Musculoskeletal',
      icon: <Bone className="w-5 h-5" />,
      color: 'orange',
      symptoms: [
        { id: 'muscle-pain', name: 'Muscle Pain', severity: 'mild' },
        { id: 'joint-pain', name: 'Joint Pain', severity: 'moderate' },
        { id: 'back-pain', name: 'Back Pain', severity: 'mild' },
        { id: 'stiffness', name: 'Stiffness', severity: 'mild' },
        { id: 'swelling', name: 'Joint Swelling', severity: 'moderate' },
        { id: 'limited-movement', name: 'Limited Range of Motion', severity: 'moderate' }
      ]
    },
    {
      name: 'Vision & Hearing',
      icon: <Eye className="w-5 h-5" />,
      color: 'indigo',
      symptoms: [
        { id: 'blurred-vision', name: 'Blurred Vision', severity: 'moderate' },
        { id: 'eye-pain', name: 'Eye Pain', severity: 'moderate' },
        { id: 'hearing-loss', name: 'Hearing Loss', severity: 'moderate' },
        { id: 'ear-pain', name: 'Ear Pain', severity: 'mild' },
        { id: 'ringing', name: 'Ringing in Ears', severity: 'mild' },
        { id: 'vision-loss', name: 'Vision Loss', severity: 'severe' }
      ]
    },
    {
      name: 'Skin',
      icon: <Zap className="w-5 h-5" />,
      color: 'pink',
      symptoms: [
        { id: 'rash', name: 'Rash', severity: 'mild' },
        { id: 'itching', name: 'Itching', severity: 'mild' },
        { id: 'hives', name: 'Hives', severity: 'moderate' },
        { id: 'bruising', name: 'Easy Bruising', severity: 'moderate' },
        { id: 'discoloration', name: 'Skin Discoloration', severity: 'mild' },
        { id: 'lesions', name: 'Skin Lesions', severity: 'moderate' }
      ]
    }
  ];

  const getColorClasses = (color, selected = false) => {
    const colors = {
      blue: selected ? 'bg-blue-100 border-blue-500 text-blue-700' : 'bg-blue-50 border-blue-200 hover:border-blue-400',
      cyan: selected ? 'bg-cyan-100 border-cyan-500 text-cyan-700' : 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',
      green: selected ? 'bg-green-100 border-green-500 text-green-700' : 'bg-green-50 border-green-200 hover:border-green-400',
      red: selected ? 'bg-red-100 border-red-500 text-red-700' : 'bg-red-50 border-red-200 hover:border-red-400',
      purple: selected ? 'bg-purple-100 border-purple-500 text-purple-700' : 'bg-purple-50 border-purple-200 hover:border-purple-400',
      orange: selected ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-orange-50 border-orange-200 hover:border-orange-400',
      indigo: selected ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
      pink: selected ? 'bg-pink-100 border-pink-500 text-pink-700' : 'bg-pink-50 border-pink-200 hover:border-pink-400'
    };
    return colors[color] || colors.blue;
  };

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
  };

  const assessSymptoms = () => {
    if (selectedSymptoms.length === 0 || !severity || !duration) return null;

    const allSymptoms = symptomCategories.flatMap(cat => cat.symptoms);
    const selected = allSymptoms.filter(s => selectedSymptoms.includes(s.id));
    
    const hasSevere = selected.some(s => s.severity === 'severe');
    const hasModerate = selected.some(s => s.severity === 'moderate');
    
    let urgency, recommendation, color, icon;

    if (hasSevere || (severity === 'severe' && selectedSymptoms.length >= 2)) {
      urgency = 'Emergency';
      recommendation = 'Seek immediate medical attention. Visit the emergency room or call emergency services.';
      color = 'red';
      icon = <AlertTriangle className="w-8 h-8 text-red-600" />;
    } else if (hasModerate || (severity === 'moderate' && duration !== 'hours')) {
      urgency = 'Urgent Care';
      recommendation = 'Schedule an appointment with a healthcare provider within 24-48 hours.';
      color = 'orange';
      icon = <Thermometer className="w-8 h-8 text-orange-600" />;
    } else {
      urgency = 'Routine Care';
      recommendation = 'Monitor your symptoms. Schedule a regular appointment if symptoms persist or worsen.';
      color = 'green';
      icon = <CheckCircle2 className="w-8 h-8 text-green-600" />;
    }

    return { urgency, recommendation, color, icon, selectedSymptomsList: selected };
  };

  const handleCheckSymptoms = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setSeverity('');
    setDuration('');
    setShowResults(false);
    setSearchTerm('');
  };

  const results = assessSymptoms();

  const filteredCategories = symptomCategories.map(category => ({
    ...category,
    symptoms: category.symptoms.filter(symptom =>
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.symptoms.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-4 rounded-full">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Symptom Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Assess your symptoms and get guidance on when to seek medical care
          </p>
        </div>

        {!showResults ? (
          <div className="max-w-5xl mx-auto">
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Search Bar */}
              <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 pl-12 rounded-xl border-2 border-white focus:outline-none focus:ring-2 focus:ring-white text-lg"
                  />
                  <Search className="absolute left-4 top-5 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="p-8">
                {/* Symptom Categories */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Symptoms</h2>
                  
                  <div className="space-y-6">
                    {(searchTerm ? filteredCategories : symptomCategories).map((category) => (
                      <div key={category.name} className="border-2 border-gray-200 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <span className={`p-2 rounded-lg bg-${category.color}-100 mr-3`}>
                            {category.icon}
                          </span>
                          {category.name}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {category.symptoms.map((symptom) => (
                            <button
                              key={symptom.id}
                              onClick={() => toggleSymptom(symptom.id)}
                              className={`p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                                getColorClasses(category.color, selectedSymptoms.includes(symptom.id))
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{symptom.name}</span>
                                {selectedSymptoms.includes(symptom.id) && (
                                  <CheckCircle2 className="w-5 h-5" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {searchTerm && filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                      <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No symptoms found matching "{searchTerm}"</p>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Severity */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      How severe are your symptoms?
                    </label>
                    <div className="space-y-2">
                      {['mild', 'moderate', 'severe'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setSeverity(level)}
                          className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all duration-300 ${
                            severity === level
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-300 hover:border-teal-300'
                          }`}
                        >
                          {level.charAt(0).toUpperCase() + level.slice(1)} - {
                            level === 'mild' ? 'Uncomfortable but manageable' :
                            level === 'moderate' ? 'Interfering with daily activities' :
                            'Severe pain or distress'
                          }
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-3">
                      How long have you had these symptoms?
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'hours', label: 'A few hours' },
                        { value: 'days', label: '1-3 days' },
                        { value: 'week', label: 'About a week' },
                        { value: 'weeks', label: 'More than a week' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setDuration(option.value)}
                          className={`w-full p-4 border-2 rounded-xl text-left font-medium transition-all duration-300 ${
                            duration === option.value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-300 hover:border-emerald-300'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleCheckSymptoms}
                    disabled={selectedSymptoms.length === 0 || !severity || !duration}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    Check Symptoms
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </button>
                  
                  <button
                    onClick={handleReset}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                  >
                    Reset
                  </button>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> This tool provides general guidance only and is not a substitute for professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : results && (
          <div className="max-w-4xl mx-auto animate-fadeIn">
            {/* Results Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className={`bg-gradient-to-r from-${results.color}-500 to-${results.color}-600 p-8 text-white`}>
                <div className="flex items-center justify-center mb-4">
                  {results.icon}
                </div>
                <h2 className="text-3xl font-bold text-center mb-2">Assessment Result</h2>
                <p className="text-xl text-center opacity-90">{results.urgency}</p>
              </div>

              <div className="p-8">
                {/* Recommendation */}
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <Stethoscope className="w-6 h-6 mr-2 text-teal-600" />
                    Recommendation
                  </h3>
                  <p className="text-gray-700 text-lg">{results.recommendation}</p>
                </div>

                {/* Selected Symptoms Summary */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Your Symptoms</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {results.selectedSymptomsList.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="p-3 bg-teal-50 border border-teal-200 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-800">{symptom.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Severity Level</p>
                    <p className="text-lg font-bold text-gray-800 capitalize">{severity}</p>
                  </div>
                  <div className="p-4 bg-teal-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-lg font-bold text-gray-800 capitalize">{duration}</p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">What to Do Next</h3>
                  <ul className="space-y-3">
                    {results.urgency === 'Emergency' ? (
                      <>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Call emergency services immediately (911)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Visit the nearest emergency room</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Do not drive yourself if symptoms are severe</span>
                        </li>
                      </>
                    ) : results.urgency === 'Urgent Care' ? (
                      <>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Schedule a doctor's appointment within 24-48 hours</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Monitor symptoms and seek immediate care if they worsen</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Consider visiting an urgent care center if unavailable</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Monitor your symptoms over the next few days</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Rest, stay hydrated, and practice self-care</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">Schedule a routine appointment if symptoms persist or worsen</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Warning */}
                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl mb-8">
                  <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-red-800 mb-2">When to Seek Immediate Help</h4>
                      <p className="text-sm text-red-700">
                        Call emergency services if you experience: chest pain, difficulty breathing, severe bleeding, 
                        loss of consciousness, sudden severe headache, slurred speech, or symptoms of stroke.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Check Again
                  </button>
                </div>

                {/* Final Disclaimer */}
                <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-xl">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      This assessment is for informational purposes only and should not replace professional medical advice, 
                      diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SymptomChecker;
