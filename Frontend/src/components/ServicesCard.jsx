import React from 'react';

const ServicesCard = () => {
  const services = [
    {
      id: 1,
      title: "WebRtc",
      description: "Low Bandwidth Video Calling ",
      image: "/webrtc.jpg"
    },
    {
      id: 2,
      title: "ECG analysis",
      description: "ECG Report at tip of your hands",
      image: "/ecg.png"
    },
    {
      id: 3,
      title: "Xray analysis",
      description: "XRAY report at tip of your hands",
      image: "/xray.png"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Reliable Services</h2>
        <div className="flex justify-center">
          <div className="h-1 w-32 bg-blue-500"></div>
          <div className="h-1 w-32 bg-blue-300 ml-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service) => (
          <div key={service.id} className="flex flex-col items-center text-center">
            <div className="mb-6">
              <img 
                src={service.image} 
                alt={service.title} 
                className="w-64 h-48 object-contain"
                
              />
            </div>
            <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesCard;