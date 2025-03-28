import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CalendarCheck, UserPlus, X, Check, Video, CreditCard, ChevronRight, ChevronLeft, AlertCircle, Lock } from 'lucide-react';
import { useDispatch } from "react-redux"
import { createAppointment, clearErrors } from '../../actions/appointmentActions';

const BookingModal = ({ doctor, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [online, setOnline] = useState(false);
    const [step, setStep] = useState(1);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createAppointment(doctor._id, day, time, description));
        onClose();
    };

    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"
    ];

    // Calculate min date (today) for date picker
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];

    const handlePayment = () => {
        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setPaymentStatus('success');
            
            // Submit the appointment after successful payment
            dispatch(createAppointment(doctor._id, day, time, description));
            
            // Close modal after a delay
            setTimeout(() => {
                onClose();
            }, 2000);
        }, 2000);
    };

    const formatCardNumber = (value) => {
        // Remove all non-digit characters
        const digitsOnly = value.replace(/\D/g, '');
        // Format with spaces after every 4 digits
        let formatted = '';
        for (let i = 0; i < digitsOnly.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formatted += ' ';
            }
            formatted += digitsOnly[i];
        }
        return formatted.slice(0, 19); // Limit to 16 digits + 3 spaces
    };

    const handleCardNumberChange = (e) => {
        const formattedValue = formatCardNumber(e.target.value);
        setCardNumber(formattedValue);
    };

    const handleExpiryChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 2) {
            setCardExpiry(value);
        } else if (value.length <= 4) {
            setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full relative animate-fadeIn shadow-2xl overflow-hidden max-h-[90vh]">
                {/* Modal header with gradient background */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white sticky top-0 z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-5 right-5 text-white/80 hover:text-white rounded-full p-1 transition-colors bg-white/10 hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <h2 className="text-2xl font-bold mb-2">Book Appointment</h2>
                    <div className="flex items-center">
                        <div className="bg-white/10 rounded-full p-2 mr-3">
                            <img
                                src={"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"}
                                alt={doctor.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="font-medium text-white">{doctor.name}</p>
                            <p className="text-sm text-indigo-200">{doctor.speciality}</p>
                        </div>
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="relative px-6 pt-6 pb-2 sticky top-[108px] bg-white z-10">
                    <div className="absolute top-[1.9rem] left-[3.75rem] h-[1px] w-[calc(100%-7.5rem)] bg-gray-200 -z-10"></div>
                    <div className="flex justify-between">
                        <div className="flex flex-col items-center">
                            <div className={`rounded-full w-9 h-9 flex items-center justify-center ${
                                step >= 1 
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                    : 'bg-gray-100 text-gray-400'
                            } transition-all duration-300`}>
                                <Calendar className="h-4 w-4" />
                            </div>
                            <span className={`text-xs mt-1.5 font-medium ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>Date</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className={`rounded-full w-9 h-9 flex items-center justify-center ${
                                step >= 2 
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                    : 'bg-gray-100 text-gray-400'
                            } transition-all duration-300`}>
                                <Clock className="h-4 w-4" />
                            </div>
                            <span className={`text-xs mt-1.5 font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>Time</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className={`rounded-full w-9 h-9 flex items-center justify-center ${
                                step >= 3 
                                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-200' 
                                    : 'bg-gray-100 text-gray-400'
                            } transition-all duration-300`}>
                                <CreditCard className="h-4 w-4" />
                            </div>
                            <span className={`text-xs mt-1.5 font-medium ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>Payment</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-200px)]" style={{ scrollbarWidth: 'thin' }}>
                    <form onSubmit={handleSubmit} className="px-6 pb-6">
                        {step === 1 && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="bg-blue-50 rounded-xl p-4 mb-4 text-blue-700 text-sm">
                                    <div className="flex">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0 mr-2" />
                                        <p>Choose your preferred date for the appointment. Our schedule is available for the next 30 days.</p>
                                    </div>
                                </div>
                                
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={day}
                                    onChange={(e) => setDay(e.target.value)}
                                    min={minDate}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                                    required
                                />
                                <div className="pt-4">
                                    <button
                                        type="button"
                                        onClick={() => day ? setStep(2) : null}
                                        className={`w-full py-3.5 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                                            day 
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-indigo-100/50' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!day}
                                    >
                                        Continue 
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-fadeIn">
                                <div className="bg-blue-50 rounded-xl p-4 mb-4 text-blue-700 text-sm">
                                    <div className="flex">
                                        <Clock className="h-5 w-5 flex-shrink-0 mr-2" />
                                        <p>Available time slots for <span className="font-medium">{day}</span>. Choose a time that works best for you.</p>
                                    </div>
                                </div>
                                
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Time
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {timeSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            type="button"
                                            onClick={() => setTime(slot)}
                                            className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                                                time === slot 
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-4 flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3.5 px-6 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                                    >
                                        <ChevronLeft className="mr-2 h-5 w-5" />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => time ? setStep(3) : null}
                                        className={`flex-1 py-3.5 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                                            time 
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-indigo-100/50' 
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!time}
                                    >
                                        Continue
                                        <ChevronRight className="ml-2 h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-5 animate-fadeIn">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason for Visit
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 resize-none transition-all duration-300"
                                        placeholder="Please describe your symptoms or reason for appointment..."
                                        required
                                    />
                                </div>

                                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center">
                                            <Video className="h-4 w-4 mr-2 text-indigo-600" />
                                            Telemedicine Appointment
                                        </label>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={online}
                                                onChange={() => setOnline(!online)}
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                    <div className="text-sm text-indigo-700 bg-white/60 p-2 rounded-lg">
                                        {online ? 'Virtual appointment via video call' : 'In-person appointment at the clinic'}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <Check className="h-4 w-4 mr-2 text-indigo-600" />
                                        Appointment Summary
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center text-gray-600 bg-white p-2 rounded-lg">
                                            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                            <span>{day}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 bg-white p-2 rounded-lg">
                                            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                                            <span>{time}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 bg-white p-2 rounded-lg">
                                            <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                                            <span>{doctor.speciality}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 bg-white p-2 rounded-lg">
                                            <Users className="h-4 w-4 mr-2 text-indigo-500" />
                                            <span>{doctor.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment UI - Similar to screenshot */}
                                <div className="mt-4">
                                    <div className="bg-blue-600 p-4 rounded-t-xl flex justify-between items-center">
                                        <h3 className="font-bold text-white text-lg">Complete Payment</h3>
                                        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                                            ₹200
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white p-4 rounded-b-xl border-x border-b border-gray-200">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Card Information
                                            </label>
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    placeholder="Card number"
                                                    value={cardNumber}
                                                    onChange={handleCardNumberChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    value={cardExpiry}
                                                    onChange={handleExpiryChange}
                                                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">All card information is securely processed by Stripe.</p>
                                        </div>
                                        
                                        <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm text-blue-700">
                                            <div className="font-medium mb-1">Test Card Details</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    Card number: <span className="font-mono bg-white px-1 py-0.5 rounded">4242 4242 4242 4242</span>
                                                </div>
                                                <div>
                                                    Expiry: <span className="font-mono bg-white px-1 py-0.5 rounded">Any future date</span>
                                                </div>
                                                <div className="col-span-2">
                                                    CVC: <span className="font-mono bg-white px-1 py-0.5 rounded">Any 3 digits</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <h4 className="font-medium text-gray-700 mb-2">Payment Summary</h4>
                                            <div className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-200">
                                                <span className="text-gray-600">Consultation fee</span>
                                                <span className="font-medium">₹200</span>
                                            </div>
                                            <div className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-200">
                                                <span className="text-gray-600">Taxes & fees</span>
                                                <span className="font-medium">₹0</span>
                                            </div>
                                            <div className="flex justify-between font-medium">
                                                <span>Total</span>
                                                <span>₹200</span>
                                            </div>
                                        </div>
                                        
                                        <div className="pt-2 flex space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setStep(2)}
                                                className="flex-1 py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 flex items-center justify-center"
                                            >
                                                <ChevronLeft className="mr-2 h-5 w-5" />
                                                Back
                                            </button>
                                            
                                            <button
                                                type="button"
                                                disabled={isProcessing || !cardNumber || !cardExpiry}
                                                onClick={handlePayment}
                                                className="flex-1 py-3 px-6 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition-all duration-300 flex items-center justify-center shadow-md"
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="h-4 w-4 mr-2" />
                                                        Pay ₹200 Securely
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        
                                        {paymentStatus === 'success' && (
                                            <div className="mt-4 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 flex items-start">
                                                <div className="bg-green-100 rounded-full p-1 mr-2">
                                                    <Check className="h-4 w-4 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Payment successful!</p>
                                                    <p className="text-sm">Your appointment has been scheduled successfully.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;