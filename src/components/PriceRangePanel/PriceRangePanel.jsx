import React, { useCallback, useState } from "react";
import RangeOptions from "./RangeOptions";
import SliderRange from "./SliderRange";
import DepositInputs from "./DepositInputs";
import CreatePositionButton from "./CreatePositionButton";
import "./PriceRangePanel.css";
import { useDispatch,useSelector } from "react-redux";
import { setTokenAamount,setTokenBamount,setLowerTick,setUpperTick } from "../../redux/liquidityTokenSelectorSlice";

const PriceRangePanel = () => {

  const dispatch = useDispatch();

  const tokenA = useSelector((state) => state.liquidityToken.tokenA);
  const tokenB = useSelector((state) => state.liquidityToken.tokenB);
  const spacing  = useSelector((state) => state.liquidityToken.spacing);

  console.log(tokenA)

  const updateLowerTick = useCallback((tick) => {
    dispatch(setLowerTick(
      Math.floor((Math.log(tick)/Math.log(1.0001))/spacing)*spacing
    ));},[]);

  const updateUpperTick = useCallback((tick) => {
    
    dispatch(setUpperTick(
      Math.floor((Math.log(tick)/Math.log(1.0001))/spacing)*spacing
  ));},[]);

  const updateTokenAamount = useCallback((amount) => {
    dispatch(setTokenAamount(amount));
  },[])

  const updateTokenBamount = useCallback((amount) => {
    dispatch(setTokenBamount(amount));
  },[]);

  const [rangeType, setRangeType] = useState("Full Range");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState(0);


  return (
    <div className="price-range-panel">
      <h3>Select Price Range</h3>
      <RangeOptions selectedType={rangeType} onChange={setRangeType} />

      <div className="current-price">
        <h3>Current price:</h3>
        <strong></strong>
      </div>

      <SliderRange
        
        setMinPrice={updateLowerTick}
        setMaxPrice={updateUpperTick}
      />

      <DepositInputs
        ethAmount={tokenA}
        usdtAmount={tokenB}
        setAAmount={updateTokenAamount}
        setBAmount={updateTokenBamount}
      />

      <CreatePositionButton updateTickLower={updateLowerTick} updateTickUpper={updateUpperTick}/>
    </div>
  );
};

export default PriceRangePanel;
