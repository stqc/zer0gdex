// FeesCard.jsx
import React from 'react';
import './FeesCard.css';

const FeesCard = ({ 
  token0fee = 0, 
  token1fee = 0 ,
  token0,
  token1,
}) => {
  return (
    <div className="fees-card">
      <div className="fees-details">
        <div className="fees-item">
          <span className="fees-label">{token0} Fees Earned:</span>
          <span className="fees-value">{token0fee}</span>
        </div>
      </div>
      <div className="fees-details">
        <div className="fees-item">
          <span className="fees-label">{token1} Fees Earned:</span>
          <span className="fees-value">{token1fee}</span>
        </div>
      </div>
    </div>
  );
};

export default FeesCard;