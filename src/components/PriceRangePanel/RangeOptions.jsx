import React from "react";
import "./RangeOptions.css";

const options = [
  { label: "Full Range", risk: 1, profit: 2 },
  { label: "Safe", risk: 2, profit: 2 },
  { label: "Common", risk: 3, profit: 3 },
  { label: "Expert", risk: 4, profit: 5 },
];

const RangeOptions = ({ selectedType, onChange }) => {
  return (
    <div className="range-options">
      {options.map((option) => (
        <div
          key={option.label}
          className={`range-option ${selectedType === option.label ? "selected" : ""}`}
          onClick={() => onChange(option.label)}
        >
          <div className="option-label">
            {selectedType === option.label && <span>✔</span>} {option.label}
          </div>
          <div className="option-info">
            <span>Risk: {Array(option.risk).fill("●").join(" ")}</span>
            <span>Profit: {Array(option.profit).fill("●").join(" ")}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RangeOptions;
