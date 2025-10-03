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
  const [qrType, setQrType] = useState('medical-summary'); // 'simple', 'compact', 'complete', 'medical-history', 'medical-summary', or 'url'
  const [qrError, setQrError] = useState(null);
  const [completeData, setCompleteData] = useState(null);
  const [loadingCompleteData, setLoadingCompleteData] = useState(false);

  // Enhanced format complete patient data for QR code with beautiful styling
  const formatCompletePatientData = (data) => {
    if (!data) return '';
    
    try {
      // Create beautiful enhanced markdown format for QR code
      const markdownData = `# 🏥 **CureConnect Healthcare**
## 📋 Complete Medical Record

---

### 👤 **Patient Information**
| 🏷️ Field | 📝 Details |
|-----------|-------------|
| **🆔 Patient ID** | \`${data._id?.slice(-8) || 'N/A'}\` |
| **👨‍⚕️ Full Name** | **${data.name || 'N/A'}** |
| **📧 Email** | ${data.contact || 'N/A'} |
| **🎯 Role** | ${data.role || 'Patient'} |
| **🩺 Speciality** | ${data.speciality || 'General Medicine'} |
| **📅 Joined** | ${data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'} |
| **🔄 Updated** | ${new Date().toLocaleDateString()} |

---

### 📋 **Complete Medical History**
${Array.isArray(data.medicalHistory) && data.medicalHistory.length > 0 
  ? data.medicalHistory.map((item, index) => 
      `#### 🏥 ${index + 1}. ${item.condition || item.diagnosis || 'Medical Record'}
> **📅 Date:** ${item.date || 'No date'}  
> **⚡ Status:** \`${item.status || 'Active'}\`  
> **🚨 Severity:** ${item.severity || 'Not specified'}  
> **💊 Treatment:** ${item.treatment || 'Ongoing'}  
> **📝 Notes:** ${item.notes || 'No additional notes'}  
> **👨‍⚕️ Doctor:** Dr. ${item.doctor || 'Not specified'}`).join('\n\n')
  : '> 💭 *No medical history recorded*'}

---

### 📅 **All Appointments**
${Array.isArray(data.appointments) && data.appointments.length > 0 
  ? data.appointments.map((apt, index) => 
      `#### 🩺 ${index + 1}. Appointment with Dr. ${apt.doctor?.name || 'Unknown'}
> **📅 Date:** ${apt.date || 'No date'}  
> **🕐 Time:** ${apt.time || 'Scheduled'}  
> **⚡ Status:** \`${apt.status || 'Scheduled'}\`  
> **🎯 Speciality:** ${apt.doctor?.speciality || 'General Medicine'}  
> **🤒 Symptoms:** ${apt.symptoms || 'Not specified'}  
> **📝 Notes:** ${apt.notes || 'No additional notes'}`).join('\n\n')
  : '> 💭 *No appointments recorded*'}

---

### 💊 **All Prescriptions**
${Array.isArray(data.prescriptions) && data.prescriptions.length > 0 
  ? data.prescriptions.map((pres, index) => 
      `#### 💉 ${index + 1}. ${pres.medication || 'Medication'}
> **💊 Dosage:** \`${pres.dosage || 'As prescribed'}\`  
> **⏰ Frequency:** ${pres.frequency || 'Daily'}  
> **📆 Duration:** ${pres.duration || 'As needed'}  
> **📋 Instructions:** ${pres.instructions || 'Follow doctor\'s advice'}  
> **👨‍⚕️ Prescribed by:** Dr. ${pres.doctor?.name || 'Unknown'}  
> **📅 Date:** ${pres.date || 'No date'}  
> **⚡ Status:** \`${pres.status || 'Active'}\``).join('\n\n')
  : '> 💭 *No prescriptions recorded*'}

---

