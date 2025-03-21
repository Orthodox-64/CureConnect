//booking model 

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CalendarCheck, UserPlus, X, Check, Video } from 'lucide-react';
import { useDispatch } from "react-redux"
import { createAppointment, clearErrors } from '../../actions/appointmentActions';

const BookingModal = ({ doctor, isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [description, setDescription] = useState('');
    const [online, setOnline] = useState(false);
    const [step, setStep] = useState(1);

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

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative animate-fadeIn shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Appointment</h2>
                    <div className="flex items-center">
                        <img
                            src={"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"}
                            alt={doctor.name}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                            <p className="font-medium text-gray-900">{doctor.name}</p>
                            <p className="text-sm text-indigo-600">{doctor.speciality}</p>
                        </div>
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="flex mb-8 justify-between">
                    <div className="flex flex-col items-center">
                        <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            <Calendar className="h-4 w-4" />
                        </div>
                        <span className="text-xs mt-1">Date</span>
                    </div>
                    <div className="w-20 h-px bg-gray-300 self-center"></div>
                    <div className="flex flex-col items-center">
                        <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            <Clock className="h-4 w-4" />
                        </div>
                        <span className="text-xs mt-1">Time</span>
                    </div>
                    <div className="w-20 h-px bg-gray-300 self-center"></div>
                    <div className="flex flex-col items-center">
                        <div className={`rounded-full w-8 h-8 flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                            <Check className="h-4 w-4" />
                        </div>
                        <span className="text-xs mt-1">Confirm</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={day}
                                onChange={(e) => setDay(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <div className="pt-4">
                                <button
                                    type="button"
                                    onClick={() => day ? setStep(2) : null}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${day ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                                    disabled={!day}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Time
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((slot) => (
                                    <button
                                        key={slot}
                                        type="button"
                                        onClick={() => setTime(slot)}
                                        className={`py-2 px-3 rounded-lg text-sm font-medium ${time === slot ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => time ? setStep(3) : null}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${time ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                                    disabled={!time}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Reason for Visit
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 h-24 resize-none"
                                    placeholder="Please describe your symptoms or reason for appointment..."
                                    required
                                />
                            </div>

                            <div className="bg-indigo-50 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">
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
                                <div className="flex items-center text-sm text-indigo-700">
                                    <Video className="h-4 w-4 mr-2" />
                                    <span>{online ? 'Virtual appointment via video call' : 'In-person appointment'}</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                <h3 className="font-medium text-gray-900 mb-2">Appointment Summary</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                        <span>{day}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                                        <span>{time}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2 text-indigo-500" />
                                        <span>{doctor.speciality}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Users className="h-4 w-4 mr-2 text-indigo-500" />
                                        <span>{doctor.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-300"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default BookingModal;