import React from "react";
import "./SelectPair.css";
import TokenSelect from "../TokenSelect/TokenSelect";
import { setTokenA,setTokenB } from "../../redux/liquidityTokenSelectorSlice";

function SelectPair() {

  return (
    <div className="select-pair">
      <TokenSelect  changeCurrentToken={setTokenA}/>

      {/* <div className="swap-icon">⇄</div> */}

     <TokenSelect changeCurrentToken = {setTokenB}/>
    </div>
  );
}

export default SelectPair;
