import React, { useState, useEffect } from 'react';
import { Droplets, Target, TrendingUp, Award, RefreshCw, Sun, Moon, Coffee, Dumbbell, Calendar, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const WaterIntakeTracker = () => {
  const [glasses, setGlasses] = useState(0);
  const [goal, setGoal] = useState(8);
  const [customGoal, setCustomGoal] = useState('');
  const [showCustomGoal, setShowCustomGoal] = useState(false);
  const [streak, setStreak] = useState(0);
  const [todayDate, setTodayDate] = useState(new Date().toDateString());
  const [history, setHistory] = useState([]);
  const [showTips, setShowTips] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('waterIntakeData');
    if (savedData) {
      const data = JSON.parse(savedData);
      const savedDate = data.date;
      
      if (savedDate === todayDate) {
        setGlasses(data.glasses || 0);
        setGoal(data.goal || 8);
        setStreak(data.streak || 0);
        setHistory(data.history || []);
      } else {
        // New day - reset but check if goal was met yesterday
        const wasGoalMet = data.glasses >= data.goal;
        const newStreak = wasGoalMet ? (data.streak || 0) + 1 : 0;
        
        // Save yesterday's data to history
        const newHistory = [
          { date: savedDate, glasses: data.glasses, goal: data.goal, goalMet: wasGoalMet },
          ...(data.history || [])
        ].slice(0, 7); // Keep last 7 days
        
        setStreak(newStreak);
        setHistory(newHistory);
        setGlasses(0);
        
        // Save new day data
        saveData(0, data.goal || 8, newStreak, newHistory);
      }
    }
  }, [todayDate]);

  const saveData = (glassCount, goalCount, streakCount, historyData) => {
    const data = {
      date: todayDate,
      glasses: glassCount,
      goal: goalCount,
      streak: streakCount,
      history: historyData
    };
    localStorage.setItem('waterIntakeData', JSON.stringify(data));
  };

  const addGlass = () => {
    const newGlasses = glasses + 1;
    setGlasses(newGlasses);
    saveData(newGlasses, goal, streak, history);
  };

  const removeGlass = () => {
    if (glasses > 0) {
      const newGlasses = glasses - 1;
      setGlasses(newGlasses);
      saveData(newGlasses, goal, streak, history);
    }
  };

  const resetDay = () => {
    setGlasses(0);
    saveData(0, goal, streak, history);
  };

  const updateGoal = () => {
    const newGoal = parseInt(customGoal) || 8;
    setGoal(newGoal);
    setShowCustomGoal(false);
    setCustomGoal('');
    saveData(glasses, newGoal, streak, history);
  };

  const percentage = Math.min((glasses / goal) * 100, 100);
  const isGoalMet = glasses >= goal;

  const getMotivationalMessage = () => {
    const percent = percentage;
    if (percent === 0) return "Let's start hydrating! 💧";
    if (percent < 25) return "Great start! Keep it up! 🌟";
    if (percent < 50) return "You're doing amazing! 💪";
    if (percent < 75) return "Almost there! Don't stop now! 🚀";
    if (percent < 100) return "So close to your goal! 🎯";
    return "Goal achieved! You're a hydration champion! 🏆";
  };

  const hydrationTips = [
    { icon: <Sun className="w-5 h-5" />, text: "Drink a glass of water first thing in the morning" },
    { icon: <Coffee className="w-5 h-5" />, text: "Have water before coffee or tea" },
    { icon: <Dumbbell className="w-5 h-5" />, text: "Drink extra water when exercising" },
    { icon: <Moon className="w-5 h-5" />, text: "Keep a water bottle on your bedside table" },
    { icon: <Calendar className="w-5 h-5" />, text: "Set hourly reminders to drink water" },
    { icon: <Droplets className="w-5 h-5" />, text: "Infuse water with fruits for flavor" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 rounded-full animate-bounce">
              <Droplets className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Water Intake Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay hydrated, stay healthy! Track your daily water consumption
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Tracker Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Progress Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-8 text-white">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Today's Progress</p>
                    <h2 className="text-4xl font-bold">{glasses}/{goal} glasses</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-90 mb-1">Current Streak</p>
                    <div className="flex items-center justify-end">
                      <Award className="w-6 h-6 mr-2" />
                      <span className="text-3xl font-bold">{streak} days</span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="relative h-6 bg-white bg-opacity-30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all duration-500 ease-out flex items-center justify-end pr-2"
                    style={{ width: `${percentage}%` }}
                  >
                    {percentage > 10 && (
                      <span className="text-cyan-600 font-bold text-xs">
                        {Math.round(percentage)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-center mt-4 text-sm font-semibold">
                  {getMotivationalMessage()}
                </p>
              </div>

              <div className="p-8">
                {/* Water Glasses Visualization */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-4 mb-8">
                  {[...Array(goal)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (index < glasses) {
                          setGlasses(index);
                          saveData(index, goal, streak, history);
                        } else if (index === glasses) {
                          addGlass();
                        }
                      }}
                      className="group relative"
                    >
                      <div
                        className={`w-16 h-20 rounded-2xl border-4 transition-all duration-300 ${
                          index < glasses
                            ? 'bg-gradient-to-b from-cyan-400 to-blue-500 border-cyan-500 shadow-lg transform scale-105'
                            : 'bg-white border-gray-300 hover:border-cyan-400 hover:shadow-md'
                        }`}
                      >
                        <Droplets
                          className={`w-8 h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                            index < glasses ? 'text-white' : 'text-gray-300 group-hover:text-cyan-400'
                          }`}
                        />
                      </div>
                      <div className="text-xs text-gray-500 text-center mt-1">#{index + 1}</div>
                    </button>
                  ))}
                </div>

                {/* Control Buttons */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={addGlass}
                    className="flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Droplets className="w-5 h-5 mr-2" />
                    Add Glass
                  </button>
                  
                  <button
                    onClick={removeGlass}
                    disabled={glasses === 0}
                    className="flex items-center bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove Glass
                  </button>
                  
                  <button
                    onClick={resetDay}
                    className="flex items-center bg-red-100 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-200 transition-all duration-300"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Reset Day
                  </button>
                </div>

                {/* Goal Setting */}
                <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Target className="w-6 h-6 text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">Daily Goal</h3>
                    </div>
                    <button
                      onClick={() => setShowCustomGoal(!showCustomGoal)}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                    >
                      {showCustomGoal ? 'Cancel' : 'Change Goal'}
                    </button>
                  </div>
                  
                  {showCustomGoal ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={customGoal}
                        onChange={(e) => setCustomGoal(e.target.value)}
                        placeholder={`Current: ${goal}`}
                        className="flex-1 px-4 py-2 border-2 border-indigo-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={updateGoal}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Current goal: <span className="font-bold text-indigo-600">{goal} glasses</span> per day (approximately {goal * 250}ml or {(goal * 8.45).toFixed(1)} fl oz)
                    </p>
                  )}
                </div>

                {/* Achievement Badge */}
                {isGoalMet && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-2xl animate-fadeIn">
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <h4 className="text-xl font-bold text-green-700">Daily Goal Achieved! 🎉</h4>
                        <p className="text-green-600">Keep up the great work!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-cyan-600" />
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                  <span className="text-gray-600">Total Today</span>
                  <span className="font-bold text-cyan-600">{glasses * 250}ml</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Remaining</span>
                  <span className="font-bold text-blue-600">{Math.max(0, (goal - glasses) * 250)}ml</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-indigo-600">{Math.round(percentage)}%</span>
                </div>
              </div>
            </div>

            {/* Weekly History */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-cyan-600" />
                  Last 7 Days
                </h3>
                <div className="space-y-2">
                  {history.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold mr-2">{day.glasses}/{day.goal}</span>
                        {day.goalMet ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hydration Tips */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-full flex items-center justify-between text-lg font-semibold text-gray-800 mb-4"
              >
                <div className="flex items-center">
                  <Info className="w-5 h-5 mr-2 text-cyan-600" />
                  Hydration Tips
                </div>
                <span className="text-2xl">{showTips ? '−' : '+'}</span>
              </button>
              {showTips && (
                <div className="space-y-3 animate-fadeIn">
                  {hydrationTips.map((tip, index) => (
                    <div key={index} className="flex items-start p-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">
                      <div className="text-cyan-600 mr-3 mt-0.5">{tip.icon}</div>
                      <p className="text-sm text-gray-700">{tip.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Health Benefits */}
            <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">💧 Benefits of Staying Hydrated</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span>Improves brain function and mood</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span>Boosts physical performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span>Aids digestion and prevents constipation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span>Helps maintain healthy skin</span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-600 mr-2">✓</span>
                  <span>Regulates body temperature</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WaterIntakeTracker;
