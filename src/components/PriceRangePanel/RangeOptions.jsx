import React from "react";
import "./RangeOptions.css";

const options = [
  { label: "Full Range", risk: 1, profit: 1 },
  { label: "Safe", risk: 2, profit: 2 },
  { label: "Common", risk: 3, profit: 3 },
  { label: "Expert", risk: 4, profit: 4 },
];

const RangeOptions = ({ selectedType = "Full Range", onChange = () => {} }) => {
  return (
    <div className="range-options">
      {options.map((option) => (
        <div
          key={option.label}
          className={`range-option ${selectedType === option.label ? "selected" : ""}`}
          onClick={() => onChange(option.label)}
        >
          <div className="option-header">
            <div className="checkbox">
              {selectedType === option.label && <span className="checkmark">✓</span>}
            </div>
            <span className="option-label">{option.label}</span>
          </div>
          
          <div className="option-info">
            <div className="metric">
              <span className="label">Risk:</span>
              <span className="dots risk">
                {Array(option.risk).fill("●").join(" ")}
              </span>
            </div>
            <div className="metric">
              <span className="label">Profit:</span>
              <span className="dots profit">
                {Array(option.profit).fill("●").join(" ")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RangeOptions;