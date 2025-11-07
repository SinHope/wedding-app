// import React, { useState } from "react";

// // Use the CDN version of ffmpeg.wasm
// const FFmpegCDN = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js";

// const VideoCompressor = () => {
//   const [videoFile, setVideoFile] = useState(null);
//   const [compressedVideoURL, setCompressedVideoURL] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

//   // Load FFmpeg dynamically
//   const loadFFmpeg = async () => {
//     if (window.FFmpeg && !ffmpegLoaded) {
//       setFfmpegLoaded(true);
//     } else if (!window.FFmpeg) {
//       const script = document.createElement("script");
//       script.src = FFmpegCDN;
//       script.onload = () => setFfmpegLoaded(true);
//       script.onerror = () => alert("Failed to load FFmpeg script. Check the URL.");
//       document.body.appendChild(script);
//     }
//   };

//   const handleCompress = async () => {
//     if (!videoFile) return;

//     await loadFFmpeg();

//     if (!window.FFmpeg) return alert("FFmpeg failed to load");

//     setIsProcessing(true);

//     const { createFFmpeg, fetchFile } = window.FFmpeg;
//     const ffmpeg = createFFmpeg({ log: true });
//     await ffmpeg.load();

//     // Write input file
//     ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));

//     // Run compression with scaling to reduce memory usage
//     // await ffmpeg.run(
//     //   "-i", "input.mp4",
//     //   "-vf", "scale=1280:-2",   // width 1280px, maintain aspect ratio
//     //   "-vcodec", "libx264",
//     //   "-crf", "28",             // quality
//     //   "-threads", "1",          // reduce memory usage
//     //   "output.mp4"
//     // );

//     await ffmpeg.run(
//       "-i",
//       "input.mp4",
//       "-vf",
//       "scale=1280:-2", // scale width to 1280px, keep aspect ratio
//       "-vcodec",
//       "libx264",
//       "-crf",
//       "24",           // slightly higher CRF for smaller size
//       "-preset",
//       "fast",         // faster compression
//       "output.mp4"
//     );


//     const data = ffmpeg.FS("readFile", "output.mp4");
//     const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
//     setCompressedVideoURL(url);

//     setIsProcessing(false);
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept="video/*"
//         onChange={(e) => setVideoFile(e.target.files[0])}
//       />
//       <button onClick={handleCompress} disabled={isProcessing || !videoFile}>
//         {isProcessing ? "Processing..." : "Compress Video"}
//       </button>

//       {compressedVideoURL && (
//         <video src={compressedVideoURL} controls width="480" />
//       )}
//     </div>
//   );
// };

// export default VideoCompressor;

import React, { useState, useEffect } from "react";

// CDN URL for ffmpeg.wasm
const FFmpegCDN = "https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js";

const VideoCompressor = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [compressedVideoURL, setCompressedVideoURL] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  // Load FFmpeg once when component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = FFmpegCDN;
    script.onload = () => {
      console.log("FFmpeg script loaded!");
      setFfmpegLoaded(true);
    };
    script.onerror = () => {
      alert("Failed to load FFmpeg script. Check the URL.");
    };
    document.body.appendChild(script);
  }, []);

  const handleCompress = async () => {
    if (!videoFile) return;
    if (!ffmpegLoaded) return alert("FFmpeg is still loading, please wait...");

    setIsProcessing(true);

    const { createFFmpeg, fetchFile } = window.FFmpeg;
    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));

    await ffmpeg.run(
      "-i",
      "input.mp4",
      "-vf",
      "scale=-2:720",
      "-vcodec",
      "libx264",
      "-crf",
      "28",
      "-preset",
      "faster",
      "-c:a", "copy",
      "output.mp4"
    );

    const data = ffmpeg.FS("readFile", "output.mp4");
    const url = URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }));
    setCompressedVideoURL(url);

    setIsProcessing(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files[0])}
      />
      <button onClick={handleCompress} disabled={isProcessing || !videoFile || !ffmpegLoaded}>
        {isProcessing ? "Processing..." : "Compress Video"}
      </button>

      {!ffmpegLoaded && <p>Loading FFmpeg...</p>}

      {compressedVideoURL && (
        <video src={compressedVideoURL} controls width="480" />
      )}
    </div>
  );
};

export default VideoCompressor;
