import React, { useState } from "react";
import {
  Stethoscope,
  Star,
  Clock,
  CheckCircle,
  Building2,
  Award,
  HeartPulse,
} from "lucide-react";
import { hasValidAvatar } from "../utils/avatarUtils";

const DoctorCard = ({ doctor, isSelected, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Generate initials from doctor name
  const getInitials = (name) => {
    if (!name) return "D";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div
      onClick={() => onSelect(doctor._id)}
      className={`relative cursor-pointer transition-all duration-300 transform ${
        isSelected
          ? "ring-2 ring-blue-500 bg-blue-50 scale-105"
          : "hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="relative h-36 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col items-center justify-center">
          {hasValidAvatar(doctor.avatar) && !imageError ? (
            <img
              src={doctor.avatar.url}
              alt={doctor.name}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
              onError={handleImageError}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm border border-white/40">
              <span className="text-2xl font-bold text-white">
                {getInitials(doctor.name)}
              </span>
            </div>
          )}

          <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
            <Stethoscope className="w-3 h-3" /> Verified
          </div>

          {isSelected && (
            <div className="absolute top-3 right-3 bg-blue-600 p-2 rounded-full shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Doctor Info */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Dr. {doctor.name}
            </h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>

          <p className="text-sm text-indigo-600 font-medium">
            {doctor.speciality}
          </p>

          {/* Tagline */}
          <p className="text-xs italic text-gray-500">
            "Compassionate Care, Expert Hands"
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {doctor.experience || "10"} yrs Experience
            </span>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              <Building2 className="w-3 h-3 inline mr-1" />
              {doctor.hospital || "City Health Center"}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center mt-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
              />
            ))}
            <span className="text-sm text-gray-600 ml-2">4.8</span>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  doctor.availability ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-gray-600">
                {doctor.availability ? "Available" : "Busy"}
              </span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              <span>30 min</span>
            </div>
          </div>

          {/* Specialty Icons */}
          <div className="flex items-center justify-between pt-3 border-t mt-3">
            <div className="flex items-center gap-1 text-pink-500 text-xs">
              <HeartPulse className="w-4 h-4" />
              Cardiac Care
            </div>
            <div className="text-xs text-gray-400">#TrustedDoctor</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