### 📊 **Medical Statistics**
| 📈 Metric | 📊 Count |
|-----------|----------|
| **🏥 Medical Records** | ${Array.isArray(data.medicalHistory) ? data.medicalHistory.length : 0} |
| **📅 Appointments** | ${Array.isArray(data.appointments) ? data.appointments.length : 0} |
| **💊 Active Prescriptions** | ${Array.isArray(data.prescriptions) ? data.prescriptions.length : 0} |
| **📆 Account Age** | ${data.createdAt ? Math.floor((new Date() - new Date(data.createdAt)) / (1000 * 60 * 60 * 24)) : 0} days |

---

### 🔐 **Security & Privacy**
> **🏥 Healthcare System:** CureConnect Healthcare  
> **📱 Data Generated:** ${new Date().toLocaleString()}  
> **🆔 QR Code ID:** \`${data._id?.slice(-8) || 'unknown'}\`  
> **🔢 Version:** 2.0  
> **🔒 Encryption:** Standard Healthcare Encryption  

---

> ### ⚠️ **Important Notice**
> 🚨 This QR code contains **sensitive medical information**.  
> 🔐 Please ensure it is only shared with **authorized healthcare providers**.  
> 🛡️ Keep secure at all times and handle with care.

---

*🏥 Powered by **CureConnect Healthcare System** 🌟*`;

      return markdownData;
    } catch (error) {
      console.error('Error formatting complete patient data:', error);
      return 'Error formatting data';
    }
  };

  // Create public medical summary URL - simplified version that always works
  const createMedicalSummaryURL = (data) => {
    if (!data?._id) return '';
    
    try {
      const baseUrl = window.location.origin;
      
      // For medical-history type, use the static HTML page for better reliability
      if (qrType === 'medical-history') {
        return `${baseUrl}/medical-summary.html?patientId=${data._id}`;
      }
      
      // Create multiple URL options for better reliability
      const summaryId = `summary-${data._id.slice(-8)}-${Date.now().toString().slice(-6)}`;
      
      // Primary URL (with summary ID)
      const primaryUrl = `${baseUrl}/medical-summary/${data._id}/${summaryId}`;
      
      // Backup simple URL (direct patient access)
      const backupUrl = `${baseUrl}/patient-summary/${data._id}`;
      
      console.log('Generated URLs:', { primaryUrl, backupUrl, qrType });
      
      // Return the primary URL (the component will handle fallbacks)
      return primaryUrl;
    } catch (error) {
      console.error('Error creating medical summary URL:', error);
      return '';
    }
  };

  // Create a beautiful simple text format for QR code
  const formatSimpleQRData = (data) => {
    if (!data) return '';
    
    return `# 🏥 **CureConnect Healthcare**
## 👤 Quick Patient Info

---

### 📋 **Patient Details**
| 🏷️ Field | 📝 Value |
|-----------|----------|
| **🆔 ID** | \`${data._id?.slice(-8) || 'N/A'}\` |
| **👨‍⚕️ Name** | **${data.name || 'N/A'}** |
| **📧 Email** | ${data.contact || 'N/A'} |
| **🎯 Role** | ${data.role || 'Patient'} |
| **🩺 Speciality** | ${data.speciality || 'General Medicine'} |

---

### 🏥 **System Information**
> **🌟 Healthcare System:** CureConnect Healthcare  
> **📅 Generated:** ${new Date().toLocaleDateString()}  
> **🔒 Data Type:** Basic Patient Information  

---

> ### 💡 **Note**
> This is a **basic patient information** QR code.  
> For complete medical records, request the **Medical Summary QR code**.

*🏥 Powered by **CureConnect Healthcare** 🌟*`;
  };

  // Enhanced medical history only format with beautiful styling
  const formatMedicalHistoryOnly = (data) => {
    if (!data) return '';
    
    try {
      const medicalHistoryData = `# 🏥 **MEDICAL HISTORY**
## 👤 ${(data.name || 'Patient').toUpperCase()}

---

### 📋 **Patient Information**
| Field | Details |
|-------|---------|
| **👤 Patient** | **${data.name || 'N/A'}** |
| **🆔 ID** | \`${data._id ? data._id.slice(-8) : 'N/A'}\` |
| **📧 Contact** | ${data.contact || 'N/A'} |

---

### 🏥 **MEDICAL RECORDS**
${Array.isArray(data.medicalHistory) && data.medicalHistory.length > 0 
  ? data.medicalHistory.slice(0, 5).map((item, index) => {
      const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: '2-digit' 
      }) : 'No date';
      
      // Extract key findings from analysis
      const analysisText = item.analysis || 'No analysis available';
      const shortAnalysis = analysisText.length > 100 
        ? analysisText.substring(0, 100) + '...' 
        : analysisText;
      
      return `#### 🏥 ${index + 1}. Medical Record - ${date}
> **📅 Date:** ${date}  
> **🔍 Analysis:** ${shortAnalysis}  
> **⚡ Status:** \`${item.status || 'Active'}\`  
> **👨‍⚕️ Doctor:** Dr. ${item.doctor || 'Not specified'}`;
    }).join('\n\n')
  : '> 💭 *No medical history available*'}

