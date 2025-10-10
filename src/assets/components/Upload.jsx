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
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB max

      return (isImage || isVideo) && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      alert('Some files were rejected. Please ensure images are under 5MB and videos under 50MB.');
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


//without the checkvideo duration
// import React, { useState } from 'react';

// const Upload = ({ handleFileChange, loading }) => {
//   const [files, setFiles] = useState([]);
//   const [processing, setProcessing] = useState(false);
//   const maxNumber = 6;
//   const maxVideoSize = 50 * 1024 * 1024; // 50MB
//   const maxImageSize = 5 * 1024 * 1024; // 5MB

//   const onChange = async (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setProcessing(true);

//     const validFileObjects = [];

//     for (const file of selectedFiles) {
//       try {
//         const isImage = file.type.startsWith('image/');
//         const isVideo = file.type.startsWith('video/');

//         if (!isImage && !isVideo) {
//           alert(`${file.name} is not a valid image or video`);
//           continue;
//         }

//         // Validate image size
//         if (isImage && file.size > maxImageSize) {
//           alert(`${file.name} exceeds 5MB limit for images`);
//           continue;
//         }

//         // Validate video size
//         if (isVideo && file.size > maxVideoSize) {
//           alert(`${file.name} exceeds 50MB limit. Please compress the video before uploading.`);
//           continue;
//         }

//         // Create preview
//         validFileObjects.push({
//           file,
//           preview: URL.createObjectURL(file),
//           type: isImage ? 'image' : 'video'
//         });

//       } catch (error) {
//         console.error('Error processing file:', error);
//         alert(`Error processing ${file.name}`);
//       }
//     }

//     setProcessing(false);

//     // Limit to max number
//     const limitedFiles = validFileObjects.slice(0, maxNumber);

//     setFiles(limitedFiles);
//     handleFileChange(limitedFiles.map(f => f.file));

//     // Reset input
//     e.target.value = '';
//   };

//   const removeFile = (index) => {
//     const newFiles = files.filter((_, i) => i !== index);
//     setFiles(newFiles);
//     handleFileChange(newFiles.map(f => f.file));
//   };

//   const removeAll = () => {
//     files.forEach(f => URL.revokeObjectURL(f.preview));
//     setFiles([]);
//     handleFileChange([]);
//   };

//   React.useEffect(() => {
//     return () => {
//       files.forEach(f => URL.revokeObjectURL(f.preview));
//     };
//   }, []);

//   return (
//     <div className="text-center">
//       <div className="upload__image-wrapper">
//         {/* Upload Card */}
//         <label
//           htmlFor="file-input"
//           className="image-upload-card text-center p-4 mt-4 border rounded bg-light"
//           style={{
//             cursor: processing ? 'not-allowed' : 'pointer',
//             display: 'block',
//             transition: '0.2s ease',
//             opacity: processing ? 0.6 : 1
//           }}
//         >
//           <i className="bi bi-camera fs-3 mb-2"></i>
//           <p className="mb-1">
//             {processing ? 'Processing...' :
//               files.length > 0
//                 ? `${files.length}/${maxNumber} file${files.length > 1 ? 's' : ''} selected`
//                 : 'Tap to upload'}
//           </p>
//           <small className="text-muted">
//             Images (max 5MB) / Videos (max 50MB)
//           </small>
//         </label>

//         <input
//           id="file-input"
//           type="file"
//           accept="image/*,video/*"
//           multiple
//           onChange={onChange}
//           style={{ display: 'none' }}
//           disabled={loading || processing}
//         />

//         {/* Preview Section */}
//         {files.length > 0 && (
//           <div className="mt-3">
//             <div className="d-flex flex-wrap justify-content-center">
//               {files.map((fileObj, index) => (
//                 <div
//                   key={index}
//                   className="m-2 position-relative border rounded p-1"
//                   style={{ width: 100 }}
//                 >
//                   {fileObj.type === 'image' ? (
//                     <img
//                       src={fileObj.preview}
//                       alt=""
//                       className="img-fluid rounded"
//                       style={{ objectFit: 'cover', height: 100, width: '100%' }}
//                     />
//                   ) : (
//                     <div
//                       className="d-flex align-items-center justify-content-center rounded"
//                       style={{
//                         height: 100,
//                         width: '100%',
//                         backgroundColor: '#000'
//                       }}
//                     >
//                       <i className="bi bi-play-circle text-white" style={{ fontSize: '2rem' }}></i>
//                     </div>
//                   )}
//                   <button
//                     type="button"
//                     className="btn btn-sm btn-danger position-absolute top-0 end-0"
//                     onClick={() => removeFile(index)}
//                     style={{ borderRadius: '0 4px 0 4px' }}
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <button
//               type="button"
//               className="btn btn-outline-danger btn-sm mt-2"
//               onClick={removeAll}
//             >
//               Remove All
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Upload;


