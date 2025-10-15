import React, { useState, useRef, useCallback } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import type { ImageData } from '../types';

interface BeforeAfterSliderProps {
  before: ImageData;
  after: ImageData;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);
  
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };
  
  const handleTouchStart = () => {
      isDragging.current = true;
  };
  
  const handleTouchEnd = () => {
      isDragging.current = false;
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
      handleMove(e.touches[0].clientX);
  };

  return (
    <div 
        ref={containerRef}
        className="relative w-full max-w-full max-h-full aspect-video md:aspect-[4/3] rounded-lg overflow-hidden select-none cursor-ew-resize touch-none"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
    >
      <img src={before.url} alt="Original" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
      <div 
        className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={after.url} alt="Edited" className="absolute inset-0 w-full h-full object-contain" />
      </div>
      
      <div
        className="absolute top-0 bottom-0 w-1 bg-brand-purple/80 cursor-ew-resize"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-brand-purple rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
};