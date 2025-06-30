import React from 'react';

interface InteractiveIconProps {
  id: string;
  x: number;
  y: number;
  isDragging: boolean;
}

const emojis = ['🎯', '🎮', '🎨', '🎭', '🎪', '🎸', '🎺', '⚽', '🏀', '🎳', '🎲', '🎊', '🎈', '💫', '⭐', '🌟', '✨', '🔥', '💎'];

const InteractiveIcon: React.FC<InteractiveIconProps> = ({ id, x, y, isDragging }) => {
  const emojiIndex = parseInt(id.split('-')[1]) % emojis.length;
  const emoji = emojis[emojiIndex];

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        transition: 'all 0.2s ease-in-out',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: '16px',
          borderRadius: '9999px',
          background: isDragging
            ? 'linear-gradient(to right, #ec4899, #8b5cf6)' 
            : 'linear-gradient(to right, #22d3ee, #3b82f6)', 
          boxShadow: isDragging
            ? '0 0 20px rgba(236, 72, 153, 0.6)'
            : '0 0 20px rgba(34, 211, 238, 0.6)',
        }}
      >
        <span style={{
          fontSize: '2rem',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.4))',
          userSelect: 'none'
        }}>
          {emoji}
        </span>
      </div>
    </div>
  );
};

export default InteractiveIcon;
