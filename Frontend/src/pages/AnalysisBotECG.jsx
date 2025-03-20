import { useState, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import ImageUpload from '../components/ImageUpload';
import AnalysisResults from '../components/AnalysisResults';
import Disclaimer from '../components/Disclaimer';

function AnalysisBotECG() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const fileInputRef = useRef(null);

    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'teleconnect'); // Replace with your upload preset

        try {
            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dfwzeazkg/image/upload', // Replace with your cloud name
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

        try {
            const response = await fetch('http://127.0.0.1:8001/ecg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file_path: imageUrl }), // Ensure JSON format
            });

            const data = await response.json();
            if (response.ok) {
                setAnalysis(data.prediction);
            } else {
                setAnalysis("Error: " + (data.error || "Unexpected response"));
            }
        } catch (error) {
            console.error('Error processing the image:', error);
            setAnalysis("Error processing the image.");
        } finally {
            setIsAnalyzing(false);
        }
    };

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
                    <AnalysisResults
                        isAnalyzing={isAnalyzing}
                        analysis={analysis}
                    />
                </div>
                <Disclaimer />
            </div>
        </div>
    );
}

export default AnalysisBotECG;
