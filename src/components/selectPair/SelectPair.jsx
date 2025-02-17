import React from "react";
import "./SelectPair.css";
import TokenSelect from "../TokenSelect/TokenSelect";
import { setTokenA, setTokenB } from "../../redux/liquidityTokenSelectorSlice";
import { ArrowLeftRight, ChevronDown } from 'lucide-react';

function SelectPair() {
  return (
    <div className="select-pair">
      <TokenSelect 
        changeCurrentToken={setTokenA}
        // icon={<img src="/path-to-zero-icon.png" alt="ZERO" className="token-icon" />}
        // label="ZERO"
      />
      
      <div className="swap-button-">
        <ArrowLeftRight size={24} className="swap-icon" />
      </div>

      <TokenSelect 
        changeCurrentToken={setTokenB}
        // icon={<img src="/path-to-zero-icon.png" alt="ZERO" className="token-icon" />}
        // label="ZERO"
      />
    </div>
  );
}

export default SelectPair;