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
            <span style={{color:"#5C4C5C", fontSize:"0.9rem"}}>Risk: <span style={{color:"#E44F4F", fontSize:"1.5rem"}}>{Array(option.risk).fill("●").join(" ")}</span></span>
            <span style={{color:"#5C4C5C",fontSize:"0.9rem"}}>Profit: <span style={{color:"#14B8A9", fontSize:"1.5rem"}}>{Array(option.profit).fill("●").join(" ")}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RangeOptions;
