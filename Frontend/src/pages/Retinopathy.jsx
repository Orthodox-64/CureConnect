import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import ImageUpload from '../components/ImageUpload.jsx';
import Disclaimer from '../components/Disclaimer';
import { useSelector, useDispatch } from 'react-redux';
import { addMedicalHistory } from "./../actions/userActions";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyBjhpEfKWZa5jNA6iV-Rs6qmMhCnbtrJA8");

// Format analysis results for better display
const formatAnalysisResults = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return lines.map(line => {
        // Remove asterisks and format based on content
        const cleanLine = line.replace(/\*\*/g, '');
        
        if (cleanLine.match(/^(Image Quality|Retinal Assessment|Normal Findings|Abnormal Findings|Retinopathy Analysis|Clinical Impression|Recommendations|Confidence Score|Emergency Level)/i)) {
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

export default function Retinopathy() {
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

    // Upload to Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "sachin");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/drxliiejo/image/upload",
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            throw error;
        }
    };

    // Analyze image with Gemini AI
    const analyzeImage = async (imageUrl) => {
        try {
            // Fetch image and convert to Base64
            const fetchResponse = await fetch(imageUrl);
            const blob = await fetchResponse.blob();

            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => resolve(reader.result.split(",")[1]); 
                reader.onerror = reject;
            });

            // Get the model
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            // Create the prompt
            const prompt = `You are an expert ophthalmologist specializing in retinopathy detection and diabetic retinopathy analysis. Analyze the provided retinal image with the following structure:
Image Quality: Assess the clarity and quality of the retinal image
Retinal Assessment: Detailed analysis of retinal structures including:
- Optic disc appearance and cup-to-disc ratio
- Macula condition and foveal reflex
- Blood vessel changes (caliber, tortuosity, arteriovenous crossing changes)
- Retinal background (hemorrhages, exudates, cotton wool spots)
Normal Findings: List any normal anatomical structures observed
Abnormal Findings: Detail any pathological changes if present:
- Microaneurysms, dot and blot hemorrhages
- Hard and soft exudates
- Neovascularization
- Macular edema signs
- Any other retinal pathology
Retinopathy Analysis: 
- Presence/absence of diabetic retinopathy
- If present, classify severity (mild, moderate, severe non-proliferative, or proliferative)
- Risk assessment and progression likelihood
Clinical Impression: Overall diagnostic impression with confidence percentage
Recommendations: Treatment recommendations and follow-up suggestions
IMPORTANT: At the end of your analysis, include exactly one of these emergency levels:
'Emergency Level: 0' (no emergency - normal findings or mild changes)
'Emergency Level: 1' (routine care - mild retinopathy, regular monitoring needed)
'Emergency Level: 2' (prompt attention - moderate retinopathy, closer follow-up required)
'Emergency Level: 3' (urgent care - severe retinopathy or sight-threatening findings)`;

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
            const text = generatedResponse.text();

            // Extract emergency level from the analysis
            const emergencyLevelMatch = text.match(/Emergency Level:\s*(\d)/i);
            const level = emergencyLevelMatch ? parseInt(emergencyLevelMatch[1]) : 0;
            setEmergencyLevel(level);
            
            // Only show redirect if there's an actual emergency (level > 0)
            if (level > 0) {
                setShowRedirect(true);
            }

            return text;
        } catch (error) {
            console.error("Error analyzing image:", error);
            throw error;
        }
    };

    // Simplify analysis
    const simplifyAnalysis = async (medicalAnalysis) => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
            
            const prompt = `You are a medical translator who specializes in explaining complex medical terms in simple, easy-to-understand language for patients. 
            Please convert this retinopathy analysis into simple terms that someone without a medical background can understand.
            Keep the same structure but use everyday language. Here's the analysis:
            ${medicalAnalysis}
            Please provide the simplified version while maintaining the key information about eye health.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Error simplifying analysis:", error);
            throw new Error("Failed to simplify the analysis. Please try again.");
        }
    };

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

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Create image preview URL
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            setIsAnalyzing(true);
            setAnalysis(null);
            
            try {
                // Upload image to Cloudinary
                const cloudinaryUrl = await uploadToCloudinary(file);
                
                // Analyze the image
                const analysisText = await analyzeImage(cloudinaryUrl);
                setAnalysis(analysisText);
                
                // Save to medical history
                if (user && analysisText) {
                    const historyData = {
                        type: 'Retinopathy Analysis',
                        result: analysisText,
                        date: new Date().toISOString(),
                        imageUrl: cloudinaryUrl
                    };
                    dispatch(addMedicalHistory(historyData));
                }
            } catch (error) {
                console.error('Error during analysis:', error);
                setAnalysis('Error during analysis. Please try again.');
            } finally {
                setIsAnalyzing(false);
            }
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
            doc.text("CureConnect - Retinopathy Analysis Report", pageWidth / 2, 20, { align: 'center' });

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
            doc.setTextColor(0, 0, 0);
            doc.text("Retinopathy Analysis Report", pageWidth / 2, yPosition, { align: 'center' });

            // Patient Information
            yPosition += 20;
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Patient: ${user?.name || 'N/A'}`, margin, yPosition);
            yPosition += 8;
            doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
            yPosition += 8;
            doc.text(`Time: ${new Date().toLocaleTimeString()}`, margin, yPosition);

            // Analysis Results
            yPosition += 20;
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Analysis Results:", margin, yPosition);
            yPosition += 10;

            // Add analysis content
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            const splitText = doc.splitTextToSize(analysis, pageWidth - 2 * margin);
            
            splitText.forEach((line) => {
                if (yPosition > pageHeight - margin - 20) {
                    addFooter();
                    doc.addPage();
                    doc.setFillColor(208, 235, 255);
                    doc.rect(0, 0, pageWidth, pageHeight, 'F');
                    yPosition = margin;
                }
                doc.text(line, margin, yPosition);
                yPosition += 6;
            });

            addFooter();

            // Save the PDF with a proper filename
            const filename = `Retinopathy_Analysis_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
            doc.save(filename);
            
            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert("There was an error generating the PDF. Please try again.");
            return false;
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
                        navigate('/chat'); // Routine care - chat support
                    } else if (emergencyLevel === 2) {
                        navigate('/telemedicine'); // Prompt attention - telemedicine
                    } else if (emergencyLevel === 3) {
                        window.open('https://tinyurl.com/4jdnrr5b', '_blank'); // Urgent care - emergency
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

    // Reset the analysis state
    const resetAnalysis = () => {
        if (selectedImage && selectedImage.startsWith('blob:')) {
            URL.revokeObjectURL(selectedImage);
        }
        setSelectedImage(null);
        setAnalysis(null);
        setIsSimplified(false);
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
                                <h2 className="text-xl font-semibold text-gray-700 ml-2">Retinopathy Analysis Results</h2>
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
                                <p className="text-gray-600">Processing your retinal image...</p>
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
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">Upload a retinal image to receive comprehensive retinopathy analysis</p>
                            </div>
                        )}
                    </div>
                </div>
                <Disclaimer />

                {showRedirect && emergencyLevel && (
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl z-50">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Care Level Detected</h2>
                            <div className={`text-4xl font-bold mb-4 ${
                                emergencyLevel === 1 ? 'text-blue-600' :
                                emergencyLevel === 2 ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                                Level {emergencyLevel}
                            </div>
                            <p className="text-gray-600 mb-4">
                                {emergencyLevel === 1 ? 'Routine Care - Regular monitoring recommended' :
                                 emergencyLevel === 2 ? 'Prompt Attention - Closer follow-up required' :
                                 'Urgent Care - Immediate medical attention needed'}
                            </p>
                            
                            {!isRedirecting ? (
                                <div className="flex gap-4 justify-center mt-6">
                                    <button
                                        onClick={handleRedirect}
                                        className={`px-6 py-3 rounded-lg font-semibold ${
                                            emergencyLevel === 1 ? 'bg-blue-600 hover:bg-blue-700' :
                                            emergencyLevel === 2 ? 'bg-yellow-600 hover:bg-yellow-700' :
                                            'bg-red-600 hover:bg-red-700'
                                        } text-white transition-colors`}
                                    >
                                        Get Care Now
                                    </button>
                                    <button
                                        onClick={handleStayOnPage}
                                        className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-semibold transition-colors"
                                    >
                                        Stay on Page
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-6">
                                    <p className="text-lg font-semibold mb-2">Redirecting in {countdown} seconds...</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                                            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}