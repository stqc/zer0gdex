import React from "react";
import "./DepositInputs.css";

const DepositInputs = ({setAAmount, setBAmount }) => {
  return (
    <div className="deposit-inputs">
      <div className="input-group">
        <input
          type="number"
          placeholder="Enter Deposit Amount"
          onChange={(e) => setAAmount(Number(e.target.value))}
        />
        <div className="token-info">
          <span></span>
          <span>Balance: </span>
        </div>
      </div>
      <div className="input-group">
        <input
          type="number"
          onChange={(e) => setBAmount(Number(e.target.value))}
          placeholder="Enter Deposit Amount"
        />
        <div className="token-info">
          <span></span>
          <span>Balance: </span>
        </div>
      </div>
    </div>
  );
};

export default DepositInputs;
