import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { GoogleGenAI } from "@google/genai";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ai = new GoogleGenAI({ apiKey: "AIzaSyASSY9fkUZY2Q9cYsCd-mTMK0sr98lPh30" });

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

const formatAnalysisResults = (rawResult) => {
    // Split the raw result into lines
    const lines = rawResult.split('\n').filter(line => line.trim() !== '');
    
    // Format key lines with bold formatting
    const formattedLines = lines.map(line => {
        if (line.toLowerCase().includes('cancer')) {
            return `**${line}**`;
        }
        if (line.includes('Confidence') || line.includes('Probability')) {
            return `**${line}**`;
        }
        if (line.includes('Type') || line.includes('Region')) {
            return `**${line}**`;
        }
        return line;
    });

    return formattedLines.join('\n');
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

      const result = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
              { role: "user", parts: [{ text: "You are an expert oncologist specializing in PET scan analysis. Analyze the provided PET scan image and determine whether it indicates signs of cancer. Provide a confidence score (in percentage) for your diagnosis. If cancer is detected, also mention the suspected type and affected region with a probability score" }] },
              { role: "user", parts: [{ inlineData: { mimeType: "image/png", data: base64Image } }] }
          ],
      });

      // Format the result before returning
      return formatAnalysisResults(result.text);
  } catch (error) {
      console.error("Error analyzing image:", error);
      throw error;
  }
};

export default function MedicalVisionAI() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [logoImageData, setLogoImageData] = useState(null);
    const fileInputRef = useRef(null);

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
            const cloudinaryUrl = await uploadToCloudinary(selectedImage);
            const result = await analyzeImage(cloudinaryUrl);
            setAnalysis(result);
        } catch (error) {
            console.error("Error processing image:", error);
            setAnalysis("Error processing image. Please try again.");
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
            doc.text("CureConnect - PET Scan Analysis Report", pageWidth / 2, 20, { align: 'center' });

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
            doc.text("PET Scan Analysis Report", pageWidth / 2, yPosition, { align: 'center' });

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
            const filename = `PET_Scan_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
            doc.save(filename);
            
            return true;
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert("There was an error generating the PDF. Please try again.");
            return false;
        }
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
                                <h3 className="text-xl text-gray-700 mb-2">Upload an image for analysis</h3>
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
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <h2 className="text-xl font-semibold text-gray-700 ml-2">Analysis Results</h2>
                            </div>
                            {analysis && (
                                <button
                                    onClick={generatePDF}
                                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download Report
                                </button>
                            )}
                        </div>
                        
                        {isAnalyzing ? (
                            <div className="flex flex-col items-center py-10">
                                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-gray-600">Processing your image...</p>
                            </div>
                        ) : analysis ? (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <div 
                                    className="text-gray-700 whitespace-pre-line"
                                    dangerouslySetInnerHTML={{
                                        __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center py-10">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-gray-500">Upload an image to receive analysis</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Disclaimer */}
                <div className="text-center text-gray-600 text-sm">
                    <p>This is a demonstration of AI-powered medical image analysis.</p>
                    <p>For actual medical advice, please consult with healthcare professionals.</p>
                </div>
            </div>
        </div>
    );
}