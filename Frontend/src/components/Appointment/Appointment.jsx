import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, CalendarCheck, UserPlus, Mail, Search } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, allDoctors } from '../../actions/appointmentActions';
import BookingModal from './BookingModal'


const Appointment = () => {
    const [activeTab, setActiveTab] = useState('book');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.user);
    const { loading, error, doctors } = useSelector((state) => state.allDoctors);

    useEffect(() => {
        if (error) {
            dispatch(clearErrors())
        }
        dispatch(allDoctors());

    }, [dispatch, error])

    const filteredDoctors = doctors?.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                    <p className="text-indigo-600 font-medium">Loading doctors...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-semibold text-indigo-800">MediConnect</span>
                        </div>
                        <div className="flex items-center">
                            <a href="/myappointments" 
                               className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-800 hover:bg-indigo-900 transition-all shadow-md hover:shadow-lg"
                            >
                                <CalendarCheck className="h-5 w-5 mr-2" />
                                My Appointments
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8">
                {activeTab === 'book' ? (
                    <div className="bg-white rounded-xl shadow-xl p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Available Specialists</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDoctors.map((doctor) => (
                                <div 
                                    key={doctor._id} 
                                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl 
                                             transition-all duration-500 transform hover:-translate-y-2 
                                             border border-gray-100"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center space-x-6">
                                            <img
                                                src={"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"}
                                                alt={doctor.name}
                                                className="w-24 h-24 rounded-full object-cover 
                                                         border-4 border-white shadow-lg 
                                                         ring-2 ring-blue-500/20"
                                            />
                                            <div className="flex-grow">
                                                <h2 className="text-xl font-bold text-gray-900 mb-3">{doctor.name}</h2>
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-gray-600 text-sm 
                                                                bg-gray-50 rounded-lg px-3 py-2">
                                                        <Mail className="h-4 w-4 mr-2 text-blue-900" />
                                                        <span className="truncate">{doctor.contact}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600 text-sm 
                                                                bg-gray-50 rounded-lg px-3 py-2">
                                                        <MapPin className="h-4 w-4 mr-2 text-blue-900" />
                                                        <span className="font-medium">{doctor.speciality}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); setSelectedDoctor(doctor); }}
                                            className="mt-6 w-full bg-gradient-to-r from-blue-900 to-blue-700 
                                                     text-white py-3 px-6 rounded-xl text-sm font-semibold 
                                                     hover:from-blue-700 hover:to-blue-800 transition-all duration-300 
                                                     transform hover:scale-[1.02] shadow-md hover:shadow-lg 
                                                     flex items-center justify-center space-x-2"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            <span>Book Appointment</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredDoctors.length === 0 && (
                            <div className="text-center py-16">
                                <MapPin className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
                                <p className="text-gray-500">Try adjusting your search or explore all available specialists</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md p-8 max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Appointments</h1>
                        <p className="text-gray-600 text-center">No appointments scheduled yet.</p>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-12 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-500 text-sm">
                        <p>© 2025 MediConnect. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    isOpen={true}
                    onClose={() => setSelectedDoctor(null)}
                />
            )}
        </div>
    );
};

export default Appointment;