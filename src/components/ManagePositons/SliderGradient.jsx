import React, { useState } from 'react';

const GradientSlider = ({ min = 0, max = 100, value=0, onChange }) => {
  // Calculate percentage for thumb position
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-container">
      <div className="slider-track" />
      <div 
        className="slider-thumb"
        style={{
          left: `${percentage}%`,
          transform: `translateX(-50%)${percentage === 50 ? ' scale(1.2)' : ''}`,
          display:value===0?"none":"initial"
        }}
      />
      <input
        type="range"
        className="slider-input"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
      />
    </div>
  );
};


export default GradientSlider;