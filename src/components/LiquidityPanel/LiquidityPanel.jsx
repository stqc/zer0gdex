import React, { useCallback, useState } from "react";
import SelectPair from "../selectPair/SelectPair";
import FeeTierSelector from "../feeTier/FeeTierSelector";
import "./LiquidityPanel.css";
import PriceRangePanel from "../PriceRangePanel/PriceRangePanel";
import { useDispatch,useSelector } from "react-redux";
import { setFeeTier,setSpacing } from "../../redux/liquidityTokenSelectorSlice";


function LiquidityPanel() {
  
const dispatch = useDispatch();
const selectedFeeTier = useSelector((state) => state.liquidityToken.feeTier);

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
    <div className="liquidity-panel">
        <div className="liquidity-panel-select-fee">
            <h3>Select Pair</h3>
            <SelectPair/>
            <h3>Select Fee Tier</h3>
            <FeeTierSelector selectedTier={selectedFeeTier} onChange={handleFeeTierChange} />
        </div>
        <PriceRangePanel/>
    </div>
  );
}

export default LiquidityPanel;
