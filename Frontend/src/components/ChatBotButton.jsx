import React, { useState, useRef, useEffect } from "react";
import { X, Mic, Square, Globe } from "lucide-react";
import { useSelector } from "react-redux";

const ChatBotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US"); // Default to English
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const API_URL = "http://127.0.0.1:8000/chat";

  // Language options
  const languageOptions = [
    { code: "en-US", name: "English", welcomeMessage: "Hello! I am Arogya AI. How can I help you today?" },
    { code: "hi-IN", name: "Hindi", welcomeMessage: "नमस्ते! मैं आरोग्य AI हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?" },
    { code: "mr-IN", name: "Marathi", welcomeMessage: "नमस्कार! मी आरोग्य AI आहे. आज मी तुमची कशी मदत करू शकतो?" }
  ];

  // Initialize welcome message based on default language
  useEffect(() => {
    const welcomeMsg = languageOptions.find(lang => lang.code === selectedLanguage)?.welcomeMessage;
    setMessages([{ type: "bot", content: welcomeMsg }]);
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowLanguageSelector(false); // Close language selector when chat is toggled
  };

  const toggleLanguageSelector = () => {
    setShowLanguageSelector(!showLanguageSelector);
  };

  const selectLanguage = (langCode) => {
    setSelectedLanguage(langCode);
    setShowLanguageSelector(false);
    
    // Display welcome message in the newly selected language
    const langOption = languageOptions.find(lang => lang.code === langCode);
    if (langOption) {
      setMessages([{ type: "bot", content: langOption.welcomeMessage }]);
    }

    // Log to verify language change
    console.log(`Language changed to: ${langCode}`);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start/Stop Speech-to-Text (Voice Input)
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = selectedLanguage; // Use selected language for speech recognition

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Stop Speech Synthesis
  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Send Message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Get language code without region (en, hi, mr)
      const languageCode = selectedLanguage.split("-")[0];
      console.log(`Sending request with language: ${languageCode}`);
      
      const payload = {
        prompt: inputMessage,
        user_data: {
          name: user?.name || "Guest",
          medical_history: user?.medicalHistory || "No medical history available",
          age: user?.age || "Unknown",
          conditions: user?.conditions || [],
          medications: user?.medications || []
        },
        language: languageCode // Send language code to backend
      };
      
      console.log("Sending payload to backend:", payload);
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error(`Backend error: ${response.status}`);
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from backend:", data);

      if (data.response) {
        // The backend should now return text in the requested language
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: data.response, timestamp: new Date().toISOString() }
        ]);

        // Speak the response (which is already in the requested language)
        speakResponse(data.response);
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format");
      }
      
    } catch (error) {
      console.error("Error in sendMessage:", error);
      
      // Error messages in different languages
      const errorMessages = {
        "en": "Sorry, I encountered an error. Please try again.",
        "hi": "क्षमा करें, मुझे एक त्रुटि मिली। कृपया पुनः प्रयास करें।",
        "mr": "क्षमा करा, मला एक त्रुटी आली. कृपया पुन्हा प्रयत्न करा."
      };
      
      const languageCode = selectedLanguage.split("-")[0];
      const errorMessage = errorMessages[languageCode] || errorMessages["en"];
      
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: errorMessage, timestamp: new Date().toISOString() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Speak Response
  const speakResponse = (text) => {
    if (!text) return;
    
    stopSpeaking(); // Stop any ongoing speech first
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage; // Set the language for speech synthesis
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    // Make sure voices are loaded
    const voices = speechSynthesisRef.current.getVoices();
    
    // Try to find a voice matching the language
    const languagePrefix = selectedLanguage.split("-")[0];
    console.log(`Looking for voice with language: ${languagePrefix}`);
    
    const languageVoices = voices.filter(voice => voice.lang.startsWith(languagePrefix));
    console.log(`Found ${languageVoices.length} matching voices`);
    
    if (languageVoices.length > 0) {
      utterance.voice = languageVoices[0];
      console.log(`Using voice: ${languageVoices[0].name}`);
    } else {
      console.warn(`No matching voice found for ${selectedLanguage}, using default`);
    }

    speechSynthesisRef.current.speak(utterance);
  };

  // Get placeholder text based on selected language
  const getInputPlaceholder = () => {
    const placeholders = {
      "en-US": "Ask Arogya AI a question...",
      "hi-IN": "आरोग्य AI से प्रश्न पूछें...",
      "mr-IN": "आरोग्य AI ला प्रश्न विचारा..."
    };
    return placeholders[selectedLanguage] || placeholders["en-US"];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* 3D Doctor Avatar Button without background */}
      <button
        onClick={toggleChat}
        className="fixed bottom-24 right-6 w-20 h-20 flex items-center justify-center z-50 transition-transform hover:scale-105"
        style={{ background: "none", border: "none" }}
      >
        {!isOpen && (
          <div className="relative">
            {/* 3D Doctor SVG Avatar */}
            <svg viewBox="0 0 120 120" className="w-20 h-20 drop-shadow-xl">
              {/* Head/Face base with gradient */}
              <defs>
                <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="10%" stopColor="#e0f2fe" />
                  <stop offset="90%" stopColor="#bae6fd" />
                </linearGradient>
                <linearGradient id="coatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                </filter>
                <radialGradient id="glassesGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                  <stop offset="0%" stopColor="#475569" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8"/>
                </radialGradient>
              </defs>
              
              {/* Head */}
              <ellipse cx="60" cy="42" rx="30" ry="32" fill="url(#headGradient)" stroke="#0284c7" strokeWidth="1.5" filter="url(#shadow)" />
              
              {/* Ears */}
              <ellipse cx="30" cy="42" rx="5" ry="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
              <ellipse cx="90" cy="42" rx="5" ry="8" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
              
              {/* Doctor's coat */}
              <path d="M30 60 L30 100 L50 110 L70 110 L90 100 L90 60 Q75 70 60 70 Q45 70 30 60" fill="url(#coatGradient)" filter="url(#shadow)" />
              
              {/* Collar */}
              <path d="M40 65 L50 75 L60 70 L70 75 L80 65" fill="white" stroke="#0284c7" strokeWidth="1" />
              
              {/* Stethoscope */}
              <path d="M50 80 Q45 90 55 95 Q65 100 75 90" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
              <circle cx="75" cy="90" r="4" fill="#0f172a" />
              
              {/* Face features */}
              {/* Glasses */}
              <path d="M40 40 L55 40 M65 40 L80 40" stroke="#0f172a" strokeWidth="2" />
              <ellipse cx="47" cy="40" rx="8" ry="7" fill="none" stroke="url(#glassesGradient)" strokeWidth="2" />
              <ellipse cx="73" cy="40" rx="8" ry="7" fill="none" stroke="url(#glassesGradient)" strokeWidth="2" />
              
              {/* Eyes */}
              <ellipse cx="47" cy="40" rx="3" ry="4" fill="#0f172a" />
              <ellipse cx="73" cy="40" rx="3" ry="4" fill="#0f172a" />
              
              {/* Smile */}
              <path d="M50 52 Q60 58 70 52" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
              
              {/* Hair/Cap */}
              <path d="M30 30 Q60 10 90 30 L85 35 Q60 20 35 35 Z" fill="#0284c7" filter="url(#shadow)" />
            </svg>
            
            {/* Notification Badge */}
            {!isOpen && messages.length > 1 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                !
              </div>
            )}
          </div>
        )}
        {isOpen && <X className="w-8 h-8 text-blue-600 bg-white rounded-full p-1 shadow-lg" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-44 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col border border-blue-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              {/* Small Doctor 3D Avatar */}
              <div className="w-10 h-10 mr-2 flex items-center justify-center">
                <svg viewBox="0 0 120 120" className="w-10 h-10 drop-shadow-md">
                  {/* Reuse the same SVG patterns but smaller */}
                  <defs>
                    <linearGradient id="smallHeadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="10%" stopColor="#e0f2fe" />
                      <stop offset="90%" stopColor="#bae6fd" />
                    </linearGradient>
                    <linearGradient id="smallCoatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                  
                  {/* Head */}
                  <ellipse cx="60" cy="42" rx="30" ry="32" fill="url(#smallHeadGradient)" stroke="#0284c7" strokeWidth="1.5" />
                  
                  {/* Doctor's coat */}
                  <path d="M30 60 L30 100 L50 110 L70 110 L90 100 L90 60 Q75 70 60 70 Q45 70 30 60" fill="url(#smallCoatGradient)" />
                  
                  {/* Face features */}
                  <ellipse cx="47" cy="40" rx="8" ry="7" fill="none" stroke="#0f172a" strokeWidth="2" />
                  <ellipse cx="73" cy="40" rx="8" ry="7" fill="none" stroke="#0f172a" strokeWidth="2" />
                  <ellipse cx="47" cy="40" rx="3" ry="4" fill="#0f172a" />
                  <ellipse cx="73" cy="40" rx="3" ry="4" fill="#0f172a" />
                  <path d="M50 52 Q60 58 70 52" fill="none" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
                  
                  {/* Hair/Cap */}
                  <path d="M30 30 Q60 10 90 30 L85 35 Q60 20 35 35 Z" fill="#0284c7" />
                </svg>
              </div>
              <h3 className="text-white font-medium">Arogya AI Assistant</h3>
            </div>
            <div className="flex items-center">
              {/* Language selector button */}
              <button 
                onClick={toggleLanguageSelector} 
                className="text-white mr-2 bg-blue-700 rounded-full p-1 shadow-md hover:bg-blue-800"
                title="Select language"
              >
                <Globe className="w-4 h-4" />
              </button>
              {isSpeaking && (
                <button onClick={stopSpeaking} className="text-white bg-red-500 rounded-full p-1 shadow-md">
                  <Square className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Language Selector Dropdown */}
          {showLanguageSelector && (
            <div className="absolute right-0 top-12 w-40 bg-white border border-blue-200 rounded-md shadow-lg z-10">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 hover:bg-blue-50 ${
                    selectedLanguage === lang.code ? "bg-blue-100 font-medium" : ""
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}

          {/* Chat Container */}
          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  {message.type === "bot" && (
                    <div className="w-8 h-8 mr-2 flex-shrink-0">
                      <svg viewBox="0 0 120 120" className="w-8 h-8 drop-shadow-sm">
                        {/* Minimal version of doctor for chat bubbles */}
                        <ellipse cx="60" cy="42" rx="30" ry="32" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
                        <path d="M30 60 L30 100 L50 110 L70 110 L90 100 L90 60 Q75 70 60 70 Q45 70 30 60" fill="#0ea5e9" />
                        <ellipse cx="47" cy="40" rx="3" ry="4" fill="#0f172a" />
                        <ellipse cx="73" cy="40" rx="3" ry="4" fill="#0f172a" />
                        <path d="M50 52 Q60 58 70 52" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                        <path d="M30 30 Q60 15 90 30" fill="#0284c7" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 max-w-[80%] shadow-md ${
                      message.type === "user" 
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white" 
                        : "bg-white text-gray-800 border border-blue-100"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start">
                  <div className="w-8 h-8 mr-2 flex-shrink-0">
                    <svg viewBox="0 0 120 120" className="w-8 h-8 drop-shadow-sm">
                      <ellipse cx="60" cy="42" rx="30" ry="32" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
                      <path d="M30 60 L30 100 L50 110 L70 110 L90 100 L90 60 Q75 70 60 70 Q45 70 30 60" fill="#0ea5e9" />
                      <ellipse cx="47" cy="40" rx="3" ry="4" fill="#0f172a" />
                      <ellipse cx="73" cy="40" rx="3" ry="4" fill="#0f172a" />
                      <path d="M50 52 Q60 58 70 52" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                      <path d="M30 30 Q60 15 90 30" fill="#0284c7" />
                    </svg>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100 shadow-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-b-lg">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-full shadow-md ${isListening ? "bg-red-500" : "bg-blue-500 hover:bg-blue-600"}`}
              >
                <Mic className="w-4 h-4 text-white" />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-800 shadow-inner"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
              </button>
            </form>
            <div className="mt-2 text-xs text-center text-blue-500 font-medium">
              <span>Powered by CureConnect | Language: {languageOptions.find(lang => lang.code === selectedLanguage)?.name}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotButton;