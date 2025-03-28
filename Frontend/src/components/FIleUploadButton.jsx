import React, { useRef } from 'react';
import { Upload } from 'lucide-react';

const FileUploadButton = ({ onChange }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="animate-fade-up">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onChange}
        className="input-file"
        id="file-upload"
      />
      <label 
        htmlFor="file-upload" 
        className="input-file-label"
        onClick={handleClick}
      >
        <Upload size={20} />
        <span>Choose Image</span>
      </label>
    </div>
  );
};

export default FileUploadButton;