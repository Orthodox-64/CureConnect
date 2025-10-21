import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, Sparkles, Award, ThumbsUp, Coffee, Moon, Sun, Utensils, Brain, Droplets, Dumbbell, Leaf, Clock, Smile, Zap, Umbrella, Apple, BookOpen } from 'lucide-react';

// Expanded health tips data
const healthTipsData = [
  {
    id: 1,
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of water daily to maintain proper hydration and support bodily functions.",
    icon: "Droplets",
    color: "bg-blue-500",
    category: "Daily Habits",
    link:"https://youtu.be/F5IuQ3k1ohI?si=HgNNoZmsMX7Uv45l"
  },
  {
    id: 2,
    title: "Mindful Eating",
    description: "Pay attention to what and when you eat. Avoid distractions like TV during meals to prevent overeating.",
    icon: "Utensils",
    color: "bg-purple-500",
    category: "Nutrition",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 3,
    title: "Regular Exercise",
    description: "Aim for at least 30 minutes of moderate physical activity most days of the week for heart health.",
    icon: "Dumbbell",
    color: "bg-green-500",
    category: "Fitness",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 4,
    title: "Quality Sleep",
    description: "Adults should get 7-9 hours of quality sleep per night to support mental and physical health.",
    icon: "Moon",
    color: "bg-indigo-500",
    category: "Rest",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 5,
    title: "Stress Management",
    description: "Practice deep breathing, meditation, or yoga to reduce stress and improve overall wellbeing.",
    icon: "Brain",
    color: "bg-red-500",
    category: "Mental Health",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 6,
    title: "Morning Sunlight",
    description: "Get 10-30 minutes of morning sunlight to regulate your circadian rhythm and boost vitamin D.",
    icon: "Sun",
    color: "bg-yellow-500",
    category: "Daily Habits",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 7,
    title: "Limit Caffeine",
    description: "Avoid caffeine after 2 PM to prevent sleep disruption and maintain healthy sleep patterns.",
    icon: "Coffee",
    color: "bg-amber-600",
    category: "Nutrition",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 8,
    title: "Strength Training",
    description: "Include resistance training 2-3 times per week to build muscle and maintain bone density.",
    icon: "Award",
    color: "bg-emerald-500",
    category: "Fitness",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 9,
    title: "Digital Detox",
    description: "Take regular breaks from screens to reduce eye strain and improve mental focus.",
    icon: "Zap",
    color: "bg-cyan-500",
    category: "Mental Health",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 10,
    title: "Balanced Diet",
    description: "Eat a variety of fruits, vegetables, lean proteins, and whole grains for optimal nutrition.",
    icon: "Apple",
    color: "bg-lime-500",
    category: "Nutrition",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 11,
    title: "Posture Check",
    description: "Be mindful of your posture throughout the day, especially when sitting for long periods.",
    icon: "ThumbsUp",
    color: "bg-teal-500",
    category: "Daily Habits",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 12,
    title: "Intermittent Fasting",
    description: "Consider a 16:8 fasting schedule to improve metabolic health and cellular repair.",
    icon: "Clock",
    color: "bg-orange-500",
    category: "Nutrition",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 13,
    title: "Nature Time",
    description: "Spend time in nature regularly to reduce stress and improve mood and cognitive function.",
    icon: "Leaf",
    color: "bg-green-600",
    category: "Mental Health",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 14,
    title: "Cardiovascular Health",
    description: "Include both high-intensity and low-intensity cardio exercises in your fitness routine.",
    icon: "Heart",
    color: "bg-pink-500",
    category: "Fitness",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 15,
    title: "Gratitude Practice",
    description: "Take time each day to acknowledge things you're grateful for to improve mental wellbeing.",
    icon: "Smile",
    color: "bg-violet-500",
    category: "Mental Health",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 16,
    title: "Proper Hydration",
    description: "Increase water intake during exercise, hot weather, or when consuming alcohol or caffeine.",
    icon: "Droplets",
    color: "bg-blue-600",
    category: "Daily Habits",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 17,
    title: "Protein Intake",
    description: "Consume 0.8-1g of protein per pound of body weight to support muscle maintenance and growth.",
    icon: "Utensils",
    color: "bg-purple-600",
    category: "Nutrition",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 18,
    title: "Flexibility Training",
    description: "Include stretching or yoga in your routine to maintain joint mobility and prevent injuries.",
    icon: "Umbrella",
    color: "bg-indigo-600",
    category: "Fitness",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 19,
    title: "Continuous Learning",
    description: "Challenge your brain with new skills or knowledge to maintain cognitive health as you age.",
    icon: "BookOpen",
    color: "bg-amber-500",
    category: "Mental Health",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 20,
    title: "Sleep Environment",
    description: "Keep your bedroom cool, dark, and quiet for optimal sleep quality and duration.",
    icon: "Moon",
    color: "bg-blue-800",
    category: "Rest",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 21,
    title: "Social Connections",
    description: "Maintain strong social relationships and engage with community to boost mental health and longevity.",
    icon: "Smile",
    color: "bg-rose-500",
    category: "Mental Health",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  },
  {
    id: 22,
    title: "Active Breaks",
    description: "Take short movement breaks every hour if you sit for long periods to improve circulation and energy.",
    icon: "Zap",
    color: "bg-sky-500",
    category: "Daily Habits",
    link:"https://youtu.be/oJSpQHcJfKs?si=j7L_08T0QlK8uaDh"
  }
];

