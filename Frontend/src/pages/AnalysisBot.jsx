import { FileX2, Activity, Brain, Microscope, Eye, HeartPulse, Stethoscope } from 'lucide-react';

function App() {
  const handleAnalysis = (type) => {
    window.location.href = `/analysis/${type}`;
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

        {/* Analysis Options Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* X-Ray Analysis Card */}
          <div 
            onClick={() => handleAnalysis('xray')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl">
                  <FileX2 size={28} className="text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  Radiology
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">X-Ray Analysis</h3>
              <p className="text-gray-600 mb-6">
                Advanced image processing for accurate X-ray diagnostics with AI-powered detection
              </p>
              <div className="flex items-center text-blue-600 font-semibold">
                Start Analysis
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* ECG Analysis Card */}
          <div 
            onClick={() => handleAnalysis('ecg')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-green-50 rounded-2xl">
                  <Activity size={28} className="text-green-600" />
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  Cardiology
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">ECG Analysis</h3>
              <p className="text-gray-600 mb-6">
                Real-time electrocardiogram analysis for comprehensive heart monitoring
              </p>
              <div className="flex items-center text-green-600 font-semibold">
                Start Analysis
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* PET Analysis Card */}
          <div 
            onClick={() => handleAnalysis('cancer')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <Brain size={28} className="text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Oncology
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">PET Analysis</h3>
              <p className="text-gray-600 mb-6">
                Advanced PET scan analysis for early cancer detection and monitoring
              </p>
              <div className="flex items-center text-purple-600 font-semibold">
                Start Analysis
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Alzheimer's & Dementia Early Detection Card */}
          <div 
            onClick={() => handleAnalysis('alzheimer')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-orange-50 rounded-2xl">
                  <Stethoscope size={28} className="text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  Neurology
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Alzheimer's Detection</h3>
              <p className="text-gray-600 mb-6">
                Early cognitive decline screening using advanced neurological pattern recognition
              </p>
              <div className="flex items-center text-orange-600 font-semibold">
                Start Analysis
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Skin Disease Classification Card */}
          <div 
            onClick={() => handleAnalysis('skin')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-rose-50 rounded-2xl">
                  <Microscope size={28} className="text-rose-600" />
                </div>
                <span className="text-sm font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                  Dermatology
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Skin Disease Analysis</h3>
              <p className="text-gray-600 mb-6">
                AI-powered skin lesion classification and potential disease identification
              </p>
              <div className="flex items-center text-rose-600 font-semibold">
                Start Analysis
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>

          {/* Diabetic Retinopathy Detection Card */}
          <div 
            onClick={() => handleAnalysis('retinopathy')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-teal-50 rounded-2xl">
                  <Eye size={28} className="text-teal-600" />
                </div>
                <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                  Ophthalmology
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Retinopathy Detection</h3>
              <p className="text-gray-600 mb-6">
                Advanced retinal screening for early diabetic eye disease detection
              </p>
              <div className="flex items-center text-teal-600 font-semibold">
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