import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Header from '../components/Header';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ImageUpload from '../components/ImageUpload.jsx';
import Disclaimer from '../components/Disclaimer';
import { useSelector, useDispatch } from 'react-redux';
import { addMedicalHistory } from "./../actions/userActions";
import { useNavigate } from 'react-router-dom';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyBjhpEfKWZa5jNA6iV-Rs6qmMhCnbtrJA8");

// Format analysis results for better display
const formatAnalysisResults = (text) => {
    if (!text) return [];
    
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return lines.map(line => {
        // Remove asterisks, bullets, and clean the line
        const cleanLine = line.replace(/\*\*/g, '').replace(/^\*\s*/, '').replace(/^-\s*/, '').trim();
        
        if (cleanLine.match(/^(Image Quality|Anatomical Structures|Normal Findings|Abnormal Findings|Bone Assessment|Soft Tissue Analysis|Clinical Impression|Recommendations|Confidence Score|Emergency Level)/i)) {
            return {
                type: 'header',
                content: cleanLine
            };
        }
        return {
            type: 'content',
            content: cleanLine
        };
    }).filter(item => item.content.length > 0);
};

function AnalysisBotXRAY() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [logoImageData, setLogoImageData] = useState(null);
    const { user } = useSelector(state => state.user);
    const [analysis, setAnalysis] = useState(null);
    const fileInputRef = useRef(null);
    const [emergencyLevel, setEmergencyLevel] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const [showRedirect, setShowRedirect] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isSimplifying, setIsSimplifying] = useState(false);
    const [isSimplified, setIsSimplified] = useState(false);

    useEffect(() => {
        const loadLogo = async () => {
            try {
                // Convert logo to base64 to avoid CORS issues
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

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'sachin'); // Replace with your upload preset

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/drxliiejo/image/upload', // Replace with your cloud name
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => setSelectedImage(reader.result);
                reader.readAsDataURL(file);

                // Upload to Cloudinary first
                const cloudinaryUrl = await uploadToCloudinary(file);
                await analyzeImage(cloudinaryUrl);
            } catch (error) {
                console.error('Error handling image upload:', error);
                setAnalysis("Error uploading image.");
            }
        }
    };

    const analyzeImage = async (imageUrl) => {
        setIsAnalyzing(true);
        setAnalysis(null);
        setEmergencyLevel(null);
        setShowRedirect(false);
        setCountdown(5);
        setIsRedirecting(false);

        try {
            // Fetch image and convert to Base64
            const fetchResponse = await fetch(imageUrl);
            const blob = await fetchResponse.blob();

            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.split(',')[1];
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            // Get the model
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            // Create the prompt for X-ray analysis
            const prompt = `You are an expert radiologist specializing in X-ray image analysis. Analyze the provided X-ray image with the following structure:
Image Quality: Assess the technical quality of the X-ray including positioning, exposure, and clarity
Anatomical Structures: Detailed examination of visible anatomical structures including:
- Bone structures and alignment
- Joint spaces and articulations
- Soft tissue shadows and organ outlines
- Any medical devices or foreign objects
Normal Findings: List normal anatomical features visible in the image
Abnormal Findings: Detail any pathological changes if present:
- Fractures, dislocations, or bone lesions
- Soft tissue swelling or masses
- Joint space narrowing or deformities
- Any other radiological abnormalities
Bone Assessment: Comprehensive evaluation of bone density, cortical integrity, and trabecular patterns
Soft Tissue Analysis: Assessment of soft tissue shadows, organ contours, and any abnormalities
Clinical Impression: Overall radiological interpretation with diagnostic considerations
Recommendations: Specific suggestions for further imaging, clinical correlation, or follow-up
Confidence Score: Your diagnostic confidence as a percentage
IMPORTANT: At the end of your analysis, include exactly one of these emergency levels:
'Emergency Level: 0' (normal findings - no immediate concern)
'Emergency Level: 1' (mild abnormalities - routine follow-up recommended)
'Emergency Level: 2' (moderate findings - prompt medical attention needed)
'Emergency Level: 3' (serious abnormalities - immediate medical attention required)
Please format your response with clear section headers followed by detailed content. Avoid using asterisks or markdown formatting.`;

            // Generate content
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Image
                    }
                }
            ]);

            const generatedResponse = await result.response;
            const analysisText = generatedResponse.text();
            setAnalysis(analysisText);

            // Extract emergency level from the analysis
            const emergencyLevelMatch = analysisText.match(/Emergency Level:\s*(\d)/i);
            const level = emergencyLevelMatch ? parseInt(emergencyLevelMatch[1]) : 2;
            setEmergencyLevel(level);
            
            // Only show redirect if there's an actual emergency (level > 0)
            if (level > 0) {
                setShowRedirect(true);
            }

            // Add to medical history
            dispatch(addMedicalHistory(analysisText, imageUrl));
        } catch (error) {
            console.error('Error processing the X-ray image:', error);
            setAnalysis("Error processing the X-ray image. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Simplify analysis using Gemini AI
    const simplifyAnalysis = async (medicalAnalysis) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            
            const prompt = `You are a medical translator who specializes in explaining complex medical terms in simple, easy-to-understand language. 
            Please convert this X-ray analysis into simple terms that someone without a medical background can understand.
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

    // Handle simplify button click
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

    const generatePDF = () => {
        if (!analysis) {
            alert("No analysis data available to generate PDF.");
            return;
        }

        try {
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
            doc.text("CureConnect - XRAY Analysis Report", pageWidth / 2, 20, { align: 'center' });

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
            doc.text("XRAY Analysis Report", pageWidth / 2, yPosition, { align: 'center' });

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

            // Analysis Results - Bold Header
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
            const filename = `ECG_Report_${user?.name?.replace(/\s+/g, '_') || 'Patient'}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
            doc.save(filename);

            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert("There was an error generating the PDF. Please try again.");
            return false;
        }
    };

    // Reset the analysis state
    const resetAnalysis = () => {
        setSelectedImage(null);
        setAnalysis(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Header />
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <ImageUpload
                        selectedImage={selectedImage}
                        fileInputRef={fileInputRef}
                        handleImageUpload={handleImageUpload}
                        resetAnalysis={resetAnalysis}
                    />
                    {/* Analysis Results Section */}
                    <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <h2 className="text-xl font-semibold text-gray-700 ml-2">X-Ray Analysis Results</h2>
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
                                <p className="text-gray-600">Processing your X-ray...</p>
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
                                                            {item.content.includes(':') ? item.content.split(':')[0] : item.content}
                                                        </h3>
                                                        {item.content.includes(':') && item.content.split(':')[1]?.trim() && (
                                                            <p className="text-gray-700 mt-1">
                                                                {item.content.split(':')[1].trim()}
                                                            </p>
                                                        )}
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
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500">Upload an X-ray image to receive analysis</p>
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

export default AnalysisBotXRAY;