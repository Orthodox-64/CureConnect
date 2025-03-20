import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Hero.css";

function Card({ icon, title, description, route, role }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleClick = (e) => {
    e.preventDefault();

    if (route === "telemedicine") {
      // Redirect ONLY telemedicine to the external site
      window.open(
        "https://video-call-final-git-main-orthodox-64s-projects.vercel.app/",
        "_blank",
        "noopener,noreferrer"
      );
    } else if (route.startsWith("/")) {
      // Navigate for internal routes
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
      icon: "🚑",
      title: t("navbar.emergency"),
      description: t("cards.emergency"),
      route: "/emergency",
      role: "patient",
    },
    {
      icon: "🧑🏻‍⚕️",
      title: t("navbar.appointment"),
      description: t("cards.appointment"),
      route: "/appointment",
      role: "doctor",
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
        // 🔹 Open external telemedicine site
        window.open(
          "https://video-call-final-git-main-orthodox-64s-projects.vercel.app/",
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        const matchedCard = cards.find((card) =>
          transcript.includes(card.title.toLowerCase())
        );
        if (matchedCard) {
          navigate(matchedCard.route);
        }
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

  return (
    <div className="hero-section">
      <button className="listen-button" onClick={toggleListening}>
        {isListening ? "🛑 Stop Listening" : "🎙️ Start Listening"}
      </button>

      <div className={user?.role === "doctor" ? "cards-grid-doctor" : "cards-grid-patient"}>
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

export default Cards;