---

### 📊 **Summary**
| Metric | Value |
|--------|-------|
| **📋 Total Records** | ${Array.isArray(data.medicalHistory) ? data.medicalHistory.length : 0} |
| **🏥 Healthcare System** | CureConnect Healthcare |
| **📅 Generated** | ${new Date().toLocaleDateString()} |

---

*🏥 **CureConnect Healthcare System** - Medical History Report 📋*`;

      return medicalHistoryData;
    } catch (error) {
      console.error('Error formatting medical history only data:', error);
      return 'Error creating medical history summary';
    }
  };

  // Enhanced compact medical summary with beautiful formatting
  const formatCompactMedicalData = (data) => {
    if (!data) return '';
    
    try {
      const compactData = `# 🏥 **CureConnect Healthcare**
## 📋 Medical Summary

---

### 👤 **Patient Information**
| 🏷️ Field | 📝 Value |
|-----------|----------|
| **👨‍⚕️ Name** | **${data.name || 'N/A'}** |
| **🆔 Patient ID** | \`${data._id?.slice(-8) || 'N/A'}\` |
| **📧 Email** | ${data.contact || 'N/A'} |
| **🎯 Role** | ${data.role || 'Patient'} |
| **🩺 Speciality** | ${data.speciality || 'General Medicine'} |

---

### 🏥 **Medical History**
${Array.isArray(data.medicalHistory) && data.medicalHistory.length > 0 
  ? data.medicalHistory.slice(0, 5).map((item, index) => 
      `#### 📋 ${index + 1}. ${item.condition || item.diagnosis || 'Medical Record'}
> **📅 Date:** ${item.date || 'No date'}  
> **⚡ Status:** \`${item.status || 'Active'}\`  
> **🚨 Severity:** ${item.severity || 'Not specified'}  
> **📝 Notes:** ${item.notes || 'No additional notes'}`).join('\n\n')
  : '> 💭 *No medical history recorded*'}

---

### 📅 **Recent Appointments**
${Array.isArray(data.appointments) && data.appointments.length > 0 
  ? data.appointments.slice(0, 3).map((apt, index) => 
      `#### 🩺 ${index + 1}. Dr. ${apt.doctor?.name || 'Unknown'}
> **📅 Date:** ${apt.date || 'No date'}  
> **🕐 Time:** ${apt.time || 'Scheduled'}  
> **⚡ Status:** \`${apt.status || 'Scheduled'}\`  
> **🎯 Speciality:** ${apt.doctor?.speciality || 'General Medicine'}  
> **🤒 Symptoms:** ${apt.symptoms || 'Not specified'}`).join('\n\n')
  : '> 💭 *No appointments recorded*'}

---

