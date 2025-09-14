import React, { useState } from 'react';
import { Stethoscope, Star, Clock, CheckCircle } from 'lucide-react';
import { hasValidAvatar } from '../utils/avatarUtils';

const DoctorCard = ({ doctor, isSelected, onSelect }) => {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
        setImageError(true);
    };


    // Generate initials from doctor name
    const getInitials = (name) => {
        if (!name) return "D";
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    return (
        <div
            onClick={() => onSelect(doctor._id)}
            className={`relative cursor-pointer transition-all duration-200 ${
                isSelected
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-lg hover:scale-105'
            }`}
        >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Doctor Image/Avatar */}
                <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    {hasValidAvatar(doctor.avatar) && !imageError ? (
                        <img
                            src={doctor.avatar.url}
                            alt={doctor.name}
                            className="w-20 h-20 rounded-full border-4 border-white object-cover"
                            onError={handleImageError}
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">
                                {getInitials(doctor.name)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Doctor Info */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Dr. {doctor.name}
                        </h3>
                        {isSelected && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                    </div>

                    <p className="text-sm text-blue-600 font-medium mb-2">
                        {doctor.speciality}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < 4 ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                    fill="currentColor"
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">4.8</span>
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div
                                className={`w-2 h-2 rounded-full mr-2 ${
                                    doctor.availability
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                }`}
                            />
                            <span className="text-xs text-gray-600">
                                {doctor.availability ? 'Available' : 'Busy'}
                            </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>30 min</span>
                        </div>
                    </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                    <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorCard;