const HealthTips = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleTips, setVisibleTips] = useState(healthTipsData);
  const [animatedTips, setAnimatedTips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const tipsPerPage = 9;

  const categories = ['All', ...new Set(healthTipsData.map(tip => tip.category))];

  // Filter tips based on category and search term
  useEffect(() => {
    let filtered = healthTipsData;
    
    // Filter by category
    if (activeCategory !== 'All') {
      filtered = filtered.filter(tip => tip.category === activeCategory);
    }
    
    // Filter by search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tip => 
        tip.title.toLowerCase().includes(term) || 
        tip.description.toLowerCase().includes(term) ||
        tip.category.toLowerCase().includes(term)
      );
    }
    
    setVisibleTips(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeCategory, searchTerm]);

  // Calculate pagination
  const indexOfLastTip = currentPage * tipsPerPage;
  const indexOfFirstTip = indexOfLastTip - tipsPerPage;
  const currentTips = visibleTips.slice(indexOfFirstTip, indexOfLastTip);
  const totalPages = Math.ceil(visibleTips.length / tipsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fixed useEffect to prevent infinite loop
  useEffect(() => {
    // Store the current tips in a ref to avoid dependency issues
    const tipsToAnimate = [...currentTips];
    
    // Animate tips appearing one by one
    setAnimatedTips([]);
    const timer = setTimeout(() => {
      const animateSequentially = async () => {
        const newAnimatedTips = [];
        for (let i = 0; i < tipsToAnimate.length; i++) {
          newAnimatedTips.push(tipsToAnimate[i].id);
          setAnimatedTips([...newAnimatedTips]);
          // Using a fixed timeout instead of a Promise to avoid potential issues
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      };
      
      animateSequentially();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [currentPage, visibleTips]); // Only depend on page changes and visible tips changes

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Heart': return <Heart className="w-6 h-6 text-white" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-white" />;
      case 'Award': return <Award className="w-6 h-6 text-white" />;
      case 'ThumbsUp': return <ThumbsUp className="w-6 h-6 text-white" />;
      case 'Coffee': return <Coffee className="w-6 h-6 text-white" />;
      case 'Moon': return <Moon className="w-6 h-6 text-white" />;
      case 'Sun': return <Sun className="w-6 h-6 text-white" />;
      case 'Utensils': return <Utensils className="w-6 h-6 text-white" />;
      case 'Brain': return <Brain className="w-6 h-6 text-white" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-white" />;
      case 'Dumbbell': return <Dumbbell className="w-6 h-6 text-white" />;
      case 'Leaf': return <Leaf className="w-6 h-6 text-white" />;
      case 'Clock': return <Clock className="w-6 h-6 text-white" />;
      case 'Smile': return <Smile className="w-6 h-6 text-white" />;
      case 'Zap': return <Zap className="w-6 h-6 text-white" />;
      case 'Umbrella': return <Umbrella className="w-6 h-6 text-white" />;
      case 'Apple': return <Apple className="w-6 h-6 text-white" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-white" />;
      default: return <Heart className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            <span className="block">Health Tips</span>
            <span className="block text-blue-600">For Your Wellbeing</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Discover simple yet effective tips to improve your health and wellness daily.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-12 max-w-3xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search health tips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-3 top-3.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            {visibleTips.length === 0 ? (
              "No health tips found. Try adjusting your filters."
            ) : (
              `Showing ${indexOfFirstTip + 1}-${Math.min(indexOfLastTip, visibleTips.length)} of ${visibleTips.length} health tips`
            )}
          </p>
        </div>

        {/* Floating Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentTips.map((tip) => (
            <div
              key={tip.id}
              className={`transform transition-all duration-700 ease-in-out ${
                animatedTips.includes(tip.id)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-16 opacity-0'
              }`}
            >
              <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col">
                <div className={`${tip.color} p-4 flex items-center justify-between`}>
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-full bg-white bg-opacity-30">
                      {getIcon(tip.icon)}
                    </div>
                    <span className="text-white font-medium">{tip.category}</span>
                  </div>
                  <div className="animate-pulse">
                    <Sparkles className="w-5 h-5 text-white opacity-70" />
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
                <div className="px-6 pb-6">
                  <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 group">
                    < button className="font-medium" onClick={()=>window.open(tip.link,"_blank")}>Learn more</button>
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === i + 1
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}

        {/* Floating Particles */}
        <div className="relative h-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500 opacity-20 animate-float"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100 - 500}px`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthTips;