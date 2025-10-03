import  { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Hero.css";

function Card({ icon, title, description, route, role }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleClick = (e) => {
    e.preventDefault();

    if (route.startsWith("/")) {
      // Navigate for internal routes
      navigate(route);
    } else {
      navigate(route);
    }
  };

  return (
    <a onClick={handleClick} className="card" style={{ cursor: "pointer" }}>
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
    </a>
  );
}

function Cards() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);

  const cards = [
    {
      icon: "📞",
      title: t("navbar.telemedicine"),
      description: t("cards.telemedicine"),
      route: "telemedicine",
      role: "doctor",
    },
    {
      icon: "🏥",
      title: t("navbar.analysis"),
      description: t("cards.medical_analysis"),
      route: "/analysis",
      role: "doctor",
    },
    {
      icon: "😷",
      title: t("navbar.health_tips"),
      description: t("cards.health_tips"),
      route: "/health",
      role: "patient",
    },
    {
      icon: "🩺",
      title: t("navbar.consult"),
      description: t("cards.consulting"),
      route: "/chat",
      role: "doctor",
    },
    {
      icon: "⌚️",
      title: t("navbar.watch"),
      description: t("cards.watch"),
      route: "/watch",
      role: "patient",
    },
  ];

  const filteredCards = cards.filter((card) => {
    if (user && user.role === "doctor") {
      return card.role === "doctor";
    }
    return true; // Patients can access all cards
  });

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false;
    speechRecognition.lang = "en-US";

    speechRecognition.onstart = () => setIsListening(true);
    speechRecognition.onend = () => setIsListening(false);

    speechRecognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Recognized:", transcript);

      if (transcript.includes("open telemedicine")) {
        // Open external telemedicine site
        window.open(
          "https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=general",
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        const matchedCard = cards.find((card) =>
          transcript.includes(card.title.toLowerCase())
        );
        if (matchedCard) {
          if (matchedCard.route === "telemedicine") {
            window.open(
              "https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=general",
              "_blank",
              "noopener,noreferrer"
            );
          } else {
            navigate(matchedCard.route);
          }
        }
      }
    };

    setRecognition(speechRecognition);
  }, [navigate, cards]);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <div className="hero-section">
      <button
        className="listen-button rounded-full shadow-lg flex items-center justify-center px-6 py-3 transition-all duration-300 hover:scale-105"
        onClick={toggleListening}
        style={{
          background: isListening
            ? "linear-gradient(to right, #f87171, #ef4444)"
            : "linear-gradient(to right, #60a5fa, #3b82f6)",
          color: "white",
          border: "none",
          maxWidth: "200px",
          margin: "0 auto 2rem",
        }}
      >
        <span className="mr-2 text-xl">{isListening ? "🛑" : "🎙️"}</span>
        <span>{isListening ? "Stop Listening" : "Start Listening"}</span>
      </button>

      <div
        className={
          user && user.role === "doctor"
            ? "cards-grid-doctor"
            : "cards-grid-patient"
        }
      >
        {filteredCards.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            title={card.title}
            description={card.description}
            role={card.role}
            route={card.route}
          />
        ))}
      </div>
    </div>
  );
}

const HealthcareCards = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.user);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Speech recognition setup for the Tailwind version
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech Recognition not supported in this browser.");
      return;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = false;
    speechRecognition.lang = "en-US";

    speechRecognition.onstart = () => setIsListening(true);
    speechRecognition.onend = () => setIsListening(false);

    speechRecognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log("Recognized:", transcript);

      if (transcript.includes("telemedicine")) {
        // Open external telemedicine site
        window.open(
          "https://video-call-final-git-main-orthodox-64s-projects.vercel.app/?roomID=general",
          "_blank",
          "noopener,noreferrer"
        );
      } else if (transcript.includes("analysis")) {
        navigate("/analysis");
      } else if (transcript.includes("health tips")) {
        navigate("/health");
      } else if (transcript.includes("consult")) {
        navigate("/chat");
      } else if (transcript.includes("watch")) {
        navigate("/watch");
      } else if (transcript.includes("emergency")) {
        window.open('https://cureconnect-maps-client.vercel.app/', '_blank');
      }
    };

    setRecognition(speechRecognition);
  }, [navigate]);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleCardClick = (route) => {
    navigate(route);
  };

  // Add CSS for responsive design
  const responsiveStyles = {
    container: {
      width: "100%",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    cardsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "1.5rem",
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    card: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    },
  };

  return (
    <div style={responsiveStyles.container}>
      <button
        className="mb-6 px-6 py-3 rounded-full text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl flex items-center justify-center"
        style={{
          background: isListening
            ? "linear-gradient(to right, #f87171, #ef4444)"
            : "linear-gradient(to right, #60a5fa, #3b82f6)",
          width: "auto",
          minWidth: "180px",
          maxWidth: "220px",
        }}
        onClick={toggleListening}
      >
        <span className="mr-2 text-xl">{isListening ? "🛑" : "🎙️"}</span>
        <span>{isListening ? "Stop Listening" : "Start Listening"}</span>
      </button>

      {/* Test Button */}
      {/* <div className="mb-4">
        <button 
          onClick={() => {
            console.log('Test button clicked');
            window.open('https://cureconnect-maps-client.vercel.app/', '_blank');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
        </button>
      </div> */}

      <div style={responsiveStyles.cardsContainer}>
        {/* Card 1 */}
        <div
          className="bg-blue-100 shadow-lg rounded-xl text-center p-8 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
          onClick={() => handleCardClick("telemedicine")}
          style={responsiveStyles.card}
        >
          <div className="mb-6 text-blue-600 text-5xl">📞</div>
          <h2 className="text-2xl font-bold mb-3">Telemedicine</h2>
          <p className="text-gray-600">Smart Telemedicine for Smarter Health</p>
        </div>

        {/* Card 2 */}
        <div
          className="bg-blue-100 shadow-lg rounded-xl text-center p-8 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
          onClick={() => handleCardClick("/analysis")}
          style={responsiveStyles.card}
        >
          <div className="mb-6 text-blue-600 text-5xl">🏥</div>
          <h2 className="text-2xl font-bold mb-3">Analysis</h2>
          <p className="text-gray-600">
            Get Expert Medical Insights Instantly
          </p>
        </div>

        {/* Card 3 */}
        <div
          className="bg-blue-100 shadow-lg rounded-xl text-center p-8 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
          onClick={() => handleCardClick("/health")}
          style={responsiveStyles.card}
        >
          <div className="mb-6 text-blue-600 text-5xl">😷</div>
          <h2 className="text-2xl font-bold mb-3">Health Tips</h2>
          <p className="text-gray-600">
            Daily Wellness Tips for a Healthier You
          </p>
        </div>

        {/* Card 4 */}
        <div
          className="bg-blue-100 shadow-lg rounded-xl text-center p-8 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
          onClick={() => handleCardClick("/chat")}
          style={responsiveStyles.card}
        >
          <div className="mb-6 text-blue-600 text-5xl">🩺</div>
          <h2 className="text-2xl font-bold mb-3">Consult</h2>
          <p className="text-gray-600">
            Instant Healthcare, Anytime, Anywhere
          </p>
        </div>


        {/* Card 5 - Emergency */}
        <div
          className="bg-red-100 shadow-lg rounded-xl text-center p-8 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          onClick={() => {
            console.log('Emergency card clicked - opening CureConnect Maps');
            window.open('https://cureconnect-maps-client.vercel.app/', '_blank');
          }}
          style={{...responsiveStyles.card, cursor: 'pointer'}}
        >
          <div className="mb-6 text-red-600 text-5xl">🚨</div>
          <h2 className="text-2xl font-bold mb-3">Emergency</h2>
          <p className="text-gray-600">
            Emergency Services & Hospital Locator
          </p>
          <div className="mt-4 text-sm text-red-600 font-medium">
            Click to open maps
          </div>
        </div>

        {/* Card 6 */}
        <div
          className="bg-blue-100 shadow-lg rounded-xl text-center p-8 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
          onClick={() => handleCardClick("/watch")}
          style={responsiveStyles.card}
        >
          <div className="mb-6 text-blue-600 text-5xl">⌚️</div>
          <h2 className="text-2xl font-bold mb-3">Health-Watch</h2>
          <p className="text-gray-600">
            Personalized Health Tips, Just For You
          </p>
        </div>
      </div>
    </div>
  );
};

export { Cards };
export default HealthcareCards;