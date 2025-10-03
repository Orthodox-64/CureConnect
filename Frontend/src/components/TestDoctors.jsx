import React from 'react';
import DoctorCard from './DoctorCard';

const TestDoctors = () => {
    const mockDoctors = [
        {
            _id: '1',
            name: 'John Smith',
            speciality: 'Cardiology',
            availability: true,
            avatar: null
        },
        {
            _id: '2',
            name: 'Sarah Johnson',
            speciality: 'Dermatology',
            availability: true,
            avatar: null
        },
        {
            _id: '3',
            name: 'Michael Brown',
            speciality: 'Neurology',
            availability: false,
            avatar: null
        }
    ];

    const handleDoctorSelect = (doctorId) => {
        console.log('Selected doctor:', doctorId);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Test Doctors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDoctors.map(doctor => (
                    <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        isSelected={false}
                        onSelect={handleDoctorSelect}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestDoctors;
