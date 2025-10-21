function Disclaimer() {
  return (
    <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto mt-4">
      <p className="mb-2">
        ⚠️ <strong>Disclaimer:</strong> This application is a demonstration of AI-powered medical image analysis.
      </p>
      <p className="mb-2">
        The insights or predictions generated here are for <strong>educational and experimental purposes only.</strong>
      </p>
      <p className="mb-2">
        This tool does <strong>not replace professional medical diagnosis</strong> or treatment recommendations.
      </p>
      <p className="mb-2">
        For any health concerns or conditions, please <strong>consult a certified medical professional</strong>.
      </p>
      <p className="text-gray-500 italic">
        The developers and AI model providers are <strong>not liable</strong> for any clinical decisions made based on this tool.
      </p>
    </div>
  );
}

export default Disclaimer;
