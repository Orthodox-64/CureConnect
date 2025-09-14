import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './styles/chat.css';
import { useSelector, useDispatch } from 'react-redux';
import { UserCircle2, MessageSquare, Send, Mail, MapPin } from 'lucide-react';
import { allDoctors } from '../../actions/appointmentActions';

const Chat = () => {
    const { user } = useSelector((state) => state.user);
    const { doctors } = useSelector((state) => state.allDoctors);
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [joined, setJoined] = useState(false);
    const [socket, setSocket] = useState(null);
    const [currentRoom, setCurrentRoom] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io('https://agpatil.onrender.com/chat', {
            transports: ['websocket', 'polling']
        });

        setSocket(newSocket);

        // If user is a doctor, automatically join their email room
        if (user.role === 'doctor') {
            const doctorRoom = user.contact || user.email;
            console.log('Doctor joining room:', doctorRoom);
            newSocket.emit('join-room', doctorRoom);
            setJoined(true);
            setCurrentRoom(doctorRoom);
        } else {
            // If user is a patient, fetch available doctors
            dispatch(allDoctors());
        }

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => newSocket.disconnect();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        socket.on('message', (message) => {
            setMessages(prevMessages => [...prevMessages, message]);
        });

        socket.on('room-full', () => {
            alert('Room is full. Please try another room.');
            setJoined(false);
        });

        return () => {
            socket.off('message');
            socket.off('room-full');
        };
    }, [socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const joinDoctorRoom = (doctorEmail) => {
        socket.emit('join-room', doctorEmail);
        setJoined(true);
        setCurrentRoom(doctorEmail);
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        socket.emit('user-message', { roomId: currentRoom, text: message });
        setMessage('');
    };

    return (
        <div className="chat-container min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
            {!joined ? (
                user.role === 'patient' ? (
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-900">
                                Available Doctors
                            </span>
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {doctors && doctors.map((doctor) => (
                                <div 
                                    key={doctor._id} 
                                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                                >
                                    <div className="p-8">
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"}
                                                alt={doctor.name}
                                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-blue-500/20 mb-4"
                                            />
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
                                            <div className="space-y-2 w-full">
                                                <div className="flex items-center justify-center text-gray-600 text-sm bg-gray-50 rounded-lg px-4 py-2">
                                                    <Mail className="h-4 w-4 mr-2 text-blue-900" />
                                                    <span className="truncate">{doctor.contact}</span>
                                                </div>
                                                <div className="flex items-center justify-center text-gray-600 text-sm bg-gray-50 rounded-lg px-4 py-2">
                                                    <MapPin className="h-4 w-4 mr-2 text-blue-900" />
                                                    <span className="font-medium">{doctor.speciality}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => joinDoctorRoom(doctor.contact)}
                                            className="mt-6 w-full bg-gradient-to-r from-blue-900 to-blue-700 text-white py-3 px-6 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            <span>Start Consultation</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                        <p className="text-xl text-gray-600 bg-white p-8 rounded-lg shadow-md">Waiting for patients to connect...</p>
                    </div>
                )
            ) : (
                <div className="max-w-4xl mx-auto h-[80vh] p-4 flex flex-col">
                    <div className="bg-white rounded-xl shadow-xl flex-1 flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Telemedicine Chat</h2>
                                    <p className="text-blue-100 mt-1">Room: {currentRoom}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-lg">{user.name}</p>
                                    <p className="text-blue-100">
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        {user.specialization && ` - ${user.specialization}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === socket.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs md:max-w-md rounded-2xl p-4 shadow-md ${
                                            msg.sender === socket.id
                                                ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white'
                                                : 'bg-white text-gray-800'
                                        }`}
                                    >
                                        <p className="text-[15px] leading-relaxed">{msg.text}</p>
                                        <p className={`text-xs mt-2 ${msg.sender === socket.id ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {new Date().toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100">
                            <div className="flex space-x-3">
                                <input
                                    type="text"
                                    className="flex-1 rounded-lg border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 py-2.5"
                                    placeholder="Type your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;