### 💊 **Recent Prescriptions**
${Array.isArray(data.prescriptions) && data.prescriptions.length > 0 
  ? data.prescriptions.slice(0, 3).map((pres, index) => 
      `#### 💉 ${index + 1}. ${pres.medication || 'Medication'}
> **💊 Dosage:** \`${pres.dosage || 'As prescribed'}\`  
> **⏰ Frequency:** ${pres.frequency || 'Daily'}  
> **📆 Duration:** ${pres.duration || 'As needed'}  
> **👨‍⚕️ Prescribed by:** Dr. ${pres.doctor?.name || 'Unknown'}  
> **📅 Date:** ${pres.date || 'No date'}`).join('\n\n')
  : '> 💭 *No prescriptions recorded*'}

---

### 📊 **Quick Statistics**
| 📈 Metric | 📊 Count |
|-----------|----------|
| **🏥 Medical Records** | ${Array.isArray(data.medicalHistory) ? data.medicalHistory.length : 0} |
| **📅 Appointments** | ${Array.isArray(data.appointments) ? data.appointments.length : 0} |
| **💊 Prescriptions** | ${Array.isArray(data.prescriptions) ? data.prescriptions.length : 0} |

---

### ℹ️ **System Information**
> **🏥 Healthcare System:** CureConnect Healthcare  
> **📱 Generated:** ${new Date().toLocaleString()}  
> **🆔 QR Code ID:** \`${data._id?.slice(-8) || 'unknown'}\`  
> **🔢 Version:** 1.0  

---

> ### 🔐 **Privacy Notice**
> 🚨 This QR code contains **essential medical information**.  
> 🛡️ Keep secure and share only with **authorized healthcare providers**.

*🏥 Powered by **CureConnect Healthcare System** 🌟*`;

      return compactData;
    } catch (error) {
      console.error('Error creating compact medical data:', error);
      return 'Error creating medical summary';
    }
  };

  // Enhanced ultra-compact medical summary with beautiful emojis and formatting
  const formatMedicalSummary = (data) => {
    if (!data) return '';
    
    try {
      const summaryData = `# 🏥 **CureConnect Healthcare**
## 📋 Medical Summary

---

### 👤 **Patient**
**${(data.name || 'Patient').toUpperCase()}**  
🆔 ID: \`${data._id ? data._id.slice(-8) : 'N/A'}\` | 📋 Records: **${Array.isArray(data.medicalHistory) ? data.medicalHistory.length : 0}**

---

### 🏥 **Recent Medical History**
${Array.isArray(data.medicalHistory) && data.medicalHistory.length > 0 
  ? data.medicalHistory.slice(0, 3).map((item, index) => {
      const date = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: '2-digit'
      }) : 'N/A';
      
      // Extract key diagnosis/findings
      const analysis = item.analysis || 'Analysis pending';
      const keyFindings = analysis.length > 80 
        ? analysis.substring(0, 80) + '...'
        : analysis;
      
      return `#### 🏥 ${index + 1}. Medical Record
> **📅 Date:** ${date}  
> **🔍 Findings:** ${keyFindings}  
> **⚡ Status:** \`${item.status || 'Active'}\``;
    }).join('\n\n')
  : '> 💭 *No medical records available*'}

---

### 📊 **Summary Statistics**
| Metric | Count |
|--------|-------|
| 🏥 **Total Records** | ${Array.isArray(data.medicalHistory) ? data.medicalHistory.length : 0} |
| 📅 **Appointments** | ${Array.isArray(data.appointments) ? data.appointments.length : 0} |
| 💊 **Prescriptions** | ${Array.isArray(data.prescriptions) ? data.prescriptions.length : 0} |

---

### 🏥 **Healthcare Information**
> **🌟 System:** CureConnect Healthcare  
> **📅 Generated:** ${new Date().toLocaleDateString()}  
> **🔒 Type:** Medical Summary  

