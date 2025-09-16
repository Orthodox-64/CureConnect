import axios from 'axios';

// Cloudinary configuration (use env variables with fallbacks)
const CLOUDINARY_CLOUD_NAME =  'drxliiejo';
const CLOUDINARY_UPLOAD_PRESET =  'sachin';

/**
 * Captures a snapshot from a video file and returns it as a data URL
 * @param {File} videoFile - The video file to capture snapshot from
 * @param {number} timeOffset - Time in seconds to capture snapshot (default: 2)
 * @returns {Promise<string>} - The data URL of the captured image
 */
export const captureVideoSnapshot = async (videoFile, timeOffset = 2) => {
  return new Promise((resolve, reject) => {
    try {
      // Create video element
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      
      // Create canvas for capturing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        // Set canvas dimensions to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Seek to the specified time
        video.currentTime = Math.min(timeOffset, video.duration - 0.1);
      };
      
      video.onseeked = async () => {
        try {
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to data URL
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl);
        } catch (error) {
          reject(error);
        }
      };
      
      video.onerror = (error) => {
        reject(new Error('Error loading video: ' + error.message));
      };
      
      // Load the video
      video.src = URL.createObjectURL(videoFile);
      video.load();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Uploads an image blob to Cloudinary
 * @param {Blob} imageBlob - The image blob to upload
 * @returns {Promise<string>} - The Cloudinary URL of the uploaded image
 */
const uploadImageToCloudinary = async (imageBlob) => {
  try {
    const formData = new FormData();
    formData.append('file', imageBlob);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `${CLOUDINARY_UPLOAD_PRESET}/video-snapshots`);
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.secure_url;
  } catch (error) {
    const cloudinaryError = error?.response?.data?.error?.message || error?.message;
    console.error('Error uploading image to Cloudinary:', cloudinaryError);
    throw new Error(cloudinaryError || 'Failed to upload image to Cloudinary');
  }
};

/**
 * Analyzes an image using Gemini 1.5 Flash AI
 * @param {string} imageUrl - The Cloudinary URL of the image
 * @param {string} analysisType - The type of analysis (xray, skin, retinopathy, etc.)
 * @returns {Promise<string>} - The analysis result
 */
export const analyzeImageWithGemini = async (imageUrl, analysisType) => {
  try {
    const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyAerBoGRKAl_AMK4uGDG1re1u86sNxa28o";
    const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
    
    // Define analysis prompts based on type
    const prompts = {
      xray: "Analyze this X-ray image for signs of abnormalities, fractures, infections, or other conditions. Focus on bone structure, joint alignment, and any unusual patterns. Assess the severity and progression of any detected conditions. Provide detailed findings and recommendations.",
      skin: "Analyze this skin image for any dermatological conditions, lesions, moles, rashes, or abnormalities. Look for signs of skin cancer, infections, or other skin disorders. Assess the characteristics, size, color, and texture of any findings. Provide detailed analysis and recommendations.",
      retinopathy: "Analyze this retinal image for signs of diabetic retinopathy, macular degeneration, or other eye conditions. Look for microaneurysms, hemorrhages, exudates, or other abnormalities. Assess the severity and provide detailed findings and recommendations.",
      ecg: "Analyze this ECG/EKG image for any cardiac abnormalities, arrhythmias, or other heart conditions. Look for irregular rhythms, ST segment changes, or other concerning patterns. Provide detailed analysis and recommendations.",
      cancer: "Analyze this medical image for any signs of cancer, tumors, or malignant growths. Look for suspicious masses, irregular shapes, or other concerning features. Assess the characteristics and provide detailed analysis and recommendations.",
      alzheimer: "Analyze this brain scan or medical image for signs of Alzheimer's disease, dementia, or other neurological conditions. Look for brain atrophy, abnormal patterns, or other concerning features. Provide detailed analysis and recommendations."
    };
    
    const prompt = prompts[analysisType] || prompts.xray;
    
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: await fetchImageAsBase64(imageUrl)
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      }
    };
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.data && response.data.candidates && response.data.candidates[0]) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response from Gemini API');
    }
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    throw new Error('Failed to analyze image with AI');
  }
};

/**
 * Fetches an image from URL and converts it to base64
 * @param {string} imageUrl - The URL of the image
 * @returns {Promise<string>} - The base64 encoded image
 */
const fetchImageAsBase64 = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image');
  }
};

/**
 * Complete video analysis workflow: capture snapshot, upload to Cloudinary, and analyze with Gemini
 * @param {File} videoFile - The video file to analyze
 * @param {string} analysisType - The type of analysis
 * @param {number} timeOffset - Time in seconds to capture snapshot (default: 2)
 * @returns {Promise<{imageUrl: string, analysis: string}>} - The image URL and analysis result
 */
export const analyzeVideoWithSnapshot = async (videoFile, analysisType, timeOffset = 2) => {
  try {
    // Step 1: Capture snapshot from video
    console.log('Capturing video snapshot...');
    const dataUrl = await captureVideoSnapshot(videoFile, timeOffset);
    console.log('Snapshot captured:', dataUrl);
    
    // Step 2: Convert data URL to blob and upload to Cloudinary
    console.log('Uploading to Cloudinary...');
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    const imageUrl = await uploadImageToCloudinary(blob);
    console.log('Uploaded to Cloudinary:', imageUrl);
    
    // Step 3: Analyze image with Gemini AI
    console.log('Analyzing image with Gemini AI...');
    const analysis = await analyzeImageWithGemini(imageUrl, analysisType);
    console.log('Analysis completed');
    
    return {
      imageUrl,
      analysis
    };
  } catch (error) {
    console.error('Error in video analysis workflow:', error);
    throw error;
  }
};
