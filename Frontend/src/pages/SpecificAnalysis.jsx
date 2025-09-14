import { FileX2, Activity, Brain, Microscope, Eye, HeartPulse, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import PETAnalysisModal from '../components/PETAnalysisModal';
import AlzheimerAnalysisModal from '../components/AlzheimerAnalysisModal';
import RetinopathyAnalysisModal from '../components/RetinopathyAnalysisModal';
import SkinAnalysisModal from '../components/SkinAnalysisModal';
import XRayAnalysisModal from '../components/XRayAnalysisModal';
import ECGAnalysisModal from '../components/ECGAnalysisModal';
import axios from 'axios';
import Header from '../components/Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector, useDispatch } from 'react-redux';
import { addMedicalHistory } from '../actions/userActions';
import Disclaimer from '../components/Disclaimer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import AnalysisResults from '../components/AnalysisResults';

function SpecificAnalysis() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPETModalOpen, setIsPETModalOpen] = useState(false);
  const [isAlzheimerModalOpen, setIsAlzheimerModalOpen] = useState(false);
  const [isRetinopathyModalOpen, setIsRetinopathyModalOpen] = useState(false);
  const [isSkinModalOpen, setIsSkinModalOpen] = useState(false);
  const [isXRayModalOpen, setIsXRayModalOpen] = useState(false);
  const [isECGModalOpen, setIsECGModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [logoImageData, setLogoImageData] = useState(null);
  const { user } = useSelector(state => state.user);
  const fileInputRef = useRef(null);
  const [isSimplified, setIsSimplified] = useState(false);
  const [emergencyLevel, setEmergencyLevel] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [showRedirect, setShowRedirect] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleAnalysis = (type) => {
    switch (type) {
      case 'pet':
        setIsPETModalOpen(true);
        break;
      case 'alzheimer':
        setIsAlzheimerModalOpen(true);
        break;
      case 'cancer':
        setIsPETModalOpen(true);
        break;
      case 'retinopathy':
        setIsRetinopathyModalOpen(true);
        break;
      case 'skin':
        setIsSkinModalOpen(true);
        break;
      case 'xray':
        setIsXRayModalOpen(true);
        break;
      case 'ecg':
        setIsECGModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(selectedImage);
      console.log(imageUrl);
      
      // Send to backend for analysis
      const response = await axios.post('http://172.31.4.177:5001/analyze', {
        image_url: imageUrl,
        prompt: "Analyze this medical image for any signs of disease or abnormalities. Focus on identifying key symptoms, patterns, and potential conditions. Assess the severity and progression of any detected conditions. Include an Emergency Level (1 for high emergency, 2 for moderate emergency, 3 for low emergency) based on the severity of symptoms observed."
      });

      setAnalysis(response.data.analysis);

      // Extract emergency level from the analysis
      const emergencyLevelMatch = response.data.analysis.match(/Emergency Level:\s*(\d)/i);
      const level = emergencyLevelMatch ? parseInt(emergencyLevelMatch[1]) : 3;
      setEmergencyLevel(level);
      setShowRedirect(true);

      // Update medical history
      if (user) {
        dispatch(addMedicalHistory(
          response.data.analysis,  // analysis parameter
          imageUrl                 // url parameter
        ));
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setAnalysis('Error during analysis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRedirect = () => {
    setIsRedirecting(true);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Handle routing based on emergency level
          if (emergencyLevel === 1) {
            navigate('https://tinyurl.com/4jdnrr5b');
          } else if (emergencyLevel === 2) {
            navigate('/telemedicine');
          } else if (emergencyLevel === 3) {
            navigate('/chat');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  const handleStayOnPage = () => {
    setShowRedirect(false);
    setCountdown(5);
    setIsRedirecting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Specific Disease
            <span className="block text-blue-600">Analysis Tools</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Specialized diagnostic tools for specific medical conditions
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
                  <Brain size={28} className="text-orange-600" />
                </div>
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  Neurology
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Alzheimer's Detection</h3>
              <p className="text-gray-600 mb-6">
                Early detection and analysis of Alzheimer's disease through advanced imaging
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

          {/* Retinopathy Detection Card */}
          <div 
            onClick={() => handleAnalysis('retinopathy')}
            className="relative group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <Eye size={28} className="text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  Ophthalmology
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Retinopathy Detection</h3>
              <p className="text-gray-600 mb-6">
                Advanced analysis of retinal images for early detection of diabetic retinopathy
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

      {/* Modals */}
      <PETAnalysisModal isOpen={isPETModalOpen} onClose={() => setIsPETModalOpen(false)} />
      <AlzheimerAnalysisModal isOpen={isAlzheimerModalOpen} onClose={() => setIsAlzheimerModalOpen(false)} />
      <RetinopathyAnalysisModal isOpen={isRetinopathyModalOpen} onClose={() => setIsRetinopathyModalOpen(false)} />
      <SkinAnalysisModal isOpen={isSkinModalOpen} onClose={() => setIsSkinModalOpen(false)} />
      <XRayAnalysisModal isOpen={isXRayModalOpen} onClose={() => setIsXRayModalOpen(false)} />
      <ECGAnalysisModal isOpen={isECGModalOpen} onClose={() => setIsECGModalOpen(false)} />

      {/* Emergency Level Modal */}
      {showRedirect && emergencyLevel && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Emergency Level Detected</h2>
            <div className={`text-4xl font-bold mb-4 ${
              emergencyLevel === 1 ? 'text-red-600' :
              emergencyLevel === 2 ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              Level {emergencyLevel}
            </div>
            <p className="text-gray-600 mb-4">
              {emergencyLevel === 1 ? 'High Emergency - Immediate attention required' :
               emergencyLevel === 2 ? 'Moderate Emergency - Prompt medical attention needed' :
               'Low Emergency - Routine care recommended'}
            </p>
            
            {!isRedirecting ? (
              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={handleRedirect}
                  className={`px-6 py-2 rounded-lg font-semibold text-white ${
                    emergencyLevel === 1 ? 'bg-red-600 hover:bg-red-700' :
                    emergencyLevel === 2 ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Proceed to {emergencyLevel === 1 ? 'Emergency' : 
                             emergencyLevel === 2 ? 'Telemedicine' : 
                             'Chat'}
                </button>
                <button
                  onClick={handleStayOnPage}
                  className="px-6 py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-700"
                >
                  Stay on Page
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-500">
                  Redirecting in {countdown} seconds...
                </p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-1000"
                      style={{
                        width: `${(countdown / 5) * 100}%`,
                        backgroundColor: emergencyLevel === 1 ? '#dc2626' :
                                        emergencyLevel === 2 ? '#d97706' :
                                        '#16a34a'
                      }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SpecificAnalysis; 