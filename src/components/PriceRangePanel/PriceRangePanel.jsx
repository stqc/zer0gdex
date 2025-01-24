import React, { useCallback, useEffect, useState } from "react";
import RangeOptions from "./RangeOptions";
import SliderRange from "./SliderRange";
import DepositInputs from "./DepositInputs";
import CreatePositionButton from "./CreatePositionButton";
import "./PriceRangePanel.css";
import { useDispatch,useSelector } from "react-redux";
import { setTokenAamount,setTokenBamount,setLowerTick,setUpperTick } from "../../redux/liquidityTokenSelectorSlice";
import { getBestQuote } from "../../ContractInteractions/Swap";
import { ethers} from "ethers";
import { findListingToken } from "../../ContractInteractions/SearchToken";
import { getTokenBalance } from "../ContractInteractions/ERC20Methods";
import { provider } from "../ContractInteractions/constants";

const PriceRangePanel = () => {

  const dispatch = useDispatch();

  const tokenA = useSelector((state) => state.liquidityToken.tokenA);
  const tokenB = useSelector((state) => state.liquidityToken.tokenB);
  const spacing  = useSelector((state) => state.liquidityToken.spacing);


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

  const [nameToken1,setNameToken1] = useState();
  const [nameToken0,setNameToken0] = useState();
  const [rangeType, setRangeType] = useState("Full Range");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState(0);
  const [currentPrice,setCurrentPrice] = useState(0.0)
  const [tokenBalance0,setTokenBalance0] = useState(0);
  const [tokenBalance1,setTokenBalance1] = useState(0);
  const [currentPriceNumber,setCurrentPriceNumber] = useState(0);
  useEffect(()=>{
    
    (async()=>{

      const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase()
      ? [tokenA, tokenB]
      : [tokenB, tokenA];
      const price = await getBestQuote(token0,token1,1);

      const [token0name,] = await findListingToken(token0);
      const [token1name,] = await findListingToken(token1);

      setCurrentPrice(`${Number(ethers.formatEther(price.amountOut)).toFixed(2)} ${token0name}/${token1name}`);

      const Signer = await provider.getSigner()

      const bal0 = await getTokenBalance(token0,Signer.address)
      const bal1 = await getTokenBalance(token1,Signer.address)

      setTokenBalance0(ethers.formatEther(bal0));
      setTokenBalance1(ethers.formatEther(bal1));
      setNameToken1(token1name);
      setNameToken0(token0name);
      setCurrentPriceNumber(Number(ethers.formatEther(price.amountOut)));
    })();
  },[tokenA,tokenB])


  return (
    <div className="price-range-panel">
      <h3>Select Price Range</h3>
      <RangeOptions selectedType={rangeType} onChange={setRangeType} />

      <div className="current-price">
        <h3>Current price:</h3>
        <strong>{currentPrice}</strong>
      </div>

      <SliderRange
        token0={tokenA}
        token1={tokenB}
        setMinPrice={updateLowerTick}
        setMaxPrice={updateUpperTick}
      />

      <DepositInputs
        ethAmount={tokenA}
        usdtAmount={tokenB}
        setAAmount={updateTokenAamount}
        setBAmount={updateTokenBamount}
        name1={nameToken1}
        name0={nameToken0}
        bal0={tokenBalance0}
        bal1={tokenBalance1}
        price = {currentPriceNumber}
      />

      <CreatePositionButton />
    </div>
  );
};

export default PriceRangePanel;
