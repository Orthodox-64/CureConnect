# Cloudinary Integration Setup Guide

## Overview
This implementation adds Cloudinary integration for doctor profile photos with the following configuration:
- **Cloud Name**: `dcmdkvmwe`
- **Upload Preset**: `Mangodesk`
- **Folder**: `teleconnect/doctors`

## Backend Setup

### 1. Install Dependencies
```bash
cd Backend
npm install cloudinary multer multer-storage-cloudinary
```

### 2. Environment Variables
Add to your `.env` file:
```env
CLOUDINARY_CLOUD_NAME=dcmdkvmwe
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Get Cloudinary Credentials
1. Visit [Cloudinary Console](https://console.cloudinary.com/)
2. Sign in to your account
3. Go to Dashboard
4. Copy your API Key and API Secret

### 4. Configure Upload Preset
1. In Cloudinary Console, go to Settings > Upload
2. Create a new upload preset named `Mangodesk`
3. Set the following:
   - **Signing Mode**: Unsigned
   - **Folder**: `teleconnect/doctors`
   - **Transformation**: Auto crop, 300x300, face detection

## Frontend Setup

### 1. Install Dependencies
```bash
cd Frontend
npm install cloudinary-react
```

### 2. Environment Variables
Add to your `.env` file:
```env
VITE_CLOUDINARY_CLOUD_NAME=dcmdkvmwe
VITE_CLOUDINARY_UPLOAD_PRESET=Mangodesk
```

## Features Implemented

### 🎯 **Backend Features**
1. **Cloudinary Configuration** (`utils/cloudinary.js`):
   - Automatic image optimization
   - Face detection and cropping
   - 5MB file size limit
   - Image format validation

2. **Updated User Registration**:
   - Handles avatar uploads for doctors
   - Stores Cloudinary public_id and URL
   - Supports speciality and availability fields

3. **Multer Integration**:
   - File upload middleware
   - Automatic Cloudinary upload
   - Error handling

### 🎯 **Frontend Features**
1. **CloudinaryUpload Component**:
   - Drag & drop file upload
   - Real-time preview
   - Progress indicators
   - Error handling
   - File validation

2. **Updated Doctor Signup**:
   - Profile photo upload section
   - Only shown for doctors
   - Integrated with form validation

3. **Enhanced Doctor Cards**:
   - Displays Cloudinary images
   - Fallback to initials
   - Error handling for broken images

## How It Works

### 1. Doctor Registration Flow
1. Doctor fills out registration form
2. Uploads profile photo using CloudinaryUpload component
3. Image is uploaded directly to Cloudinary (client-side)
4. Cloudinary returns public_id and secure_url
5. Form data (including avatar info) is sent to backend
6. Backend stores user with avatar data

### 2. Image Display
1. Doctor cards check for `avatar.url` or `avatar` field
2. If image exists, displays Cloudinary image
3. If image fails to load, shows doctor initials
4. Fallback ensures UI never breaks

### 3. Image Optimization
- **Automatic cropping**: 300x300px with face detection
- **Format optimization**: WebP when supported
- **Quality optimization**: Auto quality based on content
- **Responsive delivery**: Different sizes for different devices

## API Endpoints

### Updated Endpoints
- `POST /register` - Now accepts multipart/form-data with avatar upload

### New Features
- File upload validation
- Image optimization
- Error handling for uploads

## File Structure

```
Backend/
├── utils/cloudinary.js (NEW)
├── controller/userController.js (UPDATED)
└── routes/userRoute.js (UPDATED)

Frontend/
├── components/CloudinaryUpload.jsx (NEW)
├── components/DoctorCard.jsx (UPDATED)
├── components/User/LoginSignup.jsx (UPDATED)
└── actions/userActions.js (UPDATED)
```

## Testing

### 1. Test Doctor Registration
1. Go to signup page
2. Select "Doctor" role
3. Fill out form including speciality
4. Upload a profile photo
5. Submit registration
6. Check if image appears in doctor cards

### 2. Test Image Display
1. Navigate to appointments page
2. Click "Book Appointment"
3. Verify doctor images load correctly
4. Test with doctors who have/don't have photos

## Troubleshooting

### Common Issues

1. **Images not uploading**:
   - Check Cloudinary credentials
   - Verify upload preset is unsigned
   - Check browser console for errors

2. **Images not displaying**:
   - Check if avatar data is stored correctly
   - Verify Cloudinary URL is accessible
   - Check network tab for failed requests

3. **Upload errors**:
   - Check file size (max 5MB)
   - Verify file format (JPG, PNG, GIF, WebP)
   - Check Cloudinary quota limits

### Debug Steps

1. **Check Console Logs**:
   ```javascript
   console.log('Avatar data:', formData.avatar);
   console.log('Doctor data:', doctor);
   ```

2. **Verify Cloudinary Setup**:
   - Test upload preset in Cloudinary console
   - Check folder structure
   - Verify API credentials

3. **Network Inspection**:
   - Check upload requests to Cloudinary
   - Verify registration requests to backend
   - Look for CORS errors

## Security Considerations

1. **Upload Preset**: Uses unsigned preset for client-side uploads
2. **File Validation**: Server-side validation of file types and sizes
3. **CORS**: Properly configured for Cloudinary API
4. **Rate Limiting**: Cloudinary has built-in rate limiting

## Performance Optimizations

1. **Client-side Upload**: Reduces server load
2. **Image Optimization**: Automatic compression and format selection
3. **Lazy Loading**: Images load only when needed
4. **Caching**: Cloudinary CDN caching for fast delivery

## Future Enhancements

1. **Image Editing**: Crop and rotate before upload
2. **Multiple Images**: Support for gallery uploads
3. **Video Support**: Upload and display videos
4. **Advanced Transformations**: More image effects and filters

The Cloudinary integration is now complete and ready for use! Doctors can upload profile photos during registration, and these images will be displayed beautifully in the appointment booking system.
