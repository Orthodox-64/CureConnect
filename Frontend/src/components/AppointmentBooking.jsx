import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Clock, User, Stethoscope, MessageSquare, AlertCircle, CheckCircle, Loader2, Brain, Search, Mic, MicOff, Trash2 } from 'lucide-react';
import { createAppointment, allDoctors, getAvailableSlots, clearErrors } from '../actions/appointmentActions';
import { generateSymptomAnalysis } from '../utils/geminiAI';
import { extractMedicalKeywords, MedicalSpeechRecognition, supportedLanguages } from '../utils/medicalKeywordExtractor';
import DoctorCard from './DoctorCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'react-toastify';

const AppointmentBooking = ({ onClose }) => {
    const dispatch = useDispatch();
    const { doctors, loading: doctorsLoading } = useSelector(state => state.allDoctors);
    const { loading: appointmentLoading, error, appointment } = useSelector(state => state.newAppointment);
    const { availableSlots, loading: slotsLoading } = useSelector(state => state.availableSlots || {});

    const [formData, setFormData] = useState({
        doctor: '',
        description: '',
        symptoms: '',
        day: '',
        time: ''
    });

    const [selectedDate, setSelectedDate] = useState('');
    const [isDateSelected, setIsDateSelected] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState('');
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    
    // Audio recording state
    const [speechRecognition, setSpeechRecognition] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioTranscript, setAudioTranscript] = useState('');
    const [fullAudioTranscript, setFullAudioTranscript] = useState(''); // Cumulative transcript for doctor
    const [extractedKeywords, setExtractedKeywords] = useState([]);
    const [showAudioSection, setShowAudioSection] = useState(false);
    const [recordingError, setRecordingError] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('en-US');

    useEffect(() => {
        dispatch(allDoctors());
        dispatch(clearErrors());
        
        // Initialize speech recognition
        const recognition = new MedicalSpeechRecognition(selectedLanguage);
        try {
            recognition.initialize(selectedLanguage);
            recognition.onResult = handleSpeechResult;
            recognition.onError = handleSpeechError;
            recognition.onEnd = handleSpeechEnd;
            setSpeechRecognition(recognition);
            console.log('Speech recognition initialized successfully');
        } catch (error) {
            console.error('Speech recognition not available:', error);
            setRecordingError('Speech recognition is not supported in this browser');
        }
        
        return () => {
            if (recognition && recognition.isRecording()) {
                recognition.stop();
            }
        };
    }, [dispatch]);


    useEffect(() => {
        if (appointment) {
            onClose();
        }
    }, [appointment, onClose]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearErrors());
        }
    }, [error, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // If doctor is selected and date is selected, fetch available slots
        if (name === 'doctor' && selectedDate) {
            dispatch(getAvailableSlots(value, selectedDate));
        }

        // Generate AI suggestions when symptoms change
        if (name === 'symptoms' && value.length > 20) {
            generateAISuggestions(value);
        }
    };

    const generateAISuggestions = async (symptoms) => {
        if (!symptoms || symptoms.length < 20) return;
        
        setIsGeneratingAI(true);
        try {
            const suggestions = await generateSymptomAnalysis(symptoms);
            setAiSuggestions(suggestions);
        } catch (error) {
            console.error('Error generating AI suggestions:', error);
            setAiSuggestions('');
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // Speech recognition handlers
    const handleSpeechResult = (result) => {
        const { finalTranscript, interimTranscript } = result;
        const currentTranscript = finalTranscript || interimTranscript;
        
        // Always update the audio transcript for internal tracking
        setAudioTranscript(currentTranscript);
        
        if (finalTranscript && finalTranscript.trim()) {
            // Update full audio transcript for doctor's reference
            setFullAudioTranscript(prev => {
                const newTranscript = prev 
                    ? `${prev.trim()} ${finalTranscript.trim()}` 
                    : finalTranscript.trim();
                return newTranscript;
            });
            
            // Extract medical keywords from the final transcript
            const keywordData = extractMedicalKeywords(finalTranscript, selectedLanguage);
            setExtractedKeywords(keywordData.extractedKeywords);
            
            // Update symptoms field with the transcript - add space and new content
            setFormData(prev => {
                const newSymptoms = prev.symptoms 
                    ? `${prev.symptoms.trim()} ${finalTranscript.trim()}` 
                    : finalTranscript.trim();
                return {
                    ...prev,
                    symptoms: newSymptoms
                };
            });
            
            // Generate AI suggestions if we have enough content
            if (finalTranscript.length > 20) {
                generateAISuggessions(finalTranscript);
            }
            
            // Show success message
            toast.success('Speech converted to text and added to symptoms!');
        }
    };

    const handleSpeechError = (error) => {
        console.error('Speech recognition error:', error);
        setRecordingError(`Recording error: ${error}`);
        setIsRecording(false);
        toast.error('Speech recognition failed. Please try again.');
    };

    const handleSpeechEnd = () => {
        setIsRecording(false);
    };

    const startRecording = () => {
        if (!speechRecognition) {
            toast.error('Speech recognition not available');
            return;
        }
        
        // Update language if changed
        if (speechRecognition.getLanguage() !== selectedLanguage) {
            speechRecognition.changeLanguage(selectedLanguage);
        }
        
        setRecordingError('');
        setAudioTranscript(''); // Clear current session transcript
        setIsRecording(true);
        
        try {
            speechRecognition.start();
            const selectedLang = supportedLanguages.find(lang => lang.code === selectedLanguage);
            toast.info(`Recording started in ${selectedLang?.name || 'English'}. Describe your symptoms...`);
        } catch (error) {
            console.error('Failed to start recording:', error);
            setRecordingError('Failed to start recording. Please try again.');
            setIsRecording(false);
            toast.error('Failed to start recording');
        }
    };

    const stopRecording = () => {
        if (speechRecognition && isRecording) {
            speechRecognition.stop();
            setIsRecording(false);
            toast.success('Recording stopped');
        }
    };

    const clearAudioData = () => {
        setAudioTranscript('');
        setFullAudioTranscript('');
        setExtractedKeywords([]);
        // Don't clear the symptoms field as user might want to keep the transcribed text
    };

    const handleDoctorSelect = (doctorId) => {
        const doctor = doctors.find(d => d._id === doctorId);
        setSelectedDoctor(doctor);
        setFormData(prev => ({
            ...prev,
            doctor: doctorId
        }));

        // If date is already selected, fetch available slots
        if (selectedDate) {
            dispatch(getAvailableSlots(doctorId, selectedDate));
        }
    };

    const filteredDoctors = doctors?.filter(doctor =>
        doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
        doctor.speciality.toLowerCase().includes(doctorSearchTerm.toLowerCase())
    ) || [];

    const handleDateChange = (e) => {
        const date = e.target.value;
        setSelectedDate(date);
        setIsDateSelected(true);
        setFormData(prev => ({
            ...prev,
            day: date,
            time: '' // Reset time when date changes
        }));

        // If doctor is already selected, fetch available slots
        if (formData.doctor) {
            dispatch(getAvailableSlots(formData.doctor, date));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Enhanced validation
        if (!formData.doctor) {
            toast.error('Please select a doctor');
            return;
        }
        
        if (!formData.day) {
            toast.error('Please select a date');
            return;
        }
        
        if (!formData.time) {
            toast.error('Please select a time slot');
            return;
        }
        
        if (!formData.description || formData.description.trim().length < 10) {
            toast.error('Please provide a detailed description (at least 10 characters)');
            return;
        }
        
        if (!formData.symptoms || formData.symptoms.trim().length < 10) {
            toast.error('Please describe your symptoms in detail (at least 10 characters)');
            return;
        }

        // Validate date is not in the past
        const selectedDate = new Date(formData.day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            toast.error('Please select a future date');
            return;
        }

        // Validate time is not in the past for today
        if (selectedDate.toDateString() === today.toDateString()) {
            const selectedTime = new Date(`${formData.day}T${formData.time}`);
            const now = new Date();
            
            if (selectedTime <= now) {
                toast.error('Please select a future time slot');
                return;
            }
        }

        // Prepare symptoms with extracted keywords
        let symptomsWithKeywords = formData.symptoms;
        if (extractedKeywords.length > 0) {
            symptomsWithKeywords += `\n\n[Medical Keywords Extracted]: ${extractedKeywords.join(', ')}`;
        }

        // Prepare audio transcript for doctor's reference
        const audioTranscriptForDoctor = fullAudioTranscript ? fullAudioTranscript.trim() : '';

        dispatch(createAppointment(
            formData.doctor,
            formData.day,
            formData.time,
            formData.description,
            symptomsWithKeywords,
            audioTranscriptForDoctor
        ));
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 30); // Allow booking up to 30 days in advance
        return maxDate.toISOString().split('T')[0];
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };


    return (
        <div className="modal-overlay fixed inset-0 bg-blue-900 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50" style={{ zIndex: 9999 }}>
            <div className="appointment-modal bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 relative" style={{ zIndex: 10000, backgroundColor: 'white' }}>
                <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <AlertCircle className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Doctor Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                <Stethoscope className="w-4 h-4 inline mr-2" />
                                Select Doctor
                            </label>
                            
                            {/* Doctor Search */}
                            <div className="mb-4">
                                <div className="relative">    
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />                                
                                    <input
                                        type="text"
                                        placeholder="Search doctors by name or specialty..."
                                        value={doctorSearchTerm}
                                        onChange={(e) => setDoctorSearchTerm(e.target.value)}
                                        className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                                    />
                                </div>
                            </div>



                            {/* Doctor Grid */}
                            {doctorsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                    <span className="ml-2 text-gray-600">Loading doctors...</span>
                                </div>
                            ) : doctors && doctors.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                                    {filteredDoctors.map(doctor => (
                                        <DoctorCard
                                            key={doctor._id}
                                            doctor={doctor}
                                            isSelected={formData.doctor === doctor._id}
                                            onSelect={handleDoctorSelect}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No doctors available at the moment</p>
                                    <p className="text-sm text-gray-400 mt-2">Please try again later</p>
                                </div>
                            )}

                            {filteredDoctors.length === 0 && !doctorsLoading && doctors && doctors.length > 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Stethoscope className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                    <p>No doctors found matching your search</p>
                                    <p className="text-sm text-gray-400 mt-2">Try a different search term</p>
                                </div>
                            )}
                        </div>

                        {/* Date Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={getMinDate()}
                                max={getMaxDate()}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                                required
                            />
                        </div>

                        {/* Time Selection */}
                        {isDateSelected && formData.doctor && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Select Time Slot
                                </label>
                                {slotsLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                                        <span className="ml-2 text-gray-600">Loading available slots...</span>
                                    </div>
                                ) : availableSlots?.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                                        {availableSlots.map(slot => (
                                            <button
                                                key={slot}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, time: slot }))}
                                                className={`p-3 text-sm rounded-lg border transition-colors ${
                                                    formData.time === slot
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                                                }`}
                                            >
                                                {formatTime(slot)}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                        <p>No available slots for this date</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                Appointment Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Briefly describe the reason for your appointment..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900"
                                required
                            />
                        </div>

                        {/* Audio Recording Section */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Mic className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-purple-800">Voice Recording</h4>
                                        <p className="text-sm text-purple-600">Record your symptoms for accurate extraction</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAudioSection(!showAudioSection)}
                                    className="text-purple-600 hover:text-purple-800 transition-colors"
                                >
                                    {showAudioSection ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {showAudioSection && (
                                <div className="space-y-4">
                                    {/* Language Selection */}
                                    <div className="bg-white border border-purple-200 rounded-lg p-4">
                                        <label className="block text-sm font-medium text-purple-800 mb-2">
                                            Select Recording Language
                                        </label>
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            disabled={isRecording}
                                            className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        >
                                            {supportedLanguages.map((lang) => (
                                                <option key={lang.code} value={lang.code}>
                                                    {lang.flag} {lang.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-purple-600 mt-1">
                                            {isRecording ? 'Cannot change language while recording' : 'Choose your preferred language for voice input'}
                                        </p>
                                    </div>

                                    {/* Recording Controls */}
                                    <div className="flex items-center space-x-4">
                                        {!isRecording ? (
                                            <button
                                                type="button"
                                                onClick={startRecording}
                                                disabled={!speechRecognition || recordingError}
                                                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Mic className="w-4 h-4" />
                                                <span>Start Recording</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={stopRecording}
                                                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors animate-pulse"
                                            >
                                                <MicOff className="w-4 h-4" />
                                                <span>Stop Recording</span>
                                            </button>
                                        )}

                                        {extractedKeywords.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={clearAudioData}
                                                className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Clear Keywords</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Recording Status */}
                                    {isRecording && (
                                        <div className="flex items-center space-x-2 text-red-600">
                                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium">Recording... Speak clearly about your symptoms</span>
                                        </div>
                                    )}

                                    {/* Live transcript preview */}
                                    {audioTranscript && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-sm text-blue-800 font-medium mb-1">Live transcript:</p>
                                            <p className="text-sm text-blue-700 italic">"{audioTranscript}"</p>
                                            <p className="text-xs text-blue-600 mt-1">This will be added to your symptoms when recording stops</p>
                                        </div>
                                    )}

                                    {/* Full audio transcript for doctor's reference */}
                                    {fullAudioTranscript && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                            <p className="text-sm text-green-800 font-medium mb-1">Complete voice recording for doctor:</p>
                                            <p className="text-sm text-green-700 italic">"{fullAudioTranscript}"</p>
                                            <p className="text-xs text-green-600 mt-1">This complete transcript will be visible to your doctor separately from symptoms</p>
                                        </div>
                                    )}

                                    {/* Error Display */}
                                    {recordingError && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                            <p className="text-red-800 text-sm">{recordingError}</p>
                                        </div>
                                    )}

                                    {/* Extracted Medical Keywords */}
                                    {extractedKeywords.length > 0 && (
                                        <div className="bg-white border border-purple-200 rounded-lg p-4">
                                            <h5 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                                                <Brain className="w-4 h-4 mr-2" />
                                                Extracted Medical Keywords ({extractedKeywords.length})
                                                <span className="ml-2 px-2 py-1 bg-purple-200 text-purple-700 rounded text-xs">
                                                    {supportedLanguages.find(lang => lang.code === selectedLanguage)?.flag} 
                                                    {supportedLanguages.find(lang => lang.code === selectedLanguage)?.name.split('(')[0].trim()}
                                                </span>
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {extractedKeywords.map((keyword, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium border border-purple-300"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                            <p className="text-xs text-purple-600 mt-2">
                                                These keywords will be highlighted for the doctor
                                            </p>
                                        </div>
                                    )}

                                    {/* Usage Instructions */}
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                        <h6 className="text-sm font-semibold text-purple-800 mb-2">How to use:</h6>
                                        <ul className="text-xs text-purple-700 space-y-1">
                                            <li>• Select your preferred language from the dropdown above</li>
                                            <li>• Click "Start Recording" and describe your symptoms clearly</li>
                                            <li>• Your speech will be converted to text and added directly to symptoms field</li>
                                            <li>• Medical terms will be automatically extracted and highlighted</li>
                                            <li>• These keywords will be visible to your doctor in the appointment</li>
                                            <li>• Supports 10 Indian languages including Hindi, Marathi, Kannada, Tamil, and more</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Symptoms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AlertCircle className="w-4 h-4 inline mr-2" />
                                Describe Your Symptoms
                                {extractedKeywords.length > 0 && (
                                    <span className="ml-2 text-xs text-purple-600 font-normal">
                                        ({extractedKeywords.length} medical keywords detected from audio)
                                    </span>
                                )}
                            </label>
                            <textarea
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleInputChange}
                                placeholder="Please describe your symptoms in detail. You can also use the voice recording feature above to automatically extract medical keywords..."
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white text-gray-900"
                                required
                            />
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm text-gray-500">
                                    Our AI will analyze your symptoms and provide helpful suggestions until your appointment.
                                </p>
                                {extractedKeywords.length > 0 && (
                                    <span className="text-xs text-purple-600 font-medium">
                                        Keywords extracted ✓
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* AI Suggestions */}
                        {aiSuggestions && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                        <Brain className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-blue-800">AI Health Suggestions</h4>
                                        <p className="text-sm text-blue-600">Based on your symptoms</p>
                                    </div>
                                </div>
                                <div className="prose prose-sm max-w-none prose-blue">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ children }) => <h1 className="text-lg font-semibold text-blue-800 mb-2">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-base font-semibold text-blue-800 mb-2">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-sm font-semibold text-blue-800 mb-1">{children}</h3>,
                                            p: ({ children }) => <p className="text-blue-700 mb-2 leading-relaxed">{children}</p>,
                                            ul: ({ children }) => <ul className="list-disc list-inside text-blue-700 mb-2 space-y-1">{children}</ul>,
                                            ol: ({ children }) => <ol className="list-decimal list-inside text-blue-700 mb-2 space-y-1">{children}</ol>,
                                            li: ({ children }) => <li className="text-blue-700">{children}</li>,
                                            strong: ({ children }) => <strong className="font-semibold text-blue-800">{children}</strong>,
                                            em: ({ children }) => <em className="italic text-blue-600">{children}</em>,
                                            code: ({ children }) => <code className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">{children}</code>,
                                            blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-300 pl-4 italic text-blue-600 my-2">{children}</blockquote>
                                        }}
                                    >
                                        {aiSuggestions}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        )}

                        {/* AI Loading State */}
                        {isGeneratingAI && (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-600 mr-2" />
                                    <span className="text-sm text-gray-600">AI is analyzing your symptoms...</span>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={appointmentLoading || !formData.doctor || !formData.day || !formData.time}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {appointmentLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Book Appointment
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

export default AppointmentBooking;
