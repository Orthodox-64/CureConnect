import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from "react-router-dom";

const genAI = new GoogleGenerativeAI("AIzaSyAerBoGRKAl_AMK4uGDG1re1u86sNxa28o");

const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "teleconnect");

    try {
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dfwzeazkg/image/upload",
            formData
        );
        return response.data.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

const formatAnalysisResults = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return lines.map(line => {
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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
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

export default function Retinopathy() {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [logoImageData, setLogoImageData] = useState(null);
    const [isSimplifying, setIsSimplifying] = useState(false);
    const [isSimplified, setIsSimplified] = useState(false);
    const fileInputRef = useRef(null);
    const [emergencyLevel, setEmergencyLevel] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const [showRedirect, setShowRedirect] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

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
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            // Create the prompt parts
            const prompt = "You are an expert ophthalmologist specializing in retinopathy detection. Analyze the provided retinal image and determine whether it indicates signs of retinopathy. Provide a confidence score (in percentage) for your diagnosis. If retinopathy is detected, also mention the type and severity with a probability score and in a user-friendly language. Include an Emergency Level (1 for high emergency, 2 for moderate emergency, 3 for low emergency) based on the severity of symptoms observed.";

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
            setAnalysis(text);

            // Extract emergency level from the analysis
            const emergencyLevelMatch = text.match(/Emergency Level:\s*(\d)/i);
            const level = emergencyLevelMatch ? parseInt(emergencyLevelMatch[1]) : 3;
            setEmergencyLevel(level);
            setShowRedirect(true);

            return text;
        } catch (error) {
            console.error("Error analyzing image:", error);
            throw error;
        }
    };

    // Load logo image when component mounts
    useEffect(() => {
        const loadLogo = async () => {
            try {
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = './logo.png';
                
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAndAnalyze = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);
        setAnalysis(null);
        
        try {
            // Upload image to Cloudinary
            const imageUrl = await uploadToCloudinary(selectedImage);
            
            // Analyze the image using local function
            const analysisText = await analyzeImage(imageUrl);
            setAnalysis(analysisText);
        } catch (error) {
            console.error('Error during analysis:', error);
            setAnalysis('Error during analysis. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setSelectedImage(file);
            
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const resetAnalysis = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setAnalysis(null);
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
            doc.text("CureConnect - Retinopathy Scan Analysis Report", pageWidth / 2, 20, { align: 'center' });

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
            doc.text("Retinopathy Scan Analysis Report", pageWidth / 2, yPosition, { align: 'center' });

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
            const filename = `Retinopathy_Scan_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
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
        <div className="min-h-screen bg-blue-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-center mb-8">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
                    </svg>
                    <h1 className="text-3xl font-bold text-gray-800 ml-2">CureConnect AI Assistant</h1>
                </div>
                
                {/* Main Container */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    {/* Image Upload Section */}
                    <div 
                        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center mb-6"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        {!imagePreview ? (
                            <div className="flex flex-col items-center">
                                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <h3 className="text-xl text-gray-700 mb-2">Upload a retinal image for retinopathy analysis</h3>
                                <p className="text-gray-500 mb-4">Click to browse or drag and drop</p>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    className="hidden" 
                                    id="fileInput"
                                />
                                <label 
                                    htmlFor="fileInput" 
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                                >
                                    Select Image
                                </label>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="max-h-64 max-w-full mb-4 rounded-lg shadow-md" 
                                />
                                <div className="flex space-x-4">
                                    <button 
                                        onClick={handleUploadAndAnalyze} 
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        disabled={isAnalyzing}
                                    >
                                        {isAnalyzing ? "Analyzing..." : "Analyze Image"}
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
                
                {/* Disclaimer */}
                <div className="text-center text-gray-600 text-sm">
                    <p>This is a demonstration of AI-powered retinopathy detection analysis.</p>
                </div>

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