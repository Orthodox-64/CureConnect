import React, { useState } from 'react';
import { Cloud, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

const CloudinaryUpload = ({ onImageUpload, currentImage, disabled = false }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(currentImage);

    const cloudName = 'dcmdkvmwe';
    const uploadPreset = 'Mangodesk';

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB');
            return;
        }

        setError(null);
        setUploading(true);

        try {
            // Create form data
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', 'teleconnect/doctors');

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            
            // Set preview
            setPreview(data.secure_url);
            
            // Call parent callback
            onImageUpload({
                public_id: data.public_id,
                url: data.secure_url
            });

        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setPreview(null);
        onImageUpload(null);
    };

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={disabled || uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                
                <div className={`
                    border-2 border-dashed rounded-lg p-6 text-center transition-colors
                    ${preview 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-300 hover:border-blue-400'
                    }
                    ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}>
                    {preview ? (
                        <div className="space-y-4">
                            <img
                                src={preview}
                                alt="Profile preview"
                                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                            />
                            <div className="flex items-center justify-center space-x-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Image uploaded successfully</span>
                            </div>
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {uploading ? (
                                <div className="space-y-2">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="text-gray-600">Uploading...</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Cloud className="w-12 h-12 text-gray-400 mx-auto" />
                                    <div>
                                        <p className="text-gray-600 font-medium">
                                            {currentImage ? 'Change Profile Photo' : 'Upload Profile Photo'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Click to select an image (JPG, PNG, GIF)
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                </div>
            )}

            {/* Upload Guidelines */}
            <div className="text-xs text-gray-500 space-y-1">
                <p>• Maximum file size: 5MB</p>
                <p>• Supported formats: JPG, PNG, GIF, WebP</p>
                <p>• Recommended size: 300x300px or larger</p>
            </div>
        </div>
    );
};

export default CloudinaryUpload;
