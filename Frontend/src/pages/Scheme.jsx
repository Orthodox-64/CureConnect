import React, { useState } from 'react';
import { ExternalLink, ChevronDown, Heart, Shield, Pill, Stethoscope, Users, Baby, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const healthcareSchemes = [
  {
    id: 1,
    name: "Ayushman Bharat - PMJAY",
    description: "Health insurance up to ₹5 lakh per family annually for secondary and tertiary care",
    url: "https://pmjay.gov.in/",
    icon: <Shield className="h-5 w-5" />,
    beneficiaries: "Economically vulnerable citizens"
  },
  {
    id: 2,
    name: "PM Jan Arogya Yojana",
    description: "Cashless and paperless access to healthcare services",
    url: "https://nha.gov.in/PM-JAY",
    icon: <Heart className="h-5 w-5" />,
    beneficiaries: "Bottom 40% of Indian population"
  },
  {
    id: 3,
    name: "National Health Mission",
    description: "Comprehensive healthcare including prevention and primary care",
    url: "https://nhm.gov.in/",
    icon: <Stethoscope className="h-5 w-5" />,
    beneficiaries: "All citizens with focus on rural areas"
  },
  {
    id: 4,
    name: "Rashtriya Swasthya Bima Yojana",
    description: "Health insurance coverage for BPL families",
    url: "https://www.india.gov.in/spotlight/rashtriya-swasthya-bima-yojana",
    icon: <Users className="h-5 w-5" />,
    beneficiaries: "Below Poverty Line families"
  },
  {
    id: 5,
    name: "Janani Suraksha Yojana",
    description: "Safe motherhood intervention promoting institutional delivery",
    url: "https://nhm.gov.in/index1.php?lang=1&level=3&sublinkid=841&lid=309",
    icon: <Baby className="h-5 w-5" />,
    beneficiaries: "Pregnant women, especially in rural areas"
  },
  {
    id: 6,
    name: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana",
    description: "Quality generic medicines at affordable prices",
    url: "https://janaushadhi.gov.in/",
    icon: <Pill className="h-5 w-5" />,
    beneficiaries: "All citizens"
  }
];

const GovernmentSchemesPage = () => {
  const [formData, setFormData] = useState({
    income: '',
    rationCardColor: '',
    hasDocuments: ''
  });
  
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRedirect = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.income) {
      newErrors.income = ' Please enter your annual income';
    } else if (isNaN(formData.income) || formData.income <= 0) {
      newErrors.income = 'Please enter a valid income amount';
    }
    
    if (!formData.rationCardColor) {
      newErrors.rationCardColor = 'Please select your ration card color';
    }
    
    if (!formData.hasDocuments) {
      newErrors.hasDocuments = 'Please select if you have the required documents';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEligibility = () => {
    const income = Number(formData.income);
    const isEligible = 
      income < 400000 && 
      (formData.rationCardColor === 'yellow' || formData.rationCardColor === 'orange') && 
      formData.hasDocuments === 'yes';
    
    return {
      isEligible,
      reasons: {
        income: income >= 400000 ? 'Income must be below 4 lakhs' : null,
        rationCard: !(formData.rationCardColor === 'yellow' || formData.rationCardColor === 'orange') ? 
          'Must have Yellow or Orange ration card' : null,
        documents: formData.hasDocuments !== 'yes' ? 
          'Must have Aadhar card and CM letter' : null
      }
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const eligibilityResult = checkEligibility();
      setResult(eligibilityResult);
      setIsSubmitted(true);
    }
  };

  const resetForm = () => {
    setFormData({
      income: '',
      rationCardColor: '',
      hasDocuments: ''
    });
    setResult(null);
    setIsSubmitted(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16 animate-float">
        <div className="inline-block">
          <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text text-5xl font-extrabold mb-6">
            Healthcare Government Programs
          </span>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover and access government healthcare schemes designed to support your well-being
        </p>
        
        {/* Healthcare Schemes Button */}
        <div className="mt-12 flex justify-center">
          <div className="relative inline-block text-center z-10">
            <button
              type="button"
              className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-[2px] hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:shadow-lg transition-all duration-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="flex items-center rounded-xl bg-white px-8 py-4 text-xl font-medium text-blue-600 group-hover:bg-transparent group-hover:text-white transition-colors duration-300">
                <Heart className="mr-3 h-6 w-6" aria-hidden="true" />
                Healthcare Schemes
                <ChevronDown className={`ml-3 h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </span>
            </button>

            {isOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10 mt-4 w-[28rem] origin-top rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-float">
                <div className="p-6 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white">
                  <h3 className="text-xl font-semibold">Healthcare Benefit Schemes</h3>
                  <p className="text-sm opacity-90 mt-1">Explore government healthcare programs</p>
                </div>
                
                <div className="py-2 max-h-[32rem] overflow-y-auto">
                  {healthcareSchemes.map((scheme) => (
                    <div 
                      key={scheme.id}
                      className="px-6 py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-colors duration-300 border-b border-gray-100 last:border-0"
                      onClick={() => handleRedirect(scheme.url)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 rounded-xl">
                          {scheme.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="text-lg font-medium text-gray-900">{scheme.name}</h4>
                            <ExternalLink className="ml-2 h-4 w-4 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{scheme.description}</p>
                          <span className="mt-2 inline-flex items-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 text-sm font-medium text-blue-800">
                            {scheme.beneficiaries}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area - Eligibility Checker (INCREASED SIZE) */}
      <div className="max-w-4xl mx-auto">
        <div className="gradient-border glass-effect shadow-2xl overflow-hidden scale-105 transform">
          {/* Eligibility Form Header */}
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 px-10 py-10 text-white">
            <h2 className="text-4xl font-bold">Benefits Eligibility Checker</h2>
            <p className="mt-3 opacity-90 text-lg">Find out if you qualify for government assistance programs</p>
          </div>
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-10">
              <div className="space-y-10">
                {/* Income Field */}
                <div className="relative">
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Annual Income (in ₹)
                  </label>
                  <div className="relative">
                    {/* <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-500 text-xl">₹</span> */}
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-5 py-5 rounded-xl border-2 text-lg ${
                        errors.income 
                          ? 'border-red-300 bg-red-50 focus:border-red-500' 
                          : 'border-gray-200 focus:border-blue-500'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 transition-all duration-300`}
                      placeholder=" Enter your annual income"
                    />
                  </div>
                  {errors.income && (
                    <p className="mt-2 text-base text-red-600 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      {errors.income}
                    </p>
                  )}
                  <p className="mt-2 text-base text-gray-500">
                    Income must be below 4 lakhs to be eligible
                  </p>
                </div>
                
                {/* Ration Card Color */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Ration Card Color
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {['yellow', 'orange', 'white', 'other'].map((color) => (
                      <div 
                        key={color}
                        className={`relative rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          formData.rationCardColor === color 
                            ? `${
                                color === 'yellow' 
                                  ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200' 
                                  : color === 'orange' 
                                    ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200'
                                    : color === 'white'
                                      ? 'border-gray-400 bg-gray-50 ring-2 ring-gray-200'
                                      : 'border-purple-400 bg-purple-50 ring-2 ring-purple-200'
                              }`
                            : 'border-gray-200 hover:border-blue-400'
                        }`}
                        onClick={() => setFormData({...formData, rationCardColor: color})}
                      >
                        <input
                          type="radio"
                          name="rationCardColor"
                          value={color}
                          checked={formData.rationCardColor === color}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="flex items-center p-5">
                          <span 
                            className={`w-6 h-6 rounded-full mr-3 ${
                              color === 'yellow' 
                                ? 'bg-yellow-400' 
                                : color === 'orange' 
                                  ? 'bg-orange-500' 
                                  : color === 'white' 
                                    ? 'bg-gray-100 border-2 border-gray-300' 
                                    : 'bg-purple-400'
                            }`}
                          />
                          <label className="block text-lg cursor-pointer capitalize">
                            {color}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.rationCardColor && (
                    <p className="mt-2 text-base text-red-600 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      {errors.rationCardColor}
                    </p>
                  )}
                  <p className="mt-2 text-base text-gray-500">
                    Only Yellow or Orange ration card holders are eligible
                  </p>
                </div>
                
                {/* Has Required Documents */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-3">
                    Do you have Aadhar Card and CM Letter?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div 
                      className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 ${
                        formData.hasDocuments === 'yes' 
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                      onClick={() => setFormData({...formData, hasDocuments: 'yes'})}
                    >
                      <input
                        type="radio"
                        name="hasDocuments"
                        value="yes"
                        checked={formData.hasDocuments === 'yes'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <CheckCircle className="w-7 h-7 text-green-500 mr-4" />
                        <span className="text-lg">Yes, I have both documents</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-300 ${
                        formData.hasDocuments === 'no' 
                          ? 'border-red-500 bg-red-50 ring-2 ring-red-200' 
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                      onClick={() => setFormData({...formData, hasDocuments: 'no'})}
                    >
                      <input
                        type="radio"
                        name="hasDocuments"
                        value="no"
                        checked={formData.hasDocuments === 'no'}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <XCircle className="w-7 h-7 text-red-500 mr-4" />
                        <span className="text-lg">No, I don't have both</span>
                      </div>
                    </div>
                  </div>
                  {errors.hasDocuments && (
                    <p className="mt-2 text-base text-red-600 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      {errors.hasDocuments}
                    </p>
                  )}
                  <p className="mt-2 text-base text-gray-500">
                    Both Aadhar Card and CM Letter are required for eligibility
                  </p>
                </div>
                
                <div className="pt-5">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-medium py-5 px-8 text-xl rounded-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Check Eligibility
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-10">
              <div className={`p-10 rounded-xl mb-10 ${
                result?.isEligible 
                  ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 border border-red-100'
              }`}>
                <div className="flex items-start">
                  <div className={`rounded-xl p-4 mr-6 ${
                    result?.isEligible ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {result?.isEligible ? (
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    ) : (
                      <XCircle className="w-12 h-12 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-3xl font-bold ${
                      result?.isEligible ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result?.isEligible 
                        ? 'Congratulations! You are Eligible' 
                        : 'Sorry, You are Not Eligible'}
                    </h3>
                    <p className={`mt-3 text-xl ${
                      result?.isEligible ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result?.isEligible 
                        ? 'You meet all the criteria for the healthcare benefits program.' 
                        : 'You do not meet all required criteria for healthcare benefits.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-10 border border-gray-200">
                <h4 className="text-2xl font-semibold text-gray-800 mb-8">Eligibility Criteria Summary</h4>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    {!result.reasons.income ? (
                      <CheckCircle className="w-8 h-8 text-green-500 mr-5 mt-0.5" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500 mr-5 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-xl">Income Requirement</p>
                      <p className="text-lg text-gray-600 mt-2">
                        {!result.reasons.income 
                          ? `Your income (₹${formData.income}) is below 4 lakhs.` 
                          : `Your income (₹${formData.income}) exceeds the maximum limit of 4 lakhs.`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    {!result.reasons.rationCard ? (
                      <CheckCircle className="w-8 h-8 text-green-500 mr-5 mt-0.5" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500 mr-5 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-xl">Ration Card Requirement</p>
                      <p className="text-lg text-gray-600 mt-2">
                        {!result.reasons.rationCard 
                          ? `You have a ${formData.rationCardColor} ration card, which is eligible.` 
                          : `Your ${formData.rationCardColor} ration card is not eligible. Only Yellow or Orange cards qualify.`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    {!result.reasons.documents ? (
                      <CheckCircle className="w-8 h-8 text-green-500 mr-5 mt-0.5" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500 mr-5 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-xl">Document Requirement</p>
                      <p className="text-lg text-gray-600 mt-2">
                        {!result.reasons.documents 
                          ? "You have the required Aadhar Card and CM Letter." 
                          : "You do not have the required Aadhar Card and CM Letter."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show schemes button if eligible */}
              {result?.isEligible && (
                <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
                  <p className="text-blue-800 font-medium text-xl mb-5">
                    You qualify for healthcare benefits! View available healthcare schemes:
                  </p>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-medium py-5 px-8 text-xl rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
                  >
                    <Heart className="mr-3 h-7 w-7" />
                    Explore Healthcare Schemes
                  </button>
                </div>
              )}

              <button
                onClick={resetForm}
                className="w-full mt-10 bg-white hover:bg-gray-50 text-gray-800 font-medium py-5 px-8 text-xl rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
              >
                Check Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemesPage;