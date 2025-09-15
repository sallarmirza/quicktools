import { useState, useRef, useEffect } from "react";

export const Camera = () => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 } } 
        });
        setStream(mediaStream);
        if (videoRef.current) videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      } catch (err) {
        setError("Camera access denied or not available");
      }
    };
    
    if (isCameraActive) {
      startCamera();
    }

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
  }, [isCameraActive]);

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setPhotoUrl(canvas.toDataURL("image/png"));
  };

  const clearPhoto = () => {
    setPhotoUrl(null);
    setIsCameraActive(true);
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setPhotoUrl(null);
  };

  const restartCamera = () => {
    closeCamera();
    setTimeout(() => setIsCameraActive(true), 100);
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-light text-gray-800 mb-6">Camera</h2>
      
      {error && (
        <div className="w-full p-4 bg-red-50 text-red-700 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {!photoUrl ? (
        <div className="w-full space-y-6">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-video">
            {isCameraActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center p-6">
                  <div className="text-gray-400 text-4xl mb-3">📷</div>
                  <p className="text-gray-500">Camera is off</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isCameraActive ? (
              <>
                <button
                  onClick={takePicture}
                  className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200"
                >
                  <span className="mr-2">📸</span> Capture
                </button>
                <button
                  onClick={closeCamera}
                  className="flex items-center justify-center bg-gray-100 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200"
                >
                  <span className="mr-2">⏹️</span> Stop Camera
                </button>
              </>
            ) : (
              <button
                onClick={restartCamera}
                className="flex items-center justify-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                <span className="mr-2">🎥</span> Start Camera
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full space-y-6">
          <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video">
            <img 
              src={photoUrl} 
              alt="Captured" 
              className="w-full h-full object-contain" 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={clearPhoto}
              className="flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg shadow-sm hover:bg-gray-50 transition duration-200"
            >
              <span className="mr-2">🔄</span> Retake
            </button>
            <button
              onClick={closeCamera}
              className="flex items-center justify-center bg-gray-100 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-200 transition duration-200"
            >
              <span className="mr-2">✅</span> Done
            </button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};