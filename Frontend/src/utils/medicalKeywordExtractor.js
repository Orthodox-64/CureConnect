// Multilingual medical keywords database
const medicalKeywordsDatabase = {
  'en-US': {
    // Symptoms
    symptoms: [
      'cough', 'fever', 'headache', 'nausea', 'vomiting', 'diarrhea', 'constipation',
      'fatigue', 'weakness', 'dizziness', 'chest pain', 'shortness of breath',
      'abdominal pain', 'back pain', 'joint pain', 'muscle pain', 'sore throat',
      'runny nose', 'congestion', 'sneezing', 'rash', 'itching', 'swelling',
      'bloating', 'heartburn', 'indigestion', 'loss of appetite', 'weight loss',
      'weight gain', 'insomnia', 'anxiety', 'depression', 'stress', 'panic',
      'palpitations', 'high blood pressure', 'low blood pressure', 'diabetes',
      'asthma', 'allergies', 'migraine', 'vertigo', 'tinnitus', 'blurred vision',
      'dry eyes', 'ear pain', 'hearing loss', 'dental pain', 'gum bleeding',
      'jaw pain', 'neck pain', 'shoulder pain', 'arm pain', 'leg pain',
      'knee pain', 'ankle pain', 'foot pain', 'numbness', 'tingling',
      'burning sensation', 'cold symptoms', 'flu symptoms', 'stomach ache',
      'cramps', 'spasms', 'seizures', 'fainting', 'blackouts', 'confusion',
      'memory loss', 'difficulty concentrating', 'mood swings', 'irritability',
      'restlessness', 'tremors', 'shaking', 'stiffness', 'difficulty walking',
      'balance problems', 'coordination problems', 'speech difficulties',
      'swallowing difficulties', 'hoarseness', 'voice changes', 'coughing up blood',
      'blood in urine', 'blood in stool', 'unusual bleeding', 'bruising',
      'pale skin', 'yellowing skin', 'skin discoloration', 'moles', 'lumps',
      'bumps', 'lesions', 'wounds', 'cuts', 'burns', 'fractures', 'sprains',
      'strains', 'dislocations', 'infection', 'inflammation', 'discharge',
      'bleeding', 'pain', 'ache', 'hurt', 'sore', 'tender', 'sensitive',
      'swollen', 'red', 'hot', 'warm', 'cold', 'numb', 'stiff', 'tight',
      'loose', 'weak', 'strong', 'sharp', 'dull', 'throbbing', 'stabbing',
      'burning', 'shooting', 'radiating', 'constant', 'intermittent', 'chronic',
      'acute', 'sudden', 'gradual', 'mild', 'moderate', 'severe', 'extreme'
    ],
    
    // Body parts
    bodyParts: [
      'head', 'brain', 'skull', 'scalp', 'face', 'forehead', 'temple', 'eye',
      'eyebrow', 'eyelid', 'nose', 'nostril', 'mouth', 'lip', 'tongue', 'tooth',
      'teeth', 'gum', 'jaw', 'chin', 'cheek', 'ear', 'neck', 'throat', 'thyroid',
      'chest', 'breast', 'lung', 'heart', 'rib', 'back', 'spine', 'shoulder',
      'arm', 'elbow', 'wrist', 'hand', 'finger', 'thumb', 'abdomen', 'stomach',
      'liver', 'kidney', 'bladder', 'bowel', 'intestine', 'colon', 'rectum',
      'pelvis', 'hip', 'buttock', 'groin', 'thigh', 'leg', 'knee', 'calf',
      'shin', 'ankle', 'foot', 'toe', 'heel', 'skin', 'muscle', 'bone',
      'joint', 'tendon', 'ligament', 'nerve', 'blood vessel', 'artery', 'vein'
    ],
    
    // Medical conditions
    conditions: [
      'hypertension', 'hypotension', 'tachycardia', 'bradycardia', 'arrhythmia',
      'angina', 'myocardial infarction', 'heart attack', 'stroke', 'anemia',
      'leukemia', 'cancer', 'tumor', 'cyst', 'polyp', 'ulcer', 'gastritis',
      'colitis', 'appendicitis', 'pneumonia', 'bronchitis', 'sinusitis',
      'rhinitis', 'pharyngitis', 'laryngitis', 'tonsillitis', 'otitis',
      'conjunctivitis', 'dermatitis', 'eczema', 'psoriasis', 'acne', 'rosacea',
      'cellulitis', 'abscess', 'gangrene', 'sepsis', 'meningitis', 'encephalitis',
      'epilepsy', 'parkinson', 'alzheimer', 'dementia', 'schizophrenia',
      'bipolar', 'arthritis', 'osteoporosis', 'fibromyalgia', 'lupus',
      'multiple sclerosis', 'crohn', 'ibs', 'gerd', 'hypothyroidism',
      'hyperthyroidism', 'kidney stones', 'gallstones', 'hernia', 'prolapse'
    ],
    
    // Medications
    medications: [
      'aspirin', 'ibuprofen', 'acetaminophen', 'paracetamol', 'antibiotic',
      'antacid', 'insulin', 'steroid', 'antihistamine', 'decongestant',
      'cough syrup', 'pain reliever', 'anti-inflammatory', 'blood thinner',
      'beta blocker', 'diuretic', 'antidepressant', 'anxiolytic', 'sedative',
      'muscle relaxant', 'vaccine', 'immunization', 'supplement', 'vitamin'
    ]
  },

  'hi-IN': {
    // Hindi medical keywords
    symptoms: [
      'खांसी', 'बुखार', 'सिरदर्द', 'जी मिचलाना', 'उल्टी', 'दस्त', 'कब्ज',
      'थकान', 'कमजोरी', 'चक्कर आना', 'सीने में दर्द', 'सांस लेने में तकलीफ',
      'पेट दर्द', 'कमर दर्द', 'जोड़ों में दर्द', 'मांसपेशियों में दर्द', 'गले में खराश',
      'नाक बहना', 'जुकाम', 'छींक आना', 'दाने', 'खुजली', 'सूजन',
      'पेट फूलना', 'सीने में जलन', 'अपच', 'भूख न लगना', 'वजन कम होना',
      'वजन बढ़ना', 'नींद न आना', 'चिंता', 'अवसाद', 'तनाव', 'घबराहट',
      'दिल की धड़कन तेज', 'हाई ब्लड प्रेशर', 'लो ब्लड प्रेशर', 'मधुमेह',
      'दमा', 'एलर्जी', 'माइग्रेन', 'चक्कर', 'कान में आवाज', 'धुंधला दिखना'
    ],
    
    bodyParts: [
      'सिर', 'दिमाग', 'खोपड़ी', 'चेहरा', 'माथा', 'आंख', 'नाक', 'मुंह',
      'होंठ', 'जीभ', 'दांत', 'मसूड़े', 'जबड़ा', 'ठोड़ी', 'गाल', 'कान',
      'गर्दन', 'गला', 'छाती', 'स्तन', 'फेफड़े', 'दिल', 'पसली', 'पीठ',
      'रीढ़', 'कंधा', 'बाह', 'कोहनी', 'हाथ', 'उंगली', 'अंगूठा', 'पेट',
      'लीवर', 'किडनी', 'मूत्राशय', 'आंत', 'कमर', 'नितंब', 'जांघ', 'पैर',
      'घुटना', 'टखना', 'पांव', 'एड़ी', 'त्वचा', 'मांसपेशी', 'हड्डी', 'जोड़'
    ],
    
    conditions: [
      'उच्च रक्तचाप', 'निम्न रक्तचाप', 'हृदय गति तेज', 'हृदय गति धीमी',
      'हृदय की अनियमित धड़कन', 'हृदयाघात', 'स्ट्रोक', 'खून की कमी',
      'कैंसर', 'ट्यूमर', 'अल्सर', 'निमोनिया', 'दमा', 'मिर्गी', 'पार्किंसन'
    ],
    
    medications: [
      'एस्पिरिन', 'आइबूप्रोफेन', 'पैरासिटामोल', 'एंटीबायोटिक', 'एंटासिड',
      'इंसुलिन', 'स्टेरॉयड', 'एंटीहिस्टामाइन', 'खांसी की दवा', 'दर्द निवारक'
    ]
  },

  'mr-IN': {
    // Marathi medical keywords
    symptoms: [
      'खोकला', 'ताप', 'डोकेदुखी', 'मळमळ', 'उलट्या', 'जुलाब', 'बद्धकोष्ठता',
      'थकवा', 'अशक्तपणा', 'चक्कर येणे', 'छातीत दुखणे', 'श्वास घेण्यात त्रास',
      'पोटदुखी', 'पाठदुखी', 'सांधेदुखी', 'स्नायूंची दुखणे', 'घशाचा दुखणे',
      'नाकातून पाणी येणे', 'सर्दी', 'शिंका येणे', 'पुरळ', 'खाज', 'सूज',
      'पोट फुगणे', 'छातीत जळजळ', 'अपचन', 'भूक न लागणे', 'वजन कमी होणे',
      'वजन वाढणे', 'झोप न येणे', 'चिंता', 'नैराश्य', 'तणाव', 'घाबरणे'
    ],
    
    bodyParts: [
      'डोके', 'मेंदू', 'कवटी', 'चेहरा', 'कपाळ', 'डोळा', 'नाक', 'तोंड',
      'ओठ', 'जीभ', 'दात', 'हिरड्या', 'जबडा', 'हनुवटी', 'गाल', 'कान',
      'मान', 'घसा', 'छाती', 'स्तन', 'फुफ्फुस', 'हृदय', 'फासळी', 'पाठ',
      'मणक्याचे', 'खांदा', 'बाह', 'कोपर', 'हात', 'बोट', 'अंगठा', 'पोट',
      'यकृत', 'मूत्रपिंड', 'मूत्राशय', 'आतडे', 'कंबर', 'नितंब', 'मांडी', 'पाय',
      'गुडघा', 'घोटा', 'पाऊल', 'टाच', 'त्वचा', 'स्नायू', 'हाड', 'सांधे'
    ],
    
    conditions: [
      'उच्च रक्तदाब', 'कमी रक्तदाब', 'हृदयाचा वेगवान ठोका', 'हृदयविकार',
      'हृदयाघात', 'पक्षाघात', 'रक्ताची कमतरता', 'कर्करोग', 'ट्यूमर', 'व्रण'
    ],
    
    medications: [
      'अ‍ॅस्पिरिन', 'आयब्यूप्रोफेन', 'पॅरासिटामॉल', 'प्रतिजैविक', 'अँटासिड'
    ]
  },

  'kn-IN': {
    // Kannada medical keywords  
    symptoms: [
      'ಕೆಮ್ಮು', 'ಜ್ವರ', 'ತಲೆನೋವು', 'ವಾಕರಿಕೆ', 'ವಾಂತಿ', 'ಅತಿಸಾರ', 'ಮಲಬದ್ಧತೆ',
      'ಆಯಾಸ', 'ದೌರ್ಬಲ್ಯ', 'ತಲೆತಿರುಗುವಿಕೆ', 'ಎದೆನೋವು', 'ಉಸಿರಾಟದ ತೊಂದರೆ',
      'ಹೊಟ್ಟೆನೋವು', 'ಬೆನ್ನುನೋವು', 'ಕೀಲುನೋವು', 'ಸ್ನಾಯುನೋವು', 'ಗಂಟಲು ನೋವು',
      'ಮೂಗಿನಿಂದ ನೀರು', 'ಶೀತ', 'ಸೀನುವಿಕೆ', 'ರಾಶ್', 'ಸುರಿಕೆ', 'ಊತ',
      'ಹೊಟ್ಟೆ ಉಬ್ಬುವಿಕೆ', 'ಎದೆಯಲ್ಲಿ ಸುಡುವಿಕೆ', 'ಅಜೀರ್ಣ', 'ಹಸಿವಿಲ್ಲದಿರುವಿಕೆ'
    ],
    
    bodyParts: [
      'ತಲೆ', 'ಮೆದುಳು', 'ತಲೆಬುರುಡೆ', 'ಮುಖ', 'ಹಣೆ', 'ಕಣ್ಣು', 'ಮೂಗು', 'ಬಾಯಿ',
      'ತುಟಿ', 'ನಾಲಿಗೆ', 'ಹಲ್ಲು', 'ಒಸಡು', 'ದವಡೆ', 'ಕೆನ್ನೆ', 'ಕಿವಿ',
      'ಕುತ್ತಿಗೆ', 'ಗಂಟಲು', 'ಎದೆ', 'ಸ್ತನ', 'ಶ್ವಾಸಕೋಶ', 'ಹೃದಯ', 'ಪಕ್ಕೆ',
      'ಬೆನ್ನು', 'ಬೆನ್ನುಮೂಳೆ', 'ಭುಜ', 'ತೋಳು', 'ಮೊಣಕೈ', 'ಕೈ', 'ಬೆರಳು',
      'ಹೊಟ್ಟೆ', 'ಯಕೃತ್ತು', 'ಮೂತ್ರಪಿಂಡ', 'ಮೂತ್ರಕೋಶ', 'ಕರುಳು', 'ಸೊಂಟ',
      'ತೊಡೆ', 'ಕಾಲು', 'ಮೊಣಕಾಲು', 'ಪಾದ', 'ಚರ್ಮ', 'ಸ್ನಾಯು', 'ಮೂಳೆ'
    ],
    
    conditions: [
      'ಅಧಿಕ ರಕ್ತದೊತ್ತಡ', 'ಕಡಿಮೆ ರಕ್ತದೊತ್ತಡ', 'ಹೃದಯಾಘಾತ', 'ಪಾರ್ಶ್ವಘಾತ',
      'ರಕ್ತಹೀನತೆ', 'ಕ್ಯಾನ್ಸರ್', 'ಟ್ಯೂಮರ್', 'ಹುಣ್ಣು', 'ನ್ಯುಮೋನಿಯಾ', 'ಆಸ್ತಮಾ'
    ],
    
    medications: [
      'ಆಸ್ಪಿರಿನ್', 'ಪ್ಯಾರಸಿಟಮಾಲ್', 'ಪ್ರತಿಜೀವಕ', 'ಆಂಟಾಸಿಡ್', 'ಇನ್ಸುಲಿನ್'
    ]
  }
};

// Get all medical keywords for a specific language
const getAllKeywordsForLanguage = (languageCode) => {
  // Map language codes to database keys
  const languageMap = {
    'en-US': 'en',
    'hi-IN': 'hi',
    'mr-IN': 'mr',
    'kn-IN': 'kn',
    'ta-IN': 'en', // Fallback to English for Tamil (can be expanded later)
    'te-IN': 'en', // Fallback to English for Telugu (can be expanded later)
    'gu-IN': 'en', // Fallback to English for Gujarati (can be expanded later)
    'bn-IN': 'en', // Fallback to English for Bengali (can be expanded later)
    'pa-IN': 'en', // Fallback to English for Punjabi (can be expanded later)
    'ur-IN': 'en'  // Fallback to English for Urdu (can be expanded later)
  };
  
  const langKey = languageMap[languageCode] || 'en';
  const langData = medicalKeywordsDatabase[langKey] || medicalKeywordsDatabase.en;
  
  return [
    ...langData.symptoms,
    ...langData.bodyParts,
    ...langData.conditions,
    ...langData.medications
  ];
};



// Medical keyword extraction utility
export const extractMedicalKeywords = (text, languageCode = 'en-US') => {
  // Get medical keywords for the specified language
  const medicalKeywords = getAllKeywordsForLanguage(languageCode);

  // Convert text to lowercase for matching
  const lowerText = text.toLowerCase();
  
  // Extract words from text
  const words = lowerText.match(/[\u0900-\u097F\u0A00-\u0A7F\u0C00-\u0C7F\w]+/g) || [];
  
  // Find medical keywords
  const foundKeywords = [];
  
  medicalKeywords.forEach(keyword => {
    // Handle both English and Indic scripts
    const keywordRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    if (keywordRegex.test(text)) {
      foundKeywords.push(keyword);
    }
  });
  
  // Remove duplicates and sort
  const uniqueKeywords = [...new Set(foundKeywords)].sort();
  
  return {
    extractedKeywords: uniqueKeywords,
    originalText: text,
    keywordCount: uniqueKeywords.length,
    language: languageCode
  };
};

