import React, { useRef, useEffect } from 'react';
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

interface CameraInputProps {
  onHandMove: (x: number, y: number) => void;
}

const CameraInput: React.FC<CameraInputProps> = ({ onHandMove }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const hands = new Hands({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks[0]) {
        const fingerTip = results.multiHandLandmarks[0][8]; 
        const x = fingerTip.x * window.innerWidth;
        const y = fingerTip.y * window.innerHeight;

        console.log("Finger Position:", x, y);
        onHandMove(x, y);
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await hands.send({ image: videoRef.current! });
      },
      width: 640,
      height: 480,
    });

    videoRef.current.srcObject = null; 
    camera.start();

    return () => {
      hands.close();
    };
  }, []);

  return (
    <video ref={videoRef} style={{ display: 'none' }} autoPlay playsInline muted />
  );
};

export default CameraInput;
