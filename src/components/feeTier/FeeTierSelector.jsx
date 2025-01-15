import React from "react";
import "./FeeTierSelector.css";

function FeeTierSelector({ selectedTier, onChange }) {

  const tiers = [
    { value: 500, description: "Best for stable pairs.", percent: "12% select" },
    { value: 3000, description: "Best for most pairs.", percent: "64% select" },
    { value: 10000, description: "Best for exotic pairs.", percent: "8% select" },
  ];

  return (
    <div className="fee-tier-selector">
      {tiers.map((tier) => (
        <div
          key={tier.value}
          className={`fee-tier-card ${selectedTier === tier.value ? "highlight" : ""} ${
            selectedTier === tier.value ? "selected" : ""
          }`}
          onClick={() => onChange(tier.value)}
        >
          <div className="tier-value">
            {selectedTier === tier.value && <span>🔥</span>}
            {tier.value/10000}%
          </div>
          <div className="tier-description">{tier.description}</div>
          {/* <div className="tier-percent">{tier.percent}</div> */}
        </div>
      ))}
    </div>
  );
}

export default FeeTierSelector;
