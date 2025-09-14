import React from 'react';
import HealthIcon from './HealthIcon';

const PdfReport = React.forwardRef(
  ({ analysis, imageUrl }, ref) => {
    return (
      <div 
        ref={ref}
        className="pdf-container bg-skyblue p-8 rounded-lg w-[21cm] min-h-[29.7cm] mx-auto"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-medicalblue">Medical Image Analysis Report</h1>
            <HealthIcon />
          </div>
          
          <div className="border-b border-gray-200 mb-6"></div>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Image Analysis</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <img 
                  src={imageUrl} 
                  alt="Analyzed Medical Image" 
                  className="mb-4 rounded-lg max-h-[300px] mx-auto object-contain"
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Analysis Results</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                  {analysis}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3 text-gray-700">Disclaimer</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  This analysis is provided for informational purposes only and should not be 
                  considered as medical advice. Please consult with a healthcare professional 
                  for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Report generated on {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    );
  }
);

export default PdfReport;