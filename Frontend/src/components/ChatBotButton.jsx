import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Mic, Square } from "lucide-react";
import { useSelector } from "react-redux";

const ChatBotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", content: "Hello! I am your medical assistant. How can I help you today?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_URL = "http://127.0.0.1:8000/chat";

  const toggleChat = () => {
    setIsOpen(!isOpen);
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
    recognition.lang = "en-US";

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
    setIsLoading(true);

    try {
      const payload = {
        prompt: inputMessage,
        user_data: {
          name: user?.name || "Guest",
          medical_history: user?.medicalHistory || "No medical history available",
          age: user?.age || "Unknown",
          conditions: user?.conditions || [],
          medications: user?.medications || []
        }
      };
 const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { type: "bot", content: data.response, timestamp: new Date().toISOString() }
        ]);

        // Speak the response
        speakResponse(data.response);
      } else {
        throw new Error("Invalid response format");
      }
     
    } catch (error) {
      console.log("Error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "bot", content: "Sorry, I encountered an error. Please try again.", timestamp: new Date().toISOString() }
      ]);
    } finally {
      setIsLoading(false);
      setInputMessage("");
    }
  };

  // Speak Response
  const speakResponse = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    speechSynthesisRef.current.speak(utterance);
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-32 right-6 w-14 h-14 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors z-50"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-52 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
          <div className="bg-gray-800 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-medium">AI Assistant</h3>
            {isSpeaking && (
              <button onClick={stopSpeaking} className="text-red-500">
                <Square className="w-5 h-5" />
              </button>
            )}
          </div>

          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-lg p-3 max-w-[80%] ${
                      message.type === "user" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm">Typing...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t p-4 bg-gray-800 rounded-b-lg">
            <div className="flex gap-2">
              <button
                onClick={toggleListening}
                className={`p-2 rounded-lg text-white ${isListening ? "bg-red-500 " : "bg-gray-700 hover:bg-gray-600"}`}
              >
                <Mic className="w-5 h-5 text-white" />
              </button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-700 bg-gray-700 text-white placeholder-gray-300"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBotButton;