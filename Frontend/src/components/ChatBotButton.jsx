import React, { useState, useRef, useEffect } from "react";
import { X, Mic, Square, Globe, Send } from "lucide-react";
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
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
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
    setShowLanguageSelector(false);
  };

  const toggleLanguageSelector = () => {
    setShowLanguageSelector(!showLanguageSelector);
  };

  const selectLanguage = (langCode) => {
    setSelectedLanguage(langCode);
    setShowLanguageSelector(false);
    
    const langOption = languageOptions.find(lang => lang.code === langCode);
    if (langOption) {
      setMessages([{ type: "bot", content: langOption.welcomeMessage }]);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    recognition.lang = selectedLanguage;

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

  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { type: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const languageCode = selectedLanguage.split("-")[0];
      
      const payload = {
        prompt: inputMessage,
        user_data: {
          name: user?.name || "Guest",
          medical_history: user?.medicalHistory || "No medical history available",
          age: user?.age || "Unknown",
          conditions: user?.conditions || [],
          medications: user?.medications || []
        },
        language: languageCode
      };
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const data = await response.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: data.response, timestamp: new Date().toISOString() }
        ]);
        speakResponse(data.response);
      } else {
        throw new Error("Invalid response format");
      }
      
    } catch (error) {
      console.error("Error in sendMessage:", error);
      
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

  const speakResponse = (text) => {
    if (!text) return;
    
    stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    const voices = speechSynthesisRef.current.getVoices();
    const languagePrefix = selectedLanguage.split("-")[0];
    const languageVoices = voices.filter(voice => voice.lang.startsWith(languagePrefix));
    
    if (languageVoices.length > 0) {
      utterance.voice = languageVoices[0];
    }

    speechSynthesisRef.current.speak(utterance);
  };

  const getInputPlaceholder = () => {
    const placeholders = {
      "en-US": "Ask Arogya AI a question...",
      "hi-IN": "आरोग्य AI से प्रश्न पूछें...",
      "mr-IN": "आरोग्य AI ला प्रश्न विचारा..."
    };
    return placeholders[selectedLanguage] || placeholders["en-US"];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={toggleChat}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform ${
            isOpen ? "rotate-90 bg-rose-500" : "bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <div className="relative">
              {/* Previous chatbot icon */}
              <img 
                src="src/assets/chat-bot.jpeg" 
                className="w-12 h-12 object-contain" 
                alt="Chat with Arogya AI" 
              />
              {messages.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-ping">
                  <span className="animate-pulse">!</span>
                </div>
              )}
            </div>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-100 overflow-hidden backdrop-blur-sm bg-opacity-90">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Previous small chatbot icon in header */}
              <img 
                src="src/assets/noun-chatbot-1718966-picaai-removebg-preview.jpeg" 
                className="w-8 h-8" 
                alt="Arogya AI" 
              />
              <div>
                <h3 className="text-white font-semibold">Arogya AI</h3>
                <p className="text-xs text-indigo-100">Your personal health assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleLanguageSelector} 
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                title="Select language"
              >
                <Globe className="w-4 h-4 text-white" />
              </button>
              {isSpeaking && (
                <button 
                  onClick={stopSpeaking} 
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  <Square className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Language Selector Dropdown */}
          {showLanguageSelector && (
            <div className="absolute right-4 top-16 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden animate-fade-in">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50">Select Language</div>
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 transition-colors ${
                    selectedLanguage === lang.code ? "bg-indigo-100 text-indigo-700 font-medium" : "text-gray-700"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}

          {/* Chat Container */}
          <div 
            ref={chatContainerRef} 
            className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 transition-all duration-200 ${
                      message.type === "user" 
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none shadow-md"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={`text-xs mt-1.5 ${
                      message.type === "user" ? "text-indigo-200" : "text-gray-500"
                    }`}>
                      {new Date(message.timestamp || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm rounded-bl-none max-w-[85%]">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all ${
                  isListening 
                    ? "bg-rose-500 text-white animate-pulse" 
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={getInputPlaceholder()}
                className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent bg-white text-gray-800 placeholder-gray-500 transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`p-3 rounded-full transition-all ${
                  isLoading || !inputMessage.trim()
                    ? "bg-gray-300 text-gray-500"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-3 text-xs text-center text-gray-400">
              <span>Powered by CureConnect • {languageOptions.find(lang => lang.code === selectedLanguage)?.name}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotButton;