import React, { useCallback, useEffect, useState } from "react";
import SelectPair from "../selectPair/SelectPair";
import FeeTierSelector from "../feeTier/FeeTierSelector";
import "./LiquidityPanel.css";
import PriceRangePanel from "../PriceRangePanel/PriceRangePanel";
import { useDispatch,useSelector } from "react-redux";
import { setFeeTier,setSpacing,setTokenA,setTokenB } from "../../redux/liquidityTokenSelectorSlice";
import WhiteListedPools from "./WhiteListedPools";
import BackIcon from "../../Assets/backIcon.svg";

function LiquidityPanel() {
  
const dispatch = useDispatch();
const selectedFeeTier = useSelector((state) => state.liquidityToken.feeTier);
const [ShowNewPools, setShowNewPools] = useState(true);

useEffect(()=>{

  return ()=>{
  dispatch(setTokenA(""))
  dispatch(setTokenB(""))}
},[])

const tierToSpacing = {
    500: 10,
    3000: 60,
    10000: 200,
  };

const handleFeeTierChange = useCallback((tier) => {
    dispatch(setFeeTier(tier));
    dispatch(setSpacing(tierToSpacing[tier]));
  },[]);


  return (
    <>
    {ShowNewPools && <WhiteListedPools createNewPool={setShowNewPools}/>}
    {!ShowNewPools && <>

        <div style={{display:"flex", alignItems:"center", gap:"10px", background:"white", marginLeft:"9%",borderRadius:"50px", maxWidth:"150px", padding:"2px 10px", maxHeight:"40px", cursor:"pointer"}}
                        onClick={()=>{
                            setShowNewPools(true);
                        }}
                    >
                      <div style={{height:"20px", width:"20px"}}>
                                <img src={BackIcon} height={"100%"} width={"100%"}/>
                      </div>
                      <h4>All Pools</h4>
                    </div>

      <div className="liquidity-panel">
        <div className="liquidity-panel-select-fee">
            <h3>Select Pair</h3>
            <SelectPair/>
            <h3>Select Fee Tier</h3>
            <FeeTierSelector selectedTier={selectedFeeTier} onChange={handleFeeTierChange} />
        </div>
        <PriceRangePanel/>
    </div>
    </>}
    </>
  );
}

export default LiquidityPanel;