// Language options for speech recognition
export const supportedLanguages = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'मराठी (Marathi)', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'te-IN', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)', flag: '🇮🇳' },
  { code: 'ur-IN', name: 'اردو (Urdu)', flag: '🇮🇳' }
];

// Speech recognition utility for medical audio recording
export class MedicalSpeechRecognition {
  constructor(languageCode = 'en-US') {
    this.recognition = null;
    this.isListening = false;
    this.transcript = '';
    this.languageCode = languageCode;
    this.onResult = null;
    this.onError = null;
    this.onEnd = null;
  }

  initialize(languageCode = this.languageCode) {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = languageCode;
    this.recognition.maxAlternatives = 1;
    this.languageCode = languageCode;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('Speech recognition started');
    };

    this.recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      this.transcript = finalTranscript;
      
      if (this.onResult) {
        this.onResult({
          finalTranscript,
          interimTranscript,
          isComplete: finalTranscript.length > 0
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      this.isListening = false;
      if (this.onError) {
        this.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log('Speech recognition ended');
      if (this.onEnd) {
        this.onEnd();
      }
    };
  }

  start() {
    if (!this.recognition) {
      this.initialize();
    }
    
    if (!this.isListening) {
      this.transcript = '';
      this.recognition.start();
    }
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  changeLanguage(languageCode) {
    const wasListening = this.isListening;
    if (wasListening) {
      this.stop();
    }
    
    this.languageCode = languageCode;
    this.recognition = null; // Force re-initialization with new language
    
    if (wasListening) {
      // Wait a bit before restarting with new language
      setTimeout(() => {
        this.start();
      }, 100);
    }
  }

  getLanguage() {
    return this.languageCode;
  }

  getTranscript() {
    return this.transcript;
  }

  isRecording() {
    return this.isListening;
  }
}
