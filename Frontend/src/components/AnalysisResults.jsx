import { MessageSquare, Loader2, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function AnalysisResults({ isAnalyzing, analysis }) {
    return (
        <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
            </div>

            {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    <span className="ml-3 text-gray-600">Analyzing image...</span>
                </div>
            ) : analysis ? (
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <ReactMarkdown>{analysis}</ReactMarkdown>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>Upload an image to receive analysis</p>
                </div>
            )}
        </div>
    );
}

export default AnalysisResults;