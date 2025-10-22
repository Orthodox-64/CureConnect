import React, { useState } from 'react';
import { Scale, Activity, TrendingUp, Heart, AlertCircle, CheckCircle2, Info } from 'lucide-react';

const BMICalculator = () => {
  const [system, setSystem] = useState('metric'); // metric or imperial
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) {
      return {
        category: 'Underweight',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
        description: 'You may need to gain weight. Consult a healthcare provider for a proper diet plan.',
        tips: [
          'Eat nutrient-dense foods',
          'Include healthy fats and proteins',
          'Consider strength training',
          'Consult a nutritionist'
        ]
      };
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      return {
        category: 'Normal Weight',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
        description: 'Great! You have a healthy weight. Maintain your current lifestyle.',
        tips: [
          'Continue balanced diet',
          'Stay physically active',
          'Maintain regular exercise',
          'Keep hydrated'
        ]
      };
    } else if (bmiValue >= 25 && bmiValue < 30) {
      return {
        category: 'Overweight',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-500',
        icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
        description: 'You may be at risk. Consider lifestyle modifications to reach a healthy weight.',
        tips: [
          'Increase physical activity',
          'Reduce calorie intake',
          'Avoid processed foods',
          'Consult a dietitian'
        ]
      };
    } else {
      return {
        category: 'Obese',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-500',
        icon: <AlertCircle className="w-6 h-6 text-red-600" />,
        description: 'Health risks may be significant. Please consult a healthcare professional.',
        tips: [
          'Seek medical advice',
          'Create a weight loss plan',
          'Regular health check-ups',
          'Consider professional support'
        ]
      };
    }
  };

  const calculateBMI = () => {
    let heightInMeters, weightInKg;

    if (system === 'metric') {
      heightInMeters = parseFloat(height) / 100; // cm to meters
      weightInKg = parseFloat(weight);
    } else {
      // Imperial: height in inches, weight in pounds
      heightInMeters = (parseFloat(height) * 2.54) / 100;
      weightInKg = parseFloat(weight) * 0.453592;
    }

    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);
      setCategory(getBMICategory(parseFloat(bmiValue)));
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setCategory(null);
    setShowResult(false);
  };

  const getBMIPosition = () => {
    if (!bmi) return 0;
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return (bmiValue / 18.5) * 25;
    if (bmiValue < 25) return 25 + ((bmiValue - 18.5) / 6.5) * 25;
    if (bmiValue < 30) return 50 + ((bmiValue - 25) / 5) * 25;
    return Math.min(75 + ((bmiValue - 30) / 10) * 25, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
              <Scale className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            BMI Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate your Body Mass Index and get personalized health recommendations
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Unit Toggle */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setSystem('metric')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  system === 'metric'
                    ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                    : 'bg-indigo-700 text-white hover:bg-indigo-800'
                }`}
              >
                Metric (kg, cm)
              </button>
              <button
                onClick={() => setSystem('imperial')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  system === 'imperial'
                    ? 'bg-white text-indigo-600 shadow-lg transform scale-105'
                    : 'bg-indigo-700 text-white hover:bg-indigo-800'
                }`}
              >
                Imperial (lbs, in)
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Input Fields */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Height Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height {system === 'metric' ? '(cm)' : '(inches)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={system === 'metric' ? '170' : '67'}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none text-lg transition-all duration-300"
                  />
                  <Activity className="absolute right-4 top-4 text-gray-400 w-6 h-6" />
                </div>
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight {system === 'metric' ? '(kg)' : '(lbs)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={system === 'metric' ? '70' : '154'}
                    className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none text-lg transition-all duration-300"
                  />
                  <Scale className="absolute right-4 top-4 text-gray-400 w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={calculateBMI}
                disabled={!height || !weight}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Calculate BMI
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Reset
              </button>
            </div>

            {/* Results */}
            {showResult && bmi && category && (
              <div className="space-y-6 animate-fadeIn">
                {/* BMI Score Display */}
                <div className={`${category.bgColor} border-2 ${category.borderColor} rounded-2xl p-8 text-center`}>
                  <div className="flex justify-center mb-4">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Your BMI</h3>
                  <div className={`text-6xl font-bold ${category.color} mb-2`}>
                    {bmi}
                  </div>
                  <div className={`text-2xl font-semibold ${category.color} mb-4`}>
                    {category.category}
                  </div>
                  <p className="text-gray-600 text-lg">
                    {category.description}
                  </p>
                </div>

                {/* BMI Range Visualization */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                    BMI Range
                  </h4>
                  <div className="relative h-8 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 h-full w-1 bg-gray-900"
                      style={{ left: `${getBMIPosition()}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                        {bmi}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-2">
                    <span>18.5</span>
                    <span>25</span>
                    <span>30</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs">
                    <div>
                      <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto mb-1"></div>
                      <span className="text-gray-600">Underweight</span>
                    </div>
                    <div>
                      <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-1"></div>
                      <span className="text-gray-600">Normal</span>
                    </div>
                    <div>
                      <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-1"></div>
                      <span className="text-gray-600">Overweight</span>
                    </div>
                    <div>
                      <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-1"></div>
                      <span className="text-gray-600">Obese</span>
                    </div>
                  </div>
                </div>

                {/* Health Recommendations */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-600" />
                    Health Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {category.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Disclaimer */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
                  <div className="flex items-start">
                    <Info className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>Disclaimer:</strong> BMI is a general indicator and may not be accurate for athletes, pregnant women, or elderly individuals. Please consult a healthcare professional for personalized advice.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Cards */}
        {!showResult && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Info className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">What is BMI?</h3>
              <p className="text-gray-600 text-sm">
                Body Mass Index is a measure of body fat based on height and weight that applies to adult men and women.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Why It Matters</h3>
              <p className="text-gray-600 text-sm">
                Maintaining a healthy BMI reduces the risk of heart disease, diabetes, and other health conditions.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Take Action</h3>
              <p className="text-gray-600 text-sm">
                Use this calculator regularly to track your progress and make informed decisions about your health.
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BMICalculator;
