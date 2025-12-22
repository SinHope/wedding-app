import React, { useState } from 'react';

const Upload = ({ handleFileChange, loading, setError }) => {
  const [files, setFiles] = useState([]);
  const maxNumber = 4;

  // const onChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files);

  //   console.log(selectedFiles)

  //   // Filter valid files (images and videos under size limit)
  //   const validFiles = selectedFiles.filter(file => {
  //     const isImage = file.type.startsWith('image/');
  //     const isVideo = file.type.startsWith('video/');
  //     const isValidSize = file.size <= 60 * 1024 * 1024;

  //     return (isImage || isVideo) && isValidSize;
  //   });

  //   if (validFiles.length !== selectedFiles.length) {
  //     setError('Some files were rejected. Please ensure each file under 60MB.');
  //   }

  //   // Limit to max number
  //   const limitedFiles = validFiles.slice(0, maxNumber);

  //   // Create preview URLs
  //   const fileObjects = limitedFiles.map(file => ({
  //     file,
  //     preview: URL.createObjectURL(file),
  //     type: file.type.startsWith('image/') ? 'image' : 'video'
  //   }));

  //   setFiles(fileObjects);
  //   handleFileChange(limitedFiles);
  // };

  const onChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // console.log(selectedFiles)

    // Filter valid files
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 60 * 1024 * 1024;
      return (isImage || isVideo) && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were rejected. Please ensure each file under 60MB.');
    }

    // Convert existing files to raw File objects
    const existingFiles = files.map(f => {
      return f.file
    });

    // Combine old + new
    const combinedFiles = [...existingFiles, ...validFiles];

    // Enforce max limit
    const limitedFiles = combinedFiles.slice(0, maxNumber);

    // Create previews
    const fileObjects = limitedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));


    setFiles(fileObjects);
    handleFileChange(limitedFiles);

    // // Reset input so same file can be picked again if needed
    // e.target.value = null;
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    handleFileChange(newFiles.map(f => f.file));
  };

  const removeAll = () => {
    files.forEach(f => URL.revokeObjectURL(f.preview)); // Clean up memory
    setFiles([]);
    handleFileChange([]);
  };

  React.useEffect(() => {
    handleFileChange(files.map(f => f.file));
  }, [files]);


  return (
    <div className="text-center">
      <div className="upload__image-wrapper">
        {/* Upload Card */}
        <label
          htmlFor="file-input"
          className="image-upload-card text-center p-4 mt-4 border rounded bg-light"
          style={{
            cursor: 'pointer',
            display: 'block',
            transition: '0.2s ease',
          }}
        >
          <i className="bi bi-camera fs-3 mb-2"></i>
          <p className="mb-1">
            {files.length > 0
              ? `${files.length}/${maxNumber} file${files.length > 1 ? 's' : ''} selected`
              : 'Tap to upload'}
          </p>
          <small className="text-muted">Images / Videos (up to 60Mb)</small>
        </label>

        <input
          id="file-input"
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={onChange}
          style={{ display: 'none' }}
          disabled={loading}
        />

        {/* Preview Section */}
        {files.length > 0 && (
          <div className="mt-3">
            <div className="d-flex flex-wrap justify-content-center">
              {files.map((fileObj, index) => (
                <div
                  key={index}
                  className="m-2 position-relative border rounded p-1"
                  style={{ width: 100 }}
                >
                  {fileObj.type === 'image' ? (
                    <img
                      src={fileObj.preview}
                      alt=""
                      className="img-fluid rounded"
                      style={{ objectFit: 'cover', height: 100, width: '100%' }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center rounded"
                      style={{
                        height: 100,
                        width: '100%',
                        backgroundColor: '#000'
                      }}
                    >
                      <i className="bi bi-play-circle text-white" style={{ fontSize: '2rem' }}></i>
                    </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onClick={() => removeFile(index)}
                    style={{ borderRadius: '0 4px 0 4px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm mt-2"
              onClick={removeAll}
            >
              Remove All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;