//to work on this next
// import React, { useState } from 'react';

// import { FFmpeg } from '@ffmpeg/ffmpeg';
// // import { fetchFile, toBlobURL } from '@ffmpeg/util';

// const { createFFmpeg, fetchFile } = FFmpeg;

// const ffmpeg = createFFmpeg({ log: true }); // FFmpeg instance

// const Upload = ({ handleFileChange, loading }) => {
//   const [files, setFiles] = useState([]);
//   const [processing, setProcessing] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const maxNumber = 6;
//   const maxVideoSize = 70 * 1024 * 1024; // 70MB limit
//   const maxImageSize = 5 * 1024 * 1024; // 5MB for images

//   const compressVideo = async (file) => {
//     if (!ffmpeg.isLoaded()) await ffmpeg.load();

//     setProgress(5);
//     ffmpeg.FS('writeFile', file.name, await fetchFile(file));

//     // Run FFmpeg compression
//     // This example converts to 720p and reduces bitrate
//     await ffmpeg.run(
//       '-i', file.name,
//       '-vf', 'scale=1280:-1', // resize to 720p (keeps aspect)
//       '-b:v', '1000k',        // reduce video bitrate
//       '-c:a', 'aac',          // audio codec
//       '-movflags', 'faststart',
//       'output.mp4'
//     );

//     setProgress(80);
//     const data = ffmpeg.FS('readFile', 'output.mp4');
//     const compressedBlob = new Blob([data.buffer], { type: 'video/mp4' });

//     setProgress(100);
//     return new File([compressedBlob], `compressed-${file.name}`, { type: 'video/mp4' });
//   };

//   const onChange = async (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     setProcessing(true);
//     setProgress(0);

//     const processedFiles = [];

//     for (const file of selectedFiles) {
//       const isImage = file.type.startsWith('image/');
//       const isVideo = file.type.startsWith('video/');

//       if (isImage && file.size > maxImageSize) {
//         alert(`${file.name} exceeds 5MB image limit.`);
//         continue;
//       }

//       if (isVideo && file.size > maxVideoSize) {
//         alert(`${file.name} exceeds 70MB video limit.`);
//         continue;
//       }

//       let finalFile = file;

//       // Compress if video
//       if (isVideo) {
//         try {
//           setProgress(10);
//           finalFile = await compressVideo(file);
//         } catch (err) {
//           console.error('Compression failed:', err);
//           alert(`Failed to compress ${file.name}, using original.`);
//         }
//       }

//       processedFiles.push({
//         file: finalFile,
//         preview: URL.createObjectURL(finalFile),
//         type: isImage ? 'image' : 'video'
//       });
//     }

//     setFiles(processedFiles);
//     handleFileChange(processedFiles.map(f => f.file));
//     setProcessing(false);
//     setProgress(0);
//     e.target.value = ''; // reset input
//   };

//   return (
//     <div className="text-center">
//       <div className="upload__image-wrapper">

//         <label
//           htmlFor="file-input"
//           className="image-upload-card text-center p-4 mt-4 border rounded bg-light"
//           style={{
//             cursor: processing ? 'not-allowed' : 'pointer',
//             opacity: processing ? 0.6 : 1,
//             transition: '0.2s ease'
//           }}
//         >
//           <i className="bi bi-camera fs-3 mb-2"></i>
//           <p className="mb-1">
//             {processing
//               ? `Compressing... ${progress}%`
//               : files.length > 0
//                 ? `${files.length}/${maxNumber} selected`
//                 : 'Tap to upload'}
//           </p>
//           <small className="text-muted">Images (max 5MB) / Videos (max 70MB)</small>
//         </label>

//         <input
//           id="file-input"
//           type="file"
//           accept="image/*,video/*"
//           multiple
//           onChange={onChange}
//           style={{ display: 'none' }}
//           disabled={loading || processing}
//         />

//         {/* Preview Section */}
//         {files.length > 0 && (
//           <div className="mt-3">
//             <div className="d-flex flex-wrap justify-content-center">
//               {files.map((fileObj, index) => (
//                 <div
//                   key={index}
//                   className="m-2 position-relative border rounded p-1"
//                   style={{ width: 100 }}
//                 >
//                   {fileObj.type === 'image' ? (
//                     <img
//                       src={fileObj.preview}
//                       alt=""
//                       className="img-fluid rounded"
//                       style={{ objectFit: 'cover', height: 100, width: '100%' }}
//                     />
//                   ) : (
//                     <div
//                       className="d-flex align-items-center justify-content-center rounded"
//                       style={{
//                         height: 100,
//                         width: '100%',
//                         backgroundColor: '#000'
//                       }}
//                     >
//                       <i className="bi bi-play-circle text-white" style={{ fontSize: '2rem' }}></i>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Upload;