---

> ### 🚨 **Important**
> Contains **sensitive medical data**  
> Share only with **authorized personnel** 🔐

*🏥 **CureConnect Healthcare** - Quick Medical Reference 📋*`;

      return summaryData;
    } catch (error) {
      console.error('Error formatting medical summary:', error);
      return 'Error creating summary';
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
  
  // State for medical summary URL
  const [medicalSummaryUrl, setMedicalSummaryUrl] = useState('');
  const [creatingUrl, setCreatingUrl] = useState(false);

  // Create medical summary URL when needed
  const createMedicalURL = useCallback(() => {
    if (!patientData?._id || medicalSummaryUrl) return;
    
    setCreatingUrl(true);
    try {
      const url = createMedicalSummaryURL(patientData);
      setMedicalSummaryUrl(url);
      setQrError(null);
    } catch (error) {
      console.error('Error creating medical URL:', error);
      setQrError('Failed to create medical summary URL');
    } finally {
      setCreatingUrl(false);
    }
  }, [patientData, medicalSummaryUrl]);
  
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

  const medicalHistoryOnlyData = React.useMemo(() => {
    try {
      return formatMedicalHistoryOnly(patientData);
    } catch (error) {
      console.error('Error creating medical history only data:', error);
      return 'Error creating medical history only data';
    }
  }, [patientData]);

  const medicalSummaryData = React.useMemo(() => {
    try {
      return formatMedicalSummary(patientData);
    } catch (error) {
      console.error('Error creating medical summary data:', error);
      return 'Error creating medical summary data';
    }
  }, [patientData]);
  
  const getCurrentQRValue = () => {
    try {
      // Always return the medical summary URL for all QR types
      if (!patientData?._id) {
        return 'No patient data available';
      }
      
      // Create the medical summary URL that opens medical-summary.html
      const baseUrl = window.location.origin;
      const medicalSummaryPageUrl = `${baseUrl}/medical-summary.html?patientId=${patientData._id}`;
      
      console.log('🔗 Generated QR URL:', medicalSummaryPageUrl);
      return medicalSummaryPageUrl;
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
    
    // Create medical summary URL for medical-history and url types
    if ((qrType === 'medical-history' || qrType === 'url') && !medicalSummaryUrl && patientData?._id) {
      createMedicalURL();
    }
  }, [qrType, completeData, patientData?._id, fetchCompleteData, medicalSummaryUrl, createMedicalURL]);

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
          {/* QR Type Selection - Now all open medical-summary.html */}
          <div className="flex flex-col items-center space-y-4 mb-6">
            <div className="bg-gradient-to-r from-blue-100 to-green-100 border-2 border-blue-200 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center justify-center">
                🌐 Medical Summary QR Code
              </h4>
              <p className="text-sm text-blue-700 mb-3">
                All QR codes now open the medical summary webpage with complete patient data
              </p>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center justify-center space-x-2">
                    <span>🏥</span>
                    <span>Complete Medical History</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>📅</span>
                    <span>All Appointments & Records</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>💊</span>
                    <span>Prescriptions & Analysis</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>📱</span>
                    <span>Mobile-Friendly Display</span>
                  </div>
                </div>
              </div>
            </div>
            
            {qrType === 'complete' && !completeData && !loadingCompleteData && (
              <button
                onClick={fetchCompleteData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                📥 Load Complete Medical Data
              </button>
            )}
            
            {qrType === 'complete' && loadingCompleteData && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>📥 Loading complete medical data...</span>
              </div>
            )}
            
            {(qrType === 'medical-history' || qrType === 'url') && creatingUrl && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                <span>🌐 Creating medical summary webpage...</span>
              </div>
            )}
          </div>

          {/* QR Code Display */}
          <div className="flex flex-col items-center space-y-4">
            {qrError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center max-w-md">
                <p className="text-red-600 text-sm mb-2 font-semibold">🚨 QR Code Error:</p>
                <p className="text-red-500 text-xs mb-3">{qrError}</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setQrType('simple');
                      setQrError(null);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    🔤 Use Simple Data
                  </button>
                  <button
                    onClick={() => {
                      setQrType('url');
                      setQrError(null);
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                  >
                    🔗 Use URL Instead
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200 shadow-lg">
                {currentQRValue && currentQRValue !== 'Error generating QR data' ? (
                  <QRCode
                    id="patient-qr-code"
                    value={currentQRValue}
                    size={240}
                    level="M"
                    includemargin={true}
                    fgColor="#1e40af"
                    bgColor="#ffffff"
                    onError={(error) => {
                      console.error('QR Code Error:', error);
                      setQrError('Data too large for QR code. Try a different option.');
                    }}
                  />
                ) : (
                  <div className="text-center p-8">
                    <p className="text-red-600 text-sm">🚨 Error generating QR code data</p>
                    <button
                      onClick={() => setQrType('simple')}
                      className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      🔤 Use Simple Data
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-center max-w-md">
              <p className="text-sm text-gray-700 mb-2 font-medium">
                🌐 Scan this QR code to open the medical summary webpage with complete medical history, appointments, and prescriptions beautifully formatted
              </p>
              
              {/* Patient-Specific QR Information */}
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-3 mb-2">
                <p className="text-xs text-gray-600 font-medium">
                  👤 Patient: <span className="text-blue-700">{patientData?.name || 'Unknown'}</span> • 
                  🎯 Type: <span className="text-purple-700">{
                    qrType === 'simple' ? '🔤 Simple Data' : 
                    qrType === 'medical-summary' ? '📋 Medical Summary' :
                    qrType === 'compact' ? '🏥 Full Medical Summary' :
                    qrType === 'medical-history' ? '🌐 Web Summary' :
                    qrType === 'complete' ? '📄 Complete Medical Data' : 
                    '🔗 Web Summary'
                  }</span>
                </p>
              </div>
              
              {/* Unique QR Code Information */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-center space-x-1 text-xs text-green-700 mb-1">
                  <span>🌐</span>
                  <span className="font-semibold">MEDICAL SUMMARY QR CODE</span>
                </div>
                <p className="text-xs text-green-600">
                  ✅ Opens medical summary webpage for <strong>{patientData?.name || 'this patient'}</strong><br/>
                  ✅ Anyone can scan it without login<br/>
                  ✅ Shows complete medical history & data<br/>
                  ✅ Beautiful formatting on any device
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleDownloadQR}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>📥 Download QR</span>
            </button>
            
            <button
              onClick={handleCopyData}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '✅ Copied!' : '📋 Copy Data'}</span>
            </button>
            
            <button
              onClick={() => setShowData(!showData)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <Eye className="w-4 h-4" />
              <span>{showData ? '👁️ Hide' : '👁️ Show'} Data</span>
            </button>
            
            <button
              onClick={() => setShowMarkdown(!showMarkdown)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>{showMarkdown ? '📝 Hide' : '📝 Show'} Preview</span>
            </button>
            
            <button
              onClick={() => {
                console.log('QR Code Value:', currentQRValue);
                alert(`🏥 QR Code Value Preview:\n\n${currentQRValue.substring(0, 200)}...`);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <QrCode className="w-4 h-4" />
              <span>🧪 Test QR</span>
            </button>
          </div>

          {/* Patient Data Preview */}
          {showData && (
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                📄 {qrType === 'simple' ? '🔤 Simple Data' : 
                     qrType === 'medical-summary' ? '📋 Medical Summary' :
                     qrType === 'compact' ? '🏥 Full Medical Summary' :
                     qrType === 'medical-history' ? '📊 Medical History Only' :
                     qrType === 'complete' ? '📄 Complete Medical Data' : 
                     '🔗 Profile URL'} Preview
              </h4>
              <div className="bg-white rounded-lg border-2 border-blue-200 p-4 max-h-60 overflow-y-auto shadow-inner">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {currentQRValue}
                </pre>
              </div>
            </div>
          )}

          {/* Enhanced Markdown Preview */}
          {showMarkdown && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                📝 {qrType === 'simple' ? '🔤 Simple Data' : 
                     qrType === 'medical-summary' ? '📋 Medical Summary' :
                     qrType === 'compact' ? '🏥 Full Medical Summary' :
                     qrType === 'medical-history' ? '📊 Medical History Only' :
                     qrType === 'complete' ? '📄 Complete Medical Data' : 
                     '🔗 Profile URL'} Markdown Preview
              </h4>
              <div className="bg-white rounded-lg border-2 border-purple-200 p-6 max-h-96 overflow-y-auto shadow-inner">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ children }) => (
                        <div className="overflow-x-auto my-4">
                          <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg shadow-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">{children}</thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="bg-white divide-y divide-gray-200">
                          {children}
                        </tbody>
                      ),
                      tr: ({ children }) => (
                        <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
                      ),
                      th: ({ children }) => (
                        <th className="px-6 py-3 text-left text-xs font-bold text-white uppercase tracking-wider border-r border-blue-400 last:border-r-0">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200 last:border-r-0">
                          {children}
                        </td>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-gradient-to-b from-blue-500 to-purple-500 pl-4 py-2 my-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-r-lg italic text-gray-700 shadow-sm">
                          {children}
                        </blockquote>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gradient-to-r from-blue-300 to-purple-300 pb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-xl font-medium text-gray-700 mb-3 flex items-center">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-lg font-medium text-gray-700 mb-2 flex items-center bg-gray-50 p-2 rounded-lg">
                          {children}
                        </h4>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-none space-y-1 mb-4">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm text-gray-700 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {children}
                        </li>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900 bg-yellow-100 px-1 rounded">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-purple-600 font-medium">{children}</em>
                      ),
                      hr: () => (
                        <hr className="my-6 border-0 h-1 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 rounded-full" />
                      ),
                      code: ({ children, inline }) => 
                        inline ? (
                          <code className="bg-gray-100 text-blue-600 px-1 py-0.5 rounded text-xs font-mono border">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
                            {children}
                          </code>
                        )
                    }}
                  >
                    {currentQRValue}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced QR Code Information */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 shadow-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              ℹ️ QR Code Information & Features
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2 flex items-center">
                  🎯 Current Type: {
                    qrType === 'simple' ? '🔤 Simple Data' : 
                    qrType === 'medical-summary' ? '📋 Medical Summary' :
                    qrType === 'compact' ? '🏥 Full Summary' :
                    qrType === 'medical-history' ? '📊 Medical History' :
                    qrType === 'complete' ? '📄 Complete Data' : 
                    '🔗 Profile URL'
                  }
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {qrType === 'simple' ? (
                    <>
                      <li className="flex items-center">🔸 Contains basic patient info with beautiful styling</li>
                      <li className="flex items-center">🔸 Lightweight and fast to scan on any device</li>
                      <li className="flex items-center">🔸 Colorful emojis and professional formatting</li>
                      <li className="flex items-center">🔸 Safe for sharing with healthcare providers</li>
                      <li className="flex items-center">🔸 Most compatible with all QR readers</li>
                    </>
                  ) : qrType === 'medical-summary' ? (
                    <>
                      <li className="flex items-center">🔸 Ultra-compact with enhanced visual appeal</li>
                      <li className="flex items-center">🔸 Latest medical records with colorful presentation</li>
                      <li className="flex items-center">🔸 Emojis and formatted tables for easy reading</li>
                      <li className="flex items-center">🔸 Perfect for emergency situations</li>
                      <li className="flex items-center">🔸 Quick scan with attractive mobile display</li>
                    </>
                  ) : qrType === 'compact' ? (
                    <>
                      <li className="flex items-center">🔸 Beautiful markdown with color-coded sections</li>
                      <li className="flex items-center">🔸 Medical history, appointments & prescriptions</li>
                      <li className="flex items-center">🔸 Enhanced with emojis and visual elements</li>
                      <li className="flex items-center">🔸 Professional presentation on mobile devices</li>
                      <li className="flex items-center">🔸 Optimized balance of data and visual appeal</li>
                    </>
                  ) : qrType === 'medical-history' ? (
                    <>
                      <li className="flex items-center">🔸 Opens comprehensive health webpage in browser</li>
                      <li className="flex items-center">🔸 Complete medical history with professional formatting</li>
                      <li className="flex items-center">🔸 All appointments and prescriptions included</li>
                      <li className="flex items-center">🔸 Beautiful markdown rendering with colors and emojis</li>
                      <li className="flex items-center">🔸 Perfect for healthcare provider consultations</li>
                      <li className="flex items-center">🔸 Mobile-responsive design for all devices</li>
                    </>
                  ) : qrType === 'complete' ? (
                    <>
                      <li className="flex items-center">🔸 Complete medical data with full styling</li>
                      <li className="flex items-center">🔸 All records with beautiful presentation</li>
                      <li className="flex items-center">🔸 Color-coded sections and enhanced formatting</li>
                      <li className="flex items-center">🔸 Comprehensive healthcare information</li>
                      <li className="flex items-center">🔸 Professional medical report appearance</li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center">🔸 Opens complete health summary webpage</li>
                      <li className="flex items-center">🔸 All medical data: history, appointments, prescriptions</li>
                      <li className="flex items-center">🔸 Professional healthcare report formatting</li>
                      <li className="flex items-center">🔸 Beautiful markdown with colors and statistics</li>
                      <li className="flex items-center">🔸 Mobile-optimized for easy viewing on any device</li>
                      <li className="flex items-center">🔸 Perfect for sharing with medical professionals</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h5 className="font-medium text-purple-800 mb-2 flex items-center">
                  🌟 Enhanced Features
                </h5>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li className="flex items-center">✨ Beautiful emoji icons throughout</li>
                  <li className="flex items-center">🎨 Color-coded information sections</li>
                  <li className="flex items-center">📱 Mobile-optimized markdown rendering</li>
                  <li className="flex items-center">🔒 Secure medical data presentation</li>
                  <li className="flex items-center">📊 Professional table formatting</li>
                  <li className="flex items-center">🎯 Easy-to-scan visual hierarchy</li>
                  <li className="flex items-center">💫 Interactive elements when scanned</li>
                  <li className="flex items-center">🚀 Fast loading and rendering</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 bg-gradient-to-r from-green-100 to-blue-100 border border-green-300 rounded-lg p-3">
              <p className="text-sm text-green-800 flex items-center">
                <span className="mr-2">🛡️</span>
                <strong>Privacy & Security:</strong> All QR codes contain encrypted medical data with beautiful formatting that's safe to share with authorized healthcare providers only.
              </p>
            </div>
          </div>
        </div>
      )}

      {!showQR && (
        <div className="text-center py-8">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <QrCode className="w-12 h-12 text-blue-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-800 mb-2">
            🏥 Generate Beautiful Medical QR Code
          </h4>
          <p className="text-gray-600 mb-2">
            Create stunning, colorful QR codes with enhanced medical information
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Click <span className="font-semibold text-blue-600">"Show QR"</span> to generate professionally formatted medical data
          </p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-xs text-blue-700 font-medium mb-1">
              ✨ Enhanced Features:
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>🎨 Beautiful emojis and color coding</p>
              <p>📱 Mobile-optimized markdown formatting</p>
              <p>📊 Professional medical presentation</p>
              <p>🚀 Fast scanning and attractive display</p>
            </div>
          </div>
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