import React from "react";
import "./SliderInput.css";

const SliderInput = ({ label, value, onChange, onIncrement, onDecrement }) => {
  return (
    <div className="slider-input">
      <span className="slider-label">{label}</span>
      <div className="slider-control">
        <button className="slider-button" onClick={value>0? onDecrement:null}>
          -
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={0}
        />
        <button className="slider-button" onClick={onIncrement}>
          +
        </button>
      </div>
      <span className="slider-unit">USDT per ETH</span>
    </div>
  );
};

export default SliderInput;
