# Client-Side AI Integration Setup

## Overview
The appointment system now uses client-side Gemini AI integration for real-time symptom analysis. This provides better user experience with instant AI suggestions as users type their symptoms.

## Setup Instructions

### 1. Frontend Environment Variables
Create a `.env` file in the Frontend directory:

```env
# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# API Base URL (if different from default)
VITE_API_URL=http://localhost:4000
```

### 2. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 3. Install Dependencies
```bash
# Frontend
cd Frontend
npm install

# Backend (no new dependencies needed)
cd Backend
npm install
```

## How It Works

### Client-Side AI Flow
1. User types symptoms in the appointment booking form
2. When symptoms exceed 20 characters, AI analysis is triggered
3. Gemini AI analyzes symptoms and provides suggestions
4. Suggestions are displayed in real-time below the symptoms field
5. User can see AI suggestions before booking the appointment

### Features
- **Real-time Analysis**: AI suggestions appear as user types
- **Loading States**: Shows loading indicator during AI processing
- **Error Handling**: Graceful fallback if AI service is unavailable
- **No Server Load**: All AI processing happens on client-side

### Security
- API key is stored in environment variables
- Client-side processing reduces server load
- No sensitive data sent to external services beyond symptoms

## Troubleshooting

### Common Issues
1. **AI suggestions not appearing**: Check VITE_GEMINI_API_KEY in .env
2. **CORS errors**: Ensure API key is valid and has proper permissions
3. **Rate limiting**: Gemini has usage limits, check your quota

### Debug Steps
1. Check browser console for errors
2. Verify environment variables are loaded
3. Test API key with a simple request
4. Check network tab for failed requests

## Benefits of Client-Side AI
- Faster response times
- Reduced server load
- Better user experience
- Real-time feedback
- No additional backend complexity
