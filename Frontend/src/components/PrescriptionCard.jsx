import React, { useState } from 'react';
import { Calendar, User, FileText, Download, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from '../axios';
import { toast } from 'react-toastify';

const PrescriptionCard = ({ prescription, userRole }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get(`/prescription/${prescription._id}/pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${prescription.prescriptionNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Prescription downloaded successfully!');
    } catch (error) {
      console.error('Error downloading prescription:', error);
      toast.error('Failed to download prescription');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Prescription #{prescription.prescriptionNumber}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(prescription.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>
                    {userRole === 'doctor' 
                      ? `Patient: ${prescription.patient?.name || 'Unknown'}`
                      : `Dr. ${prescription.doctor?.name || 'Unknown'}`
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-blue-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-blue-600" />
              )}
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isDownloading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Doctor & Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Doctor Information</h4>
              <p className="text-gray-700"><strong>Name:</strong> Dr. {prescription.doctor?.name || 'Unknown'}</p>
              <p className="text-gray-700"><strong>Speciality:</strong> {prescription.doctor?.speciality || 'General Medicine'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Patient Information</h4>
              <p className="text-gray-700"><strong>Name:</strong> {prescription.patient?.name || 'Unknown'}</p>
              <p className="text-gray-700"><strong>Contact:</strong> {prescription.patient?.contact || 'Not provided'}</p>
            </div>
          </div>

          {/* Diagnosis */}
          {prescription.diagnosis && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Diagnosis</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {prescription.diagnosis}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Symptoms */}
          {prescription.symptoms && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {prescription.symptoms}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Medications */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Medications</h4>
            <div className="space-y-4">
              {prescription.medications.map((medication, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium text-blue-900 text-lg">
                      {index + 1}. {medication.name}
                    </h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Dosage:</span>
                      <span className="ml-2 text-gray-600">{medication.dosage}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Frequency:</span>
                      <span className="ml-2 text-gray-600">{medication.frequency}</span>
                    </div>
                    {medication.duration && (
                      <div>
                        <span className="font-medium text-gray-700">Duration:</span>
                        <span className="ml-2 text-gray-600">{medication.duration}</span>
                      </div>
                    )}
                    {medication.instructions && (
                      <div className="md:col-span-2">
                        <span className="font-medium text-gray-700">Instructions:</span>
                        <div className="mt-1 text-gray-600">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {medication.instructions}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          {prescription.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Additional Notes</h4>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {prescription.notes}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/*  */}
          {prescription.followUpInstructions && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Follow-up Instructions</h4>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {prescription.followUpInstructions}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              This prescription is digitally signed and valid for 30 days from the date of issue.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              For any queries, please contact the prescribing doctor.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionCard;
