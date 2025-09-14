import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'react-qr-code';
import { QrCode, Download, Eye, EyeOff, Copy, Check, FileText } from 'lucide-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PatientQRCode = ({ patientData }) => {
  const [showQR, setShowQR] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrType, setQrType] = useState('simple'); // 'simple', 'compact', 'complete', or 'url'
  const [qrError, setQrError] = useState(null);
  const [completeData, setCompleteData] = useState(null);
  const [loadingCompleteData, setLoadingCompleteData] = useState(false);

  // Format complete patient data for QR code (enhanced markdown format)
  const formatCompletePatientData = (data) => {
    if (!data) return '';
    
    try {
      // Create enhanced markdown format for QR code
      const markdownData = `# 🏥 **AgPatil Healthcare - Complete Medical Record**

---

## 👤 **Patient Information**
| Field | Value |
|-------|-------|
| **Patient ID** | ${data._id || 'N/A'} |
| **Full Name** | ${data.name || 'N/A'} |
| **Email Address** | ${data.contact || 'N/A'} |
| **Role** | ${data.role || 'Patient'} |
| **Speciality** | ${data.speciality || 'General Medicine'} |
| **Account Created** | ${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'} |
| **Last Updated** | ${new Date().toLocaleDateString()} |

---

## 📋 **Complete Medical History**
${Array.isArray(data.medicalHistory) && data.medicalHistory.length > 0 
  ? data.medicalHistory.map((item, index) => 
      `### ${index + 1}. ${item.condition || item.diagnosis || 'Medical Record'}
- **Date:** ${item.date || 'No date'}
- **Status:** ${item.status || 'Active'}
- **Severity:** ${item.severity || 'Not specified'}
- **Treatment:** ${item.treatment || 'Ongoing'}
- **Notes:** ${item.notes || 'No additional notes'}
- **Doctor:** ${item.doctor || 'Not specified'}`).join('\n\n')
  : '> *No medical history recorded*'}

---

## 📅 **All Appointments**
${Array.isArray(data.appointments) && data.appointments.length > 0 
  ? data.appointments.map((apt, index) => 
      `### ${index + 1}. Appointment with Dr. ${apt.doctor?.name || 'Unknown'}
- **Date:** ${apt.date || 'No date'}
- **Time:** ${apt.time || 'Scheduled'}
- **Status:** ${apt.status || 'Scheduled'}
- **Speciality:** ${apt.doctor?.speciality || 'General Medicine'}
- **Symptoms:** ${apt.symptoms || 'Not specified'}
- **Notes:** ${apt.notes || 'No additional notes'}`).join('\n\n')
  : '> *No appointments recorded*'}

---

## 💊 **All Prescriptions**
${Array.isArray(data.prescriptions) && data.prescriptions.length > 0 
  ? data.prescriptions.map((pres, index) => 
      `### ${index + 1}. ${pres.medication || 'Medication'}
- **Dosage:** ${pres.dosage || 'As prescribed'}
- **Frequency:** ${pres.frequency || 'Daily'}
- **Duration:** ${pres.duration || 'As needed'}
- **Instructions:** ${pres.instructions || 'Follow doctor\'s advice'}
- **Prescribed by:** Dr. ${pres.doctor?.name || 'Unknown'}
- **Date:** ${pres.date || 'No date'}
- **Status:** ${pres.status || 'Active'}`).join('\n\n')
  : '> *No prescriptions recorded*'}

---

## 📊 **Medical Statistics**
- **Total Medical Records:** ${Array.isArray(data.medicalHistory) ? data.medicalHistory.length : 0}
- **Total Appointments:** ${Array.isArray(data.appointments) ? data.appointments.length : 0}
- **Active Prescriptions:** ${Array.isArray(data.prescriptions) ? data.prescriptions.length : 0}
- **Account Age:** ${data.createdAt ? Math.floor((new Date() - new Date(data.createdAt)) / (1000 * 60 * 60 * 24)) : 0} days

---

## 🔒 **Security & Privacy**
- **Healthcare System:** AgPatil Healthcare
- **Data Generated:** ${new Date().toLocaleString()}
- **QR Code ID:** ${data._id || 'unknown'}
- **Version:** 2.0
- **Encryption:** Standard

---

> **⚠️ Important:** This QR code contains sensitive medical information. Please ensure it is only shared with authorized healthcare providers and kept secure at all times.`;

      return markdownData;
    } catch (error) {
      console.error('Error formatting complete patient data:', error);
      return 'Error formatting data';
    }
  };


  // Create a URL-based QR code as fallback
  const createPatientURL = (data) => {
    if (!data) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/patient/${data._id}`;
  };

  // Create a simple text format for QR code (most compatible)
  const formatSimpleQRData = (data) => {
    if (!data) return '';
    
    return `# 🏥 AgPatil Healthcare - Quick Patient Info

## 👤 **Patient Details**
- **ID:** ${data._id}
- **Name:** ${data.name}
- **Email:** ${data.contact}
- **Role:** ${data.role}
- **System:** AgPatil Healthcare
- **Generated:** ${new Date().toLocaleDateString()}

---
> *This is a basic patient information QR code. For complete medical records, scan the Medical Summary QR code.*`;
  };

  // Create a compact medical summary for QR code with enhanced markdown
  const formatCompactMedicalData = (data) => {
    if (!data) return '';
    
    try {
      const compactData = `# 🏥 AgPatil Healthcare - Medical Summary

---

## 👤 **Patient Information**
| Field | Value |
|-------|-------|
| **Name** | ${data.name || 'N/A'} |
| **Patient ID** | ${data._id || 'N/A'} |
| **Email** | ${data.contact || 'N/A'} |
| **Role** | ${data.role || 'Patient'} |
| **Speciality** | ${data.speciality || 'General Medicine'} |

---

## 📋 **Medical History**
${Array.isArray(data.medicalHistory) && data.medicalHistory.length > 0 
  ? data.medicalHistory.slice(0, 5).map((item, index) => 
      `### ${index + 1}. ${item.condition || item.diagnosis || 'Medical Record'}
- **Date:** ${item.date || 'No date'}
- **Status:** ${item.status || 'Active'}
- **Notes:** ${item.notes || 'No additional notes'}`).join('\n\n')
  : '> *No medical history recorded*'}

---

## 📅 **Recent Appointments**
${Array.isArray(data.appointments) && data.appointments.length > 0 
  ? data.appointments.slice(0, 5).map((apt, index) => 
      `### ${index + 1}. Appointment with Dr. ${apt.doctor?.name || 'Unknown'}
- **Date:** ${apt.date || 'No date'}
- **Time:** ${apt.time || 'Scheduled'}
- **Status:** ${apt.status || 'Scheduled'}
- **Speciality:** ${apt.doctor?.speciality || 'General Medicine'}`).join('\n\n')
  : '> *No appointments recorded*'}

---

## 💊 **Recent Prescriptions**
${Array.isArray(data.prescriptions) && data.prescriptions.length > 0 
  ? data.prescriptions.slice(0, 3).map((pres, index) => 
      `### ${index + 1}. ${pres.medication || 'Medication'}
- **Dosage:** ${pres.dosage || 'As prescribed'}
- **Frequency:** ${pres.frequency || 'Daily'}
- **Duration:** ${pres.duration || 'As needed'}
- **Prescribed by:** Dr. ${pres.doctor?.name || 'Unknown'}
- **Date:** ${pres.date || 'No date'}`).join('\n\n')
  : '> *No prescriptions recorded*'}

---

## 📊 **Quick Stats**
- **Total Medical Records:** ${Array.isArray(data.medicalHistory) ? data.medicalHistory.length : 0}
- **Total Appointments:** ${Array.isArray(data.appointments) ? data.appointments.length : 0}
- **Active Prescriptions:** ${Array.isArray(data.prescriptions) ? data.prescriptions.length : 0}

---

## ℹ️ **System Information**
- **Healthcare System:** AgPatil Healthcare
- **Generated:** ${new Date().toLocaleString()}
- **QR Code ID:** ${data._id || 'unknown'}
- **Version:** 1.0

---

> **Note:** This QR code contains essential medical information. Please keep it secure and only share with authorized healthcare providers.`;

      return compactData;
    } catch (error) {
      console.error('Error creating compact medical data:', error);
      return 'Error creating medical summary';
    }
  };

  // Fetch complete patient data from backend
  const fetchCompleteData = useCallback(async () => {
    if (!patientData?._id) return;
    
    setLoadingCompleteData(true);
    try {
      const response = await axios.get(`/patient/${patientData._id}/complete-data`);
      setCompleteData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch complete data:', error);
      setQrError('Failed to load complete medical data');
    } finally {
      setLoadingCompleteData(false);
    }
  }, [patientData?._id]);

  // Use complete data if available, otherwise use formatted data
  const currentCompleteData = React.useMemo(() => {
    try {
      return completeData || formatCompletePatientData(patientData);
    } catch (error) {
      console.error('Error creating complete data:', error);
      return 'Error creating complete data';
    }
  }, [completeData, patientData]);
  
  const qrUrl = React.useMemo(() => {
    try {
      return createPatientURL(patientData);
    } catch (error) {
      console.error('Error creating URL:', error);
      return 'Error creating URL';
    }
  }, [patientData]);
  
  const simpleData = React.useMemo(() => {
    try {
      return formatSimpleQRData(patientData);
    } catch (error) {
      console.error('Error creating simple data:', error);
      return 'Error creating simple data';
    }
  }, [patientData]);

  const compactMedicalData = React.useMemo(() => {
    try {
      return formatCompactMedicalData(patientData);
    } catch (error) {
      console.error('Error creating compact medical data:', error);
      return 'Error creating compact medical data';
    }
  }, [patientData]);
  
  const getCurrentQRValue = () => {
    try {
      switch (qrType) {
        case 'simple':
          return simpleData || 'No data available';
        case 'compact':
          return compactMedicalData || 'No compact data available';
        case 'complete':
          return currentCompleteData || 'No complete data available';
        case 'url':
          return qrUrl || 'No URL available';
        default:
          return simpleData || 'No data available';
      }
    } catch (error) {
      console.error('Error getting QR value:', error);
      return 'Error generating QR data';
    }
  };
  
  const currentQRValue = getCurrentQRValue();
  
  // Debug logging
  useEffect(() => {
    console.log('QR Code Debug:', {
      qrType,
      currentQRValue: currentQRValue?.substring(0, 100) + '...',
      hasCompleteData: !!completeData,
      patientData: patientData?.name
    });
  }, [qrType, currentQRValue, completeData, patientData]);

  // Handle QR type changes safely
  useEffect(() => {
    if (qrType === 'complete' && !completeData && patientData?._id) {
      // Auto-fetch complete data when switching to complete type
      fetchCompleteData();
    }
  }, [qrType, completeData, patientData?._id, fetchCompleteData]);

  const handleDownloadQR = () => {
    const svg = document.getElementById('patient-qr-code');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `patient-${patientData?.name?.replace(/\s+/g, '-') || 'unknown'}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopyData = async () => {
    try {
      const dataToCopy = currentQRValue;
      await navigator.clipboard.writeText(dataToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy data:', err);
    }
  };

  if (!patientData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-gray-500">
          <QrCode className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No patient data available for QR code generation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <QrCode className="w-6 h-6 mr-2 text-blue-600" />
          Patient QR Code
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowQR(!showQR)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showQR ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showQR ? 'Hide' : 'Show'} QR</span>
          </button>
        </div>
      </div>

      {showQR && (
        <div className="space-y-6">
          {/* QR Type Selection */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex flex-wrap gap-1">
              <button
                onClick={() => setQrType('simple')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  qrType === 'simple' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Simple Data
              </button>
              <button
                onClick={() => setQrType('compact')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  qrType === 'compact' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Medical Summary
              </button>
              <button
                onClick={() => {
                  try {
                    setQrType('complete');
                    setQrError(null);
                  } catch (error) {
                    console.error('Error switching to complete data:', error);
                    setQrError('Error switching to complete data. Try compact data instead.');
                    setQrType('compact');
                  }
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  qrType === 'complete' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Complete Data
              </button>
              <button
                onClick={() => setQrType('url')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  qrType === 'url' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Profile URL
              </button>
            </div>
            
            {qrType === 'complete' && !completeData && !loadingCompleteData && (
              <button
                onClick={fetchCompleteData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Load Complete Medical Data
              </button>
            )}
            
            {qrType === 'complete' && loadingCompleteData && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading complete medical data...</span>
              </div>
            )}
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center space-y-4">
            {qrError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center max-w-md">
                <p className="text-red-600 text-sm mb-2 font-semibold">QR Code Error:</p>
                <p className="text-red-500 text-xs mb-3">{qrError}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setQrType('simple');
                      setQrError(null);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    Use Simple Data
                  </button>
                  <button
                    onClick={() => {
                      setQrType('url');
                      setQrError(null);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    Use URL Instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                {currentQRValue && currentQRValue !== 'Error generating QR data' ? (
                  <QRCode
                    id="patient-qr-code"
                    value={currentQRValue}
                    size={220}
                    level="M"
                    includemargin={true}
                    onError={(error) => {
                      console.error('QR Code Error:', error);
                      setQrError('Data too large for QR code. Try a different option.');
                    }}
                  />
                ) : (
                  <div className="text-center p-8">
                    <p className="text-red-600 text-sm">Error generating QR code data</p>
                    <button
                      onClick={() => setQrType('simple')}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Use Simple Data
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center max-w-md">
              <p className="text-sm text-gray-600 mb-2 font-medium">
                {qrType === 'simple' 
                  ? 'Scan this QR code to view basic patient information'
                  : qrType === 'compact'
                  ? 'Scan this QR code to view medical summary with markdown formatting'
                  : qrType === 'complete'
                  ? 'Scan this QR code to view complete medical data'
                  : 'Scan this QR code to access patient profile'
                }
              </p>
              <p className="text-xs text-gray-500">
                Patient: {patientData?.name || 'Unknown'} • Type: {
                  qrType === 'simple' ? 'Simple Data' : 
                  qrType === 'compact' ? 'Medical Summary' :
                  qrType === 'complete' ? 'Complete Medical Data' : 
                  'Profile URL'
                }
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownloadQR}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download QR</span>
            </button>
            
            <button
              onClick={handleCopyData}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Data'}</span>
            </button>
            
            <button
              onClick={() => setShowData(!showData)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{showData ? 'Hide' : 'Show'} Data</span>
            </button>
            
            <button
              onClick={() => setShowMarkdown(!showMarkdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{showMarkdown ? 'Hide' : 'Show'} Markdown</span>
            </button>
            
            <button
              onClick={() => {
                console.log('QR Code Value:', currentQRValue);
                alert(`QR Code Value:\n${currentQRValue}`);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Test QR</span>
            </button>
          </div>

          {/* Patient Data Preview */}
          {showData && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {qrType === 'simple' ? 'Simple Data' : 
                 qrType === 'compact' ? 'Medical Summary' :
                 qrType === 'complete' ? 'Complete Medical Data' : 
                 'Profile URL'} Preview
              </h4>
              <div className="bg-white rounded border p-4 max-h-60 overflow-y-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {currentQRValue}
                </pre>
              </div>
            </div>
          )}

          {/* Markdown Preview */}
          {showMarkdown && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {qrType === 'simple' ? 'Simple Data' : 
                 qrType === 'compact' ? 'Medical Summary' :
                 qrType === 'complete' ? 'Complete Medical Data' : 
                 'Profile URL'} Markdown Preview
              </h4>
              <div className="bg-white rounded border p-4 max-h-80 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ children }) => (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-gray-50">{children}</thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="bg-white divide-y divide-gray-200">
                          {children}
                        </tbody>
                      ),
                      tr: ({ children }) => (
                        <tr>{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {children}
                        </td>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
                          {children}
                        </blockquote>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-medium text-gray-700 mb-2">{children}</h3>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside space-y-1 mb-4">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm text-gray-700">{children}</li>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm text-gray-700 mb-2">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-600">{children}</em>
                      ),
                      hr: () => (
                        <hr className="my-4 border-gray-300" />
                      )
                    }}
                  >
                    {currentQRValue}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* QR Code Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">QR Code Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {qrType === 'simple' ? (
                <>
                  <li>• Contains basic patient information (ID, name, email, role)</li>
                  <li>• Lightweight and fast to scan</li>
                  <li>• Safe for sharing with healthcare providers</li>
                  <li>• Can be scanned by any QR code reader</li>
                  <li>• Most compatible with all devices</li>
                </>
              ) : qrType === 'compact' ? (
                <>
                  <li>• Contains medical summary with markdown formatting</li>
                  <li>• Includes recent medical history, appointments, and prescriptions</li>
                  <li>• Optimized for QR code size limits</li>
                  <li>• Can be scanned by any QR code reader</li>
                  <li>• Perfect balance of data and compatibility</li>
                  <li>• Downloadable when scanned</li>
                </>
              ) : qrType === 'complete' ? (
                <>
                  <li>• Contains complete medical data (history, appointments, prescriptions)</li>
                  <li>• Includes all patient information and medical records</li>
                  <li>• Safe for sharing with healthcare providers</li>
                  <li>• Can be scanned by any QR code reader</li>
                  <li>• Complete medical data embedded in QR code</li>
                  <li>• Includes medical history, appointments, and prescriptions</li>
                </>
              ) : (
                <>
                  <li>• Contains link to patient profile page</li>
                  <li>• Requires internet connection to view full data</li>
                  <li>• Safe for sharing with healthcare providers</li>
                  <li>• Can be scanned by any QR code reader</li>
                  <li>• Always up-to-date with latest information</li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {!showQR && (
        <div className="text-center py-8">
          <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 mb-2">Generate QR code for patient data</p>
          <p className="text-sm text-gray-500">
            Click &quot;Show QR&quot; to generate a QR code containing all patient information
          </p>
        </div>
      )}
    </div>
  );
};

PatientQRCode.propTypes = {
  patientData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    contact: PropTypes.string,
    role: PropTypes.string,
    speciality: PropTypes.string,
    createdAt: PropTypes.string,
    medicalHistory: PropTypes.array,
    appointments: PropTypes.array,
    prescriptions: PropTypes.array,
    avatar: PropTypes.object,
    isActive: PropTypes.bool
  })
};

export default PatientQRCode;
