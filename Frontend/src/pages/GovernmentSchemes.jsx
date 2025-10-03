import React, { useState } from 'react';
import { Search, FileText, Heart, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const GovernmentHealthSchemes = () => {
  const [selectedRationCard, setSelectedRationCard] = useState('');
  const [selectedDisease, setSelectedDisease] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Ration card types
  const rationCardTypes = [
    { id: 'apl', name: 'APL (Above Poverty Line)', color: 'bg-blue-100' },
    { id: 'bpl', name: 'BPL (Below Poverty Line)', color: 'bg-green-100' },
    { id: 'aay', name: 'AAY (Antyodaya Anna Yojana)', color: 'bg-yellow-100' },
    { id: 'nfsa', name: 'NFSA (Priority Household)', color: 'bg-purple-100' }
  ];

  // Disease categories
  const diseases = [
    'Cardiovascular Diseases',
    'Cancer',
    'Diabetes',
    'Respiratory Diseases',
    'Kidney Diseases',
    'Neurological Disorders',
    'Maternal & Child Health',
    'Tuberculosis',
    'HIV/AIDS',
    'Mental Health',
    'General Health'
  ];

  // Mock government schemes database (In real app, this would come from API/scraping)
  const governmentSchemes = [
    {
      id: 1,
      name: 'Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
      shortName: 'Ayushman Bharat',
      eligibility: ['bpl', 'aay', 'nfsa'],
      diseases: ['Cardiovascular Diseases', 'Cancer', 'Diabetes', 'Kidney Diseases', 'General Health'],
      coverage: '₹5 Lakh per family per year',
      benefits: [
        'Cashless treatment at empaneled hospitals',
        'Covers pre and post-hospitalization expenses',
        'No cap on family size or age',
        'Covers over 1,500 medical procedures'
      ],
      website: 'https://pmjay.gov.in',
      helpline: '14555'
    },
    {
      id: 2,
      name: 'Rashtriya Arogya Nidhi (RAN)',
      shortName: 'RAN',
      eligibility: ['bpl', 'aay'],
      diseases: ['Cancer', 'Cardiovascular Diseases', 'Kidney Diseases', 'Neurological Disorders'],
      coverage: '₹2 Lakh for life-threatening diseases',
      benefits: [
        'Financial assistance for BPL patients',
        'Covers critical illnesses',
        'Quick approval process',
        'Available at government hospitals'
      ],
      website: 'https://mohfw.gov.in',
      helpline: '1800-180-1104'
    },
    {
      id: 3,
      name: 'National Programme for Prevention and Control of Cancer, Diabetes, CVD & Stroke (NPCDCS)',
      shortName: 'NPCDCS',
      eligibility: ['apl', 'bpl', 'aay', 'nfsa'],
      diseases: ['Cancer', 'Diabetes', 'Cardiovascular Diseases'],
      coverage: 'Free screening and early detection',
      benefits: [
        'Free health check-ups',
        'Early detection and prevention',
        'Treatment at subsidized rates',
        'Awareness programs'
      ],
      website: 'https://main.mohfw.gov.in',
      helpline: '1800-180-1104'
    },
    {
      id: 4,
      name: 'Janani Suraksha Yojana (JSY)',
      shortName: 'JSY',
      eligibility: ['bpl', 'aay', 'nfsa'],
      diseases: ['Maternal & Child Health'],
      coverage: '₹1,400 for rural and ₹1,000 for urban deliveries',
      benefits: [
        'Cash assistance for institutional delivery',
        'Free delivery care',
        'Postnatal care support',
        'Reduced maternal mortality'
      ],
      website: 'https://nhm.gov.in',
      helpline: '104'
    },
    {
      id: 5,
      name: 'Revised National Tuberculosis Control Programme (RNTCP)',
      shortName: 'RNTCP',
      eligibility: ['apl', 'bpl', 'aay', 'nfsa'],
      diseases: ['Tuberculosis', 'Respiratory Diseases'],
      coverage: 'Free diagnosis and treatment',
      benefits: [
        'Free TB medicines',
        'DOTS (Directly Observed Treatment)',
        'Nutritional support (₹500/month)',
        'Free diagnostic tests'
      ],
      website: 'https://tbcindia.gov.in',
      helpline: '1800-11-6666'
    },
    {
      id: 6,
      name: 'National AIDS Control Programme (NACP)',
      shortName: 'NACP',
      eligibility: ['apl', 'bpl', 'aay', 'nfsa'],
      diseases: ['HIV/AIDS'],
      coverage: 'Free treatment and care',
      benefits: [
        'Free antiretroviral therapy (ART)',
        'Free testing and counseling',
        'Prevention programs',
        'Confidential treatment'
      ],
      website: 'http://naco.gov.in',
      helpline: '1097'
    },
    {
      id: 7,
      name: 'National Mental Health Programme (NMHP)',
      shortName: 'NMHP',
      eligibility: ['apl', 'bpl', 'aay', 'nfsa'],
      diseases: ['Mental Health', 'Neurological Disorders'],
      coverage: 'Subsidized mental health care',
      benefits: [
        'Mental health services at district level',
        'Counseling and therapy',
        'Medicine support',
        'Community awareness programs'
      ],
      website: 'https://mohfw.gov.in',
      helpline: 'KIRAN: 1800-599-0019'
    },
    {
      id: 8,
      name: 'Pradhan Mantri National Dialysis Programme',
      shortName: 'PM-NDP',
      eligibility: ['bpl', 'aay', 'nfsa'],
      diseases: ['Kidney Diseases'],
      coverage: 'Free dialysis services',
      benefits: [
        'Free dialysis at government centers',
        'No cost for BPL patients',
        'Quality assured treatment',
        'Available at district hospitals'
      ],
      website: 'https://mohfw.gov.in',
      helpline: '1800-180-1104'
    }
  ];

  // Filter schemes based on ration card and disease
  const filteredSchemes = governmentSchemes.filter(scheme => {
    const matchesRationCard = !selectedRationCard || scheme.eligibility.includes(selectedRationCard);
    const matchesDisease = !selectedDisease || scheme.diseases.includes(selectedDisease);
    const matchesSearch = !searchQuery || 
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesRationCard && matchesDisease && matchesSearch;
  });

  const handleScrapeSchemes = () => {
    setLoading(true);
    // Simulate API call or web scraping
    setTimeout(() => {
      setLoading(false);
      alert('Schemes database updated with latest information!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-6 border-t-4 border-blue-600">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
              Government Health Schemes Finder
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Select your ration card type and disease to find eligible government health schemes
          </p>
        </div>

        {/* Filters Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Ration Card Selection */}
          <div className="bg-white rounded-xl shadow-xl p-6 border-l-4 border-blue-600">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
              <FileText className="w-6 h-6 text-blue-600" />
              Select Your Ration Card Type
            </h2>
            <div className="space-y-3">
              {rationCardTypes.map(card => (
                <button
                  key={card.id}
                  onClick={() => setSelectedRationCard(card.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    selectedRationCard === card.id
                      ? 'border-blue-600 bg-blue-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{card.name}</span>
                    {selectedRationCard === card.id && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {selectedRationCard && (
              <button
                onClick={() => setSelectedRationCard('')}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Clear Selection
              </button>
            )}
          </div>

          {/* Disease Selection */}
          <div className="bg-white rounded-xl shadow-xl p-6 border-l-4 border-blue-600">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-900">
              <Activity className="w-6 h-6 text-blue-600" />
              Select Disease Category
            </h2>
            <select
              value={selectedDisease}
              onChange={(e) => setSelectedDisease(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none mb-4 font-medium text-gray-700"
            >
              <option value="">All Diseases</option>
              {diseases.map(disease => (
                <option key={disease} value={disease}>{disease}</option>
              ))}
            </select>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search schemes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none"
              />
            </div>

            {/* Scrape Button */}
            <button
              onClick={handleScrapeSchemes}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg disabled:from-gray-400 disabled:to-gray-500 font-semibold"
            >
              {loading ? 'Updating Schemes...' : 'Refresh Latest Schemes'}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-blue-600">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-900">
              Available Schemes ({filteredSchemes.length})
            </h2>
            {(selectedRationCard || selectedDisease) && (
              <button
                onClick={() => {
                  setSelectedRationCard('');
                  setSelectedDisease('');
                  setSearchQuery('');
                }}
                className="text-sm text-blue-700 hover:text-blue-900 font-semibold hover:underline"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* Active Filters */}
          {(selectedRationCard || selectedDisease) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedRationCard && (
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-300">
                  {rationCardTypes.find(c => c.id === selectedRationCard)?.name}
                </span>
              )}
              {selectedDisease && (
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-300">
                  {selectedDisease}
                </span>
              )}
            </div>
          )}

          {/* Schemes List */}
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-blue-200 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">No schemes found matching your criteria</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredSchemes.map(scheme => (
                <div
                  key={scheme.id}
                  className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-600 hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-white to-blue-50"
                  onClick={() => setSelectedScheme(selectedScheme?.id === scheme.id ? null : scheme)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-blue-900 flex-1">{scheme.shortName}</h3>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-bold shadow-md">
                      Eligible
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3 font-medium">{scheme.name}</p>
                  
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl mb-3 shadow-lg">
                    <p className="text-sm font-bold text-white">Coverage:</p>
                    <p className="text-sm text-white font-semibold">{scheme.coverage}</p>
                  </div>

                  {selectedScheme?.id === scheme.id && (
                    <div className="mt-4 pt-4 border-t-2 border-blue-200">
                      <h4 className="font-bold mb-3 text-blue-900">Benefits:</h4>
                      <ul className="space-y-2 mb-4">
                        {scheme.benefits.map((benefit, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="bg-blue-50 p-4 rounded-xl space-y-2 border border-blue-200">
                        <p className="text-sm">
                          <span className="font-bold text-blue-900">Website:</span>{' '}
                          <a href={scheme.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-700 hover:underline font-medium">
                            {scheme.website}
                          </a>
                        </p>
                        <p className="text-sm">
                          <span className="font-bold text-blue-900">Helpline:</span>{' '}
                          <span className="text-blue-700 font-bold">{scheme.helpline}</span>
                        </p>
                      </div>

                      <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all font-bold shadow-lg">
                        Apply for This Scheme
                      </button>
                    </div>
                  )}

                  {selectedScheme?.id !== scheme.id && (
                    <p className="text-xs text-blue-700 mt-2 font-semibold">Click to view details →</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovernmentHealthSchemes;