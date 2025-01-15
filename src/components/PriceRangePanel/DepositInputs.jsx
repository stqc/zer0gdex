import React from "react";
import "./DepositInputs.css";
import InputComponent from "../InputComponent/InputComponent";
import { InputElement } from "../InputComponent/InputComponent";

const DepositInputs = ({setAAmount, setBAmount },props) => {
  return (
    <div className="deposit-inputs">
      <h3>Deposit Amounts</h3>
      <div className="input-group">
      <InputComponent>
                    <InputElement name={props.ethAmount} updateTokenAmount={setAAmount}/>
                    <div style={{background:"white", borderRadius:"50px", width:"50px", textAlign:"center",  cursor:"pointer"}}>
                        <span className="max-label" style={{color:"black", fontWeight:"500"}}>Max</span>
                    </div>
      </InputComponent>

      <InputComponent>
                    <InputElement name={props.usdtAmount} updateTokenAmount={setBAmount}/>
                    <div style={{background:"white", borderRadius:"50px", width:"50px", textAlign:"center",  cursor:"pointer"}}>
                        <span className="max-label" style={{color:"black", fontWeight:"500"}}>Max</span>
                    </div>
      </InputComponent>
      </div>
    </div>
  );
};

export default DepositInputs;
