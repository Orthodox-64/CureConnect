import { Stethoscope } from 'lucide-react';

function Header() {
  return (
    <div className="flex items-center justify-center mb-8">
      <Stethoscope className="w-8 h-8 text-blue-600 mr-2" />
      <h1 className="text-3xl font-bold text-gray-800">MedicalVision AI Assistant</h1>
    </div>
  );
}

export default Header;