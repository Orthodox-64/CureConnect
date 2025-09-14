import React, { useState } from 'react';
import { analyzeVideoWithSnapshot } from '../utils/videoSnapshot';

const VideoAnalysisTest = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedVideo(file);
            setResult(null);
            setError(null);
        }
    };

    const handleTestAnalysis = async () => {
        if (!selectedVideo) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            console.log('Starting video analysis test...');
            const analysisResult = await analyzeVideoWithSnapshot(selectedVideo, 'xray', 2);
            
            setResult(analysisResult);
            console.log('Video analysis test completed successfully:', analysisResult);
        } catch (err) {
            setError(err.message);
            console.error('Video analysis test failed:', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Video Analysis Test</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <h3>1. Upload Video</h3>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    style={{ marginBottom: '10px' }}
                />
                {selectedVideo && (
                    <p>Selected: {selectedVideo.name}</p>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>2. Test Analysis</h3>
                <button
                    onClick={handleTestAnalysis}
                    disabled={!selectedVideo || isAnalyzing}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: selectedVideo && !isAnalyzing ? '#2196f3' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: selectedVideo && !isAnalyzing ? 'pointer' : 'not-allowed'
                    }}
                >
                    {isAnalyzing ? 'Analyzing...' : 'Test Video Analysis'}
                </button>
            </div>

            {isAnalyzing && (
                <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px', marginBottom: '20px' }}>
                    <h3>Analysis in Progress...</h3>
                    <p>Please wait while we capture a snapshot and analyze it with AI.</p>
                    <div style={{ width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ 
                            width: '100%', 
                            height: '100%', 
                            backgroundColor: '#4caf50',
                            animation: 'pulse 1s infinite'
                        }}></div>
                    </div>
                </div>
            )}

            {error && (
                <div style={{ padding: '20px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '20px' }}>
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            )}

            {result && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>Analysis Results</h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h4>Captured Image:</h4>
                        <img 
                            src={result.imageUrl} 
                            alt="Captured snapshot" 
                            style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                    
                    <div>
                        <h4>AI Analysis:</h4>
                        <div style={{ 
                            padding: '15px', 
                            backgroundColor: '#f5f5f5', 
                            borderRadius: '4px',
                            whiteSpace: 'pre-wrap',
                            fontFamily: 'monospace',
                            fontSize: '14px'
                        }}>
                            {result.analysis}
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </div>
    );
};

export default VideoAnalysisTest;
