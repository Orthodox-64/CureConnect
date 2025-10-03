// Test utility to demonstrate multilingual medical keyword extraction
import { extractMedicalKeywords, supportedLanguages } from './medicalKeywordExtractor.js';

// Test samples in different languages
const testSamples = {
  'en-US': [
    "I have fever and headache",
    "My stomach hurts and I feel nauseous",
    "I have chest pain and shortness of breath"
  ],
  'hi-IN': [
    "मुझे बुखार और सिरदर्द है",
    "मेरे पेट में दर्द है और मतली आ रही है", 
    "मुझे सीने में दर्द और सांस लेने में तकलीफ है"
  ],
  'mr-IN': [
    "मला ताप आणि डोकेदुखी आहे",
    "माझ्या पोटात दुखत आहे आणि मला मळमळत आहे",
    "मला छातीत दुखत आहे आणि श्वास घेण्यात अडचण येत आहे"
  ],
  'kn-IN': [
    "ನನಗೆ ಜ್ವರ ಮತ್ತು ತಲೆ ನೋವು ಇದೆ",
    "ನನ್ನ ಹೊಟ್ಟೆ ನೋವಾಗುತ್ತಿದೆ ಮತ್ತು ವಾಂತಿ ಬರುತ್ತಿದೆ",
    "ನನಗೆ ಎದೆ ನೋವು ಮತ್ತು ಉಸಿರಾಟದ ತೊಂದರೆ ಇದೆ"
  ]
};

// Function to test multilingual keyword extraction
export const testMultilingualExtraction = () => {
  console.log('🌍 Testing Multilingual Medical Keyword Extraction\n');
  
  Object.entries(testSamples).forEach(([languageCode, samples]) => {
    const language = supportedLanguages.find(lang => lang.code === languageCode);
    console.log(`\n${language.flag} ${language.name}:`);
    console.log('='.repeat(50));
    
    samples.forEach((sample, index) => {
      const result = extractMedicalKeywords(sample, languageCode);
      console.log(`\nSample ${index + 1}:`);
      console.log(`Input: "${sample}"`);
      console.log(`Keywords Found: [${result.extractedKeywords.join(', ')}]`);
      console.log(`Keyword Count: ${result.keywordCount}`);
    });
  });
  
  console.log('\n✅ Multilingual Testing Complete!');
  console.log('\nSupported Languages:');
  supportedLanguages.forEach(lang => {
    console.log(`${lang.flag} ${lang.name} (${lang.code})`);
  });
};

// Test function for browser console
export const runLanguageTest = () => {
  testMultilingualExtraction();
  return 'Check console for test results!';
};

// Export for window object (for browser testing)
if (typeof window !== 'undefined') {
  window.testMultilingualKeywords = runLanguageTest;
}
