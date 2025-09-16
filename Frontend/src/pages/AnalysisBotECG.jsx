import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Header from '../components/Header';
import ImageUpload from '../components/ImageUpload';
import AnalysisResults from '../components/AnalysisResults';
import Disclaimer from '../components/Disclaimer';
import { useSelector, useDispatch } from 'react-redux';
import { addMedicalHistory } from "./../actions/userActions";
import { useNavigate } from 'react-router-dom';

function AnalysisBotECG() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
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

    // Function to upload image to Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'sachin');

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/drxliiejo/image/upload',
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading to Cloudinary:', error);
            throw error;
        }
    };

    // Handle file selection and upload
    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => setSelectedImage(reader.result);
                reader.readAsDataURL(file);

                const cloudinaryUrl = await uploadToCloudinary(file);
                await analyzeImage(cloudinaryUrl);
            } catch (error) {
                console.error('Error handling image upload:', error);
                setAnalysis("Error uploading image.");
            }
        }
    };

    // Analyze the uploaded ECG image
    const analyzeImage = async (imageUrl) => {
        setIsAnalyzing(true);
        setAnalysis(null);

        try {
            const response = await fetch('http://127.0.0.1:8001/ecg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file_path: imageUrl }),
            });

            const data = await response.json();
            if (response.ok) {
                setAnalysis(data.prediction);
                
                // Extract emergency level from the analysis
                const emergencyLevelMatch = data.prediction.match(/Emergency Level:\s*(\d)/i);
                const level = emergencyLevelMatch ? parseInt(emergencyLevelMatch[1]) : 3;
                setEmergencyLevel(level);
                setShowRedirect(true);
            } else {
                setAnalysis("Error: " + (data.error || "Unexpected response"));
            }
            dispatch(addMedicalHistory(data.prediction, imageUrl));
        } catch (error) {
            console.error('Error processing the image:', error);
            setAnalysis("Error processing the image.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Generate PDF report with improved formatting
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
            doc.text("CureConnect - ECG Analysis Report", pageWidth / 2, 20, { align: 'center' });

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
            doc.text("ECG Analysis Report", pageWidth / 2, yPosition, { align: 'center' });

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
                    <ImageUpload
                        selectedImage={selectedImage}
                        fileInputRef={fileInputRef}
                        handleImageUpload={handleImageUpload}
                        resetAnalysis={resetAnalysis}
                    />
                    <AnalysisResults
                        isAnalyzing={isAnalyzing}
                        analysis={analysis}
                    />
                    {analysis && (
                        <button
                            onClick={generatePDF}
                            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-md"
                        >
                            Download Report
                        </button>
                    )}
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

export default AnalysisBotECG;