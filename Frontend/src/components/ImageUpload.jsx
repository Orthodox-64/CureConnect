import { Upload, RefreshCw } from 'lucide-react';

function ImageUpload({ selectedImage, fileInputRef, handleImageUpload, resetAnalysis }) {
    return (
        <div className="mb-8">
            <div className={`border-2 border-dashed rounded-xl p-8 text-center
        ${selectedImage ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
        transition-colors duration-200`}>
                {!selectedImage ? (
                    <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Upload an image for analysis</p>
                        <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                    </div>
                ) : (
                    <div className="relative">
                        <img
                            src={selectedImage}
                            alt="Uploaded image"
                            className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                            onClick={resetAnalysis}
                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
}

export default ImageUpload;