import React from "react";
import "./SliderInput.css";

const SliderInput = ({ label, value, onChange, onIncrement, onDecrement }) => {
  return (
    <div className="slider-input">
      <div className="slider-header">
        <span className="label">{label}</span>
      </div>
      <div className="slider-control">
        <button 
          className="control-button" 
          onClick={value > 0 ? onDecrement : null}
        >
          <span className="minus">−</span>
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={0}
          className="value-input"
        />
        <button 
          className="control-button" 
          onClick={onIncrement}
        >
          <span className="plus">+</span>
        </button>
      </div>
      <span className="unit">USDT per ETH</span>
    </div>
  );
};

export default SliderInput;