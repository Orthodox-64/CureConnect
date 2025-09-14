import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const generateSymptomAnalysis = async (symptoms, patientAge = null, patientGender = null) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        As a medical AI assistant, analyze the following symptoms and provide helpful suggestions for the patient until their appointment. 
        Please provide practical, non-diagnostic advice that can help manage symptoms safely.

        Patient Information:
        - Symptoms: ${symptoms}
        ${patientAge ? `- Age: ${patientAge}` : ''}
        ${patientGender ? `- Gender: ${patientGender}` : ''}

        Please provide your response in the following markdown format:

        ## 🏥 Health Suggestions

        ### 📋 General Management Tips
        - [List practical tips for managing symptoms]

        ### ⚠️ When to Seek Immediate Care
        - [List red flag symptoms that require urgent attention]

        ### 🏠 Home Care Recommendations
        - [List safe home care measures]

        ### 📝 Preparing for Your Appointment
        - [List things to prepare and questions to ask]

        ### 💡 Additional Notes
        - [Any other relevant information]

        **Important:** This is not a medical diagnosis. Always consult with your healthcare provider for proper medical advice.

        Keep the response concise, practical, and well-formatted with clear sections.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating symptom analysis:', error);
        return `I'm sorry, I'm having trouble analyzing your symptoms right now. Please make sure to discuss all your symptoms with your doctor during your appointment.`;
    }
};

export const generateAppointmentReminder = async (symptoms, doctorName, appointmentDate, appointmentTime) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Generate a helpful appointment reminder message for a patient. Include:
        - Appointment details (doctor, date, time)
        - Brief reminder about their symptoms
        - Preparation tips for the appointment
        - Encouragement to be ready with questions

        Doctor: ${doctorName}
        Date: ${appointmentDate}
        Time: ${appointmentTime}
        Symptoms: ${symptoms}

        Keep it warm, professional, and helpful.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating appointment reminder:', error);
        return `Your appointment with ${doctorName} is scheduled for ${appointmentDate} at ${appointmentTime}. Please be ready to discuss your symptoms: ${symptoms}`;
    }
};
