import React, { useState, useEffect } from 'react';
import Webcam from "react-webcam";
import InteractiveIcon from './components/InteractiveIcon';
import CameraInput from './components/CameraInput';

interface IconState {
  id: string;
  x: number;
  y: number;
  isDropped: boolean;
}

const dropZone = {
  x: window.innerWidth - 150,
  y: window.innerHeight - 150,
  size: 120,
};

const App: React.FC = () => {
  const [handPos, setHandPos] = useState({ x: 0, y: 0 });

  const [icons, setIcons] = useState<IconState[]>([
    { id: "icon-0", x: 100, y: 100, isDropped: false },
    { id: "icon-1", x: 150, y: 200, isDropped: false },
    { id: "icon-2", x: 200, y: 300, isDropped: false },
  ]);

  const [won, setWon] = useState(false);

  useEffect(() => {
    let changed = false;

    const updated = icons.map((icon) => {
      if (icon.isDropped) return icon;

      const dist = Math.sqrt((icon.x - handPos.x) ** 2 + (icon.y - handPos.y) ** 2);
      const nearHand = dist < 100; 

      const inBox =
        handPos.x > dropZone.x &&
        handPos.x < dropZone.x + dropZone.size &&
        handPos.y > dropZone.y &&
        handPos.y < dropZone.y + dropZone.size;

      if (inBox) {
        changed = true;
        return {
          ...icon,
          x: dropZone.x + dropZone.size / 2,
          y: dropZone.y + dropZone.size / 2,
          isDropped: true
        };
      }

      if (nearHand) {
        changed = true;
        return {
          ...icon,
          x: handPos.x,
          y: handPos.y
        };
      }

      return icon;
    });

    if (changed) {
      setIcons(updated);
    }

    const allDropped = updated.every(icon => icon.isDropped);
    if (allDropped && !won) {
      setWon(true);
    }
  }, [handPos]);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Webcam */}
      <Webcam
        style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          top: 0,
          left: 0,
          zIndex: 0,
        }}
        audio={false}
        mirrored
      />

      {/* Hand Tracking */}
      <CameraInput onHandMove={(x, y) => setHandPos({ x, y })} />

      {/* Drop Zone */}
      <div
        style={{
          position: 'absolute',
          width: `${dropZone.size}px`,
          height: `${dropZone.size}px`,
          border: '4px dashed #fff',
          borderRadius: '16px',
          left: `${dropZone.x}px`,
          top: `${dropZone.y}px`,
          zIndex: 1,
        }}
      >
        <span style={{
          color: '#fff',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '20px'
        }}>
          Drop Here
        </span>
      </div>

      {/* Emojis */}
      {icons.map((icon) => (
        <InteractiveIcon key={icon.id} id={icon.id} x={icon.x} y={icon.y} isDragging={!icon.isDropped} />
      ))}

      {/* Winner Message */}
      {won && (
        <div style={{
          position: 'absolute',
          top: '30%',
          width: '100%',
          textAlign: 'center',
          fontSize: '3rem',
          color: '#00FF00',
          fontWeight: 'bold',
          textShadow: '2px 2px 10px #000',
          zIndex: 10,
        }}>
          🎉 You won the game!
        </div>
      )}
    </div>
  );
};

export default App;
