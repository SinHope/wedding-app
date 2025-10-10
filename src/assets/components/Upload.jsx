// import React, { useState } from 'react';
// import ImageUploading from 'react-images-uploading';

// const Upload = ({ handleFileChange, loading }) => {
//   const [images, setImages] = useState([]);
//   const maxNumber = 6;

//   const onChange = (imageList) => {
//     setImages(imageList);
//     const files = imageList.map((img) => img.file);
//     handleFileChange(files);
//   };

//   return (
//     <div className="text-center">
//       <ImageUploading
//         multiple
//         value={images}
//         onChange={onChange}
//         maxNumber={maxNumber}
//         dataURLKey="data_url"
//       >
//         {({
//           imageList,
//           onImageUpload,
//           onImageRemoveAll,
//           onImageRemove,
//           isDragging,
//           dragProps,
//         }) => (
//           <div className="upload__image-wrapper">
//             {/* Upload Card (Custom UI) */}
//             <div
//               className="image-upload-card text-center p-4 mt-4 border rounded bg-light"
//               onClick={onImageUpload}
//               style={{
//                 cursor: 'pointer',
//                 borderColor: isDragging ? '#0d6efd' : '#dee2e6',
//                 backgroundColor: isDragging ? '#f8f9fa' : '#fff',
//                 transition: '0.2s ease',
//               }}
//               {...dragProps}
//             >
//               <i className="bi bi-camera fs-3 mb-2"></i>
//               <p className="mb-1">
//                 {imageList.length > 0
//                   ? `${imageList.length}/${maxNumber} file${imageList.length > 1 ? 's' : ''} selected`
//                   : 'Tap to upload'}
//               </p>
//               <small className="text-muted">Images / Videos</small>
//             </div>

//             {/* Preview Section */}
//             {imageList.length > 0 && (
//               <div className="mt-3">
//                 <div className="d-flex flex-wrap justify-content-center">
//                   {imageList.map((image, index) => (
//                     <div
//                       key={index}
//                       className="m-2 position-relative border rounded p-1"
//                       style={{ width: 100 }}
//                     >
//                       <img
//                         src={image.data_url}
//                         alt=""
//                         className="img-fluid rounded"
//                         style={{ objectFit: 'cover', height: 100, width: '100%' }}
//                       />
//                       <button
//                         type="button"
//                         className="btn btn-sm btn-danger position-absolute top-0 end-0"
//                         onClick={() => onImageRemove(index)}
//                         style={{ borderRadius: '0 4px 0 4px' }}
//                       >
//                         ×
//                       </button>
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   type="button"
//                   className="btn btn-outline-danger btn-sm mt-2"
//                   onClick={onImageRemoveAll}
//                 >
//                   Remove All
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </ImageUploading>
//     </div>
//   );
// };


// export default Upload;

import React, { useState } from 'react';

const Upload = ({ handleFileChange, loading }) => {
  const [files, setFiles] = useState([]);
  const maxNumber = 6;

  const onChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    // Filter valid files (images and videos under size limit)
    const validFiles = selectedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB max

      return (isImage || isVideo) && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were rejected. Please ensure images are under 5MB and videos under 20MB.');
    }

    // Limit to max number
    const limitedFiles = validFiles.slice(0, maxNumber);

    // Create preview URLs
    const fileObjects = limitedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));

    setFiles(fileObjects);
    handleFileChange(limitedFiles);
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

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      files.forEach(f => URL.revokeObjectURL(f.preview));
    };
  }, []);

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
          <small className="text-muted">Images / Videos (max 50MB each)</small>
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
