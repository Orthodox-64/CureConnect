import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector, useDispatch } from 'react-redux';
import { addMedicalHistory } from '../actions/userActions';
import Disclaimer from '../components/Disclaimer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import AnalysisResults from '../components/AnalysisResults';
import { useNavigate } from 'react-router-dom';
import { analyzeVideoWithSnapshot } from '../utils/videoSnapshot';

const genAI = new GoogleGenerativeAI("AIzaSyAerBoGRKAl_AMK4uGDG1re1u86sNxa28o");

function CancerVideoAnalysis() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isSimplifying, setIsSimplifying] = useState(false);
    const [isSimplified, setIsSimplified] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [snapshotUrl, setSnapshotUrl] = useState(null);
    const [logoImageData, setLogoImageData] = useState(null);
    const { user } = useSelector(state => state.user);
    const fileInputRef = useRef(null);
    const [emergencyLevel, setEmergencyLevel] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const [showRedirect, setShowRedirect] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Load logo image when component mounts
    useEffect(() => {
        const loadLogo = async () => {
            try {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = '/logo.png';

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/png');
                    setLogoImageData(dataURL);
                };
            } catch (error) {
                console.error('Error loading logo:', error);
            }
        };
        loadLogo();
    }, []);

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedVideo(file);
            const videoUrl = URL.createObjectURL(file);
            setVideoPreview(videoUrl);
        }
    };

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'teleconnect');

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dfwzeazkg/video/upload',
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!selectedVideo) return;

        setIsAnalyzing(true);
        try {
            // Use the new snapshot-based analysis
            const result = await analyzeVideoWithSnapshot(selectedVideo, 'cancer', 2);
            
            setSnapshotUrl(result.imageUrl);
            setAnalysis(result.analysis);
            setShowRedirect(true);

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

    const resetAnalysis = () => {
        setSelectedVideo(null);
        setVideoPreview(null);
        setAnalysis(null);
        setSnapshotUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const generatePDF = () => {
        if (!analysis) {
            alert("No analysis data available to generate PDF.");
            return;
        }

        try {
            // Create new PDF document
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let yPosition = margin;

            // Add sky blue background
            doc.setFillColor(208, 235, 255); // Light sky blue background
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // Add header with logo and title
            if (logoImageData) {
                try {
                    const logoWidth = 20;
                    const logoHeight = 20;
                    doc.addImage(logoImageData, 'PNG', margin, 10, logoWidth, logoHeight);
                } catch (error) {
                    console.error('Error adding logo to PDF:', error);
                }
            }
            
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 51, 102); // Dark blue color for header
            doc.text("CureConnect - PET Video Analysis Report", pageWidth / 2, 20, { align: 'center' });

            // Add footer with logo and text
            const addFooter = () => {
                doc.setFontSize(10);
                doc.setTextColor(0, 51, 102);
                doc.text(
                    "Generated by CureConnect",
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
                
                if (logoImageData) {
                    try {
                        doc.addImage(logoImageData, 'PNG', pageWidth - margin - 20, pageHeight - 15, 10, 10);
                    } catch (error) {
                        console.error('Error adding footer logo to PDF:', error);
                    }
                }
            };

            // Report Title
            yPosition += 30;
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 51, 102);
            doc.text("PET Video Analysis Report", pageWidth / 2, yPosition, { align: 'center' });

            // Add a decorative line
            yPosition += 10;
            doc.setDrawColor(0, 102, 204);
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);

            // User Details
            yPosition += 20;
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(51, 51, 51);
            doc.text("Patient Information", margin, yPosition);
            
            yPosition += 10;
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Patient Name: ${user?.name || 'Not Available'}`, margin, yPosition);
            yPosition += 10;
            doc.text(`Date: ${new Date().toLocaleString()}`, margin, yPosition);

            // AI Analysis Results - Bold Header
            yPosition += 20;
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 51, 102);
            doc.text("Analysis Results:", margin, yPosition);

            // Format analysis text with proper wrapping
            yPosition += 10;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.setTextColor(51, 51, 51);
            
            const splitText = doc.splitTextToSize(analysis, pageWidth - (2 * margin));
            
            // Check if text might overflow to next page
            if (yPosition + (splitText.length * 7) > pageHeight - margin) {
                addFooter();
                doc.addPage();
                
                // Add background to new page
                doc.setFillColor(208, 235, 255);
                doc.rect(0, 0, pageWidth, pageHeight, 'F');
                
                yPosition = margin;
            }
            
            doc.text(splitText, margin, yPosition);
            
            // Add a box around the analysis text
            const textHeight = splitText.length * 7;
            doc.setDrawColor(0, 102, 204);
            doc.setLineWidth(0.3);
            doc.roundedRect(margin - 5, yPosition - 5, pageWidth - (2 * margin) + 10, textHeight + 10, 3, 3);

            // Add timestamp at the bottom
            yPosition = pageHeight - 30;
            doc.setFontSize(10);
            doc.setTextColor(102, 102, 102);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);

            // Add footer to the last page
            addFooter();

            // Save the PDF with a proper filename
            const filename = `PET_Video_Report_${user?.name?.replace(/\s+/g, '_') || 'Patient'}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
            doc.save(filename);
            
            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert("There was an error generating the PDF. Please try again.");
            return false;
        }
    };

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

    const analyzeImage = async (imageUrl) => {
        try {
            // Fetch image and convert to Base64
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => resolve(reader.result.split(",")[1]); 
                reader.onerror = reject;
            });

            const result = await genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents: [
                    { role: "user", parts: [{ text: "You are an expert oncologist specializing in cancer detection. Analyze the provided medical image and determine whether it indicates signs of cancer. Provide a confidence score (in percentage) for your diagnosis. If cancer is detected, also mention the suspected type and affected region with a probability score and in a user-friendly language." }] },
                    { role: "user", parts: [{ inlineData: { mimeType: "image/png", data: base64Image } }] }
                ],
            });

            return result.text();
        } catch (error) {
            console.error("Error analyzing image:", error);
            throw error;
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
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Header />
                
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    {/* Video Upload Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload PET Scan Video</h2>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            {!videoPreview ? (
                                <div>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={handleVideoUpload}
                                        ref={fileInputRef}
                                        className="hidden"
                                        id="video-upload"
                                    />
                                    <label
                                        htmlFor="video-upload"
                                        className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Select Video
                                    </label>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Supported formats: MP4, MOV, AVI
                                    </p>
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
                        <AnalysisResults
                            analysis={analysis}
                            isAnalyzing={isAnalyzing}
                            isSimplifying={isSimplifying}
                            isSimplified={isSimplified}
                            onSimplify={handleSimplify}
                            onShowMedicalTerms={() => {
                                setAnalysis(analysis);
                                setIsSimplified(false);
                            }}
                            onDownloadReport={generatePDF}
                        />
                    </div>
                </div>
                
                <Disclaimer />

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
        </div>
    );
}

export default CancerVideoAnalysis; 