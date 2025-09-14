import { FileX2, Activity, Brain, Microscope, Eye, HeartPulse, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleAnalysis = (type) => {
    navigate(`/analysis/${type}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            CureConnect Analysis
            <span className="block text-blue-600">Diagnostic Portal</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Advanced diagnostic tools powered by AI for precise medical analysis
          </p>
        </div>

        {/* Main Categories Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 mb-16">
          {/* General Disease Analysis Card */}
          <div 
            onClick={() => handleAnalysis('general')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <Stethoscope size={28} className="text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  General
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">General Disease Analysis</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive analysis for common medical conditions and symptoms
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Start Analysis
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Specific Disease Analysis Card */}
          <div 
            onClick={() => handleAnalysis('specific')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <Brain size={28} className="text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Specialized
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Specific Disease Analysis</h3>
              <p className="text-gray-600 mb-6">
                Specialized diagnostic tools for specific medical conditions
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                Start Analysis
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            This tool is designed to assist medical professionals. For accurate diagnosis, please consult with qualified healthcare providers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;