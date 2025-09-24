import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeVideoWithSnapshot } from '../utils/videoSnapshot';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector, useDispatch } from 'react-redux';
import { addMedicalHistory } from '../actions/userActions';
import Header from '../components/Header';
import Disclaimer from '../components/Disclaimer';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyAerBoGRKAl_AMK4uGDG1re1u86sNxa28o");

const formatAnalysisResults = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return lines.map((line, index) => {
        // Remove asterisks and format based on content
        const cleanLine = line.replace(/\*\*/g, '');
        
        if (cleanLine.match(/^(Medical Condition|Confidence Score|Type|Affected Region|Recommendation|Additional Observations)/i)) {
            return {
                type: 'header',
                content: cleanLine
            };
        }
        return {
            type: 'content',
            content: cleanLine
        };
    });
};

const simplifyAnalysis = async (medicalAnalysis) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const prompt = `You are a medical translator who specializes in explaining complex medical terms in simple, easy-to-understand language. 
        Please convert this medical analysis into simple terms that someone without a medical background can understand.
        Keep the same structure but use everyday language. Here's the analysis:

        ${medicalAnalysis}

        Please provide the simplified version while maintaining the key information.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error simplifying analysis:", error);
        throw new Error("Failed to simplify the analysis. Please try again.");
    }
};

function AlzheimerVideoAnalysis() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [snapshotUrl, setSnapshotUrl] = useState(null);
    const [logoImageData, setLogoImageData] = useState(null);
    const [isSimplifying, setIsSimplifying] = useState(false);
    const [isSimplified, setIsSimplified] = useState(false);
    const { user } = useSelector(state => state.user);
    const fileInputRef = useRef(null);
    const [emergencyLevel, setEmergencyLevel] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const [showRedirect, setShowRedirect] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedVideo(file);
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        }
    };

    const resetAnalysis = () => {
        setSelectedVideo(null);
        setVideoPreview(null);
        setAnalysis(null);
        setSnapshotUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!selectedVideo) return;

        setIsAnalyzing(true);
        try {
            // Use the new snapshot-based analysis
            const result = await analyzeVideoWithSnapshot(selectedVideo, 'alzheimer', 2);
            
            setSnapshotUrl(result.imageUrl);
            setAnalysis(result.analysis);
            
            // Extract emergency level from the analysis
            const emergencyLevelMatch = result.analysis.match(/Emergency Level:\s*(\d)/i);
            const level = emergencyLevelMatch ? parseInt(emergencyLevelMatch[1]) : 0;
            setEmergencyLevel(level);
            // Only show redirect if there's an actual emergency (level > 0)
            if (level > 0) {
                setShowRedirect(true);
            }

            if (user) {
                dispatch(addMedicalHistory(
                    result.analysis, 
                    result.imageUrl               
                ));
            }
        } catch (error) {
            console.error('Error during analysis:', error);
            setAnalysis('Error during analysis. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSimplify = async () => {
        if (!analysis) return;
        
        setIsSimplifying(true);
        try {
            const simplifiedAnalysis = await simplifyAnalysis(analysis);
            setAnalysis(simplifiedAnalysis);
            setIsSimplified(true);
        } catch (error) {
            console.error("Error simplifying analysis:", error);
            alert("Failed to simplify the analysis. Please try again.");
        } finally {
            setIsSimplifying(false);
        }
    };

    const generatePDF = () => {
        if (!analysis) {
            alert('No analysis data available');
            return;
        }

        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            let yPosition = 30; // Starting y position

            // Add header with logo
            if (logoImageData) {
                doc.addImage(logoImageData, 'PNG', margin, 10, 30, 30);
                yPosition = 50; // Adjust y position after logo
            }

            // Add title
            doc.setFontSize(20);
            doc.setTextColor(41, 128, 185);
            doc.text('Alzheimer\'s Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 20;

            // Add patient info
            doc.setFontSize(12);
            doc.setTextColor(44, 62, 80);
            doc.text(`Patient Name: ${user?.name || 'Not logged in'}`, margin, yPosition);
            yPosition += 10;
            doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
            yPosition += 10;
            doc.text(`Time: ${new Date().toLocaleTimeString()}`, margin, yPosition);
            yPosition += 20;

            // Add analysis results
            doc.setFontSize(14);
            doc.setTextColor(41, 128, 185);
            doc.text('AI Analysis Results:', margin, yPosition);
            yPosition += 10;

            // Add analysis text with proper formatting
            doc.setFontSize(12);
            doc.setTextColor(44, 62, 80);
            const splitText = doc.splitTextToSize(analysis, contentWidth);
            
            // Add text with page breaks
            for (let i = 0; i < splitText.length; i++) {
                if (yPosition > doc.internal.pageSize.getHeight() - 20) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(splitText[i], margin, yPosition);
                yPosition += 7;
            }

            // Add footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(10);
                doc.setTextColor(128, 128, 128);
                doc.text(
                    'Generated by CureConnect - Your Health, Our Priority',
                    pageWidth / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            // Save the PDF
            doc.save(`alzheimers_analysis_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF report');
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
                        navigate('/chat'); // Beginner level - chat support
                    } else if (emergencyLevel === 2) {
                        navigate('/telemedicine'); // Intermediate level - telemedicine
                    } else if (emergencyLevel === 3) {
                        navigate('https://tinyurl.com/4jdnrr5b'); // High level - emergency
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
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Header />
                
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    {/* Video Upload Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Video for Analysis</h2>
                        
                        {!videoPreview ? (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={handleVideoUpload}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                                >
                                    Select Video
                                </button>
                                <p className="mt-2 text-gray-500">Supported formats: MP4, MOV, AVI</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <video 
                                    src={videoPreview} 
                                    controls
                                    className="max-h-64 max-w-full mb-4 rounded-lg shadow-md" 
                                />
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={handleUploadAndAnalyze} 
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? "Analyzing..." : "Analyze Video"}
                                    </button>
                                    <button 
                                        onClick={resetAnalysis} 
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                                            {/* Snapshot Preview Section */}
                        {snapshotUrl && (
                            <div className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                    </svg>
                                    <h2 className="text-xl font-semibold text-gray-700 ml-2">Captured Snapshot</h2>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-inner">
                                    <img 
                                        src={snapshotUrl} 
                                        alt="Video snapshot" 
                                        className="max-w-full h-auto rounded-lg mx-auto"
                                        style={{ maxHeight: '400px' }}
                                    />
                                    <p className="text-sm text-gray-500 mt-2 text-center">
                                        Snapshot captured at 2 seconds and analyzed with AI
                                    </p>
                                </div>
                            </div>
                        )}


                    
                    {/* Analysis Results Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <h2 className="text-xl font-semibold text-gray-700 ml-2">Analysis Results</h2>
                            </div>
                            {analysis && (
                                <div className="flex gap-3">
                                    {!isSimplified ? (
                                        <button
                                            onClick={handleSimplify}
                                            disabled={isSimplifying}
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isSimplifying ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Simplifying...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    Simplify Terms
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setAnalysis(analysis);
                                                setIsSimplified(false);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Show Medical Terms
                                        </button>
                                    )}
                                    <button
                                        onClick={generatePDF}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download Report
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center py-10">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600">Processing your video...</p>
                            </div>
                        ) : analysis ? (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div className="space-y-4">
                                    {formatAnalysisResults(analysis).map((item, index) => (
                                        <div key={index} className={item.type === 'header' ? 'border-b border-gray-200 pb-2 mb-2' : ''}>
                                            {item.type === 'header' ? (
                                                <div className="flex items-start gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-800">
                                                            {item.content.split(':')[0]}
                                                        </h3>
                                                        <p className="text-gray-700 mt-1">
                                                            {item.content.split(':')[1]?.trim() || ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-600 pl-4">
                                                    {item.content}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-10">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500">Upload a video to receive analysis</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <Disclaimer />

                {showRedirect && emergencyLevel && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Emergency Level Detected</h2>
                            <div className={`text-4xl font-bold mb-4 ${
                                emergencyLevel === 1 ? 'text-green-600' :
                                emergencyLevel === 2 ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                                Level {emergencyLevel}
                            </div>
                            <p className="text-gray-600 mb-4">
                                {emergencyLevel === 1 ? 'Beginner Level - Minor issues, routine care recommended' :
                                 emergencyLevel === 2 ? 'Intermediate Level - Moderate concerns, prompt attention needed' :
                                 'High Level - Serious conditions, immediate attention required'}
                            </p>
                            
                            {!isRedirecting ? (
                                <div className="flex gap-4 justify-center mt-6">
                                    <button
                                        onClick={handleRedirect}
                                        className={`px-6 py-2 rounded-lg font-semibold text-white ${
                                            emergencyLevel === 1 ? 'bg-green-600 hover:bg-green-700' :
                                            emergencyLevel === 2 ? 'bg-yellow-600 hover:bg-yellow-700' :
                                            'bg-red-600 hover:bg-red-700'
                                        }`}
                                    >
                                        Proceed to {emergencyLevel === 1 ? 'Chat' : 
                                                   emergencyLevel === 2 ? 'Telemedicine' : 
                                                   'Emergency'}
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
                                                    backgroundColor: emergencyLevel === 1 ? '#16a34a' :
                                                                    emergencyLevel === 2 ? '#d97706' :
                                                                    '#dc2626'
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
        </div>
    );
}

export default AlzheimerVideoAnalysis; 