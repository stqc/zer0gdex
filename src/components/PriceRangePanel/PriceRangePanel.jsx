import React, { createRef, useCallback, useEffect, useState } from "react";
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
import InputComponent from "../InputComponent/InputComponent";

const PriceRangePanel = () => {

  const dispatch = useDispatch();

  const tokenA = useSelector((state) => state.liquidityToken.tokenA);
  const tokenB = useSelector((state) => state.liquidityToken.tokenB);
  const spacing  = useSelector((state) => state.liquidityToken.spacing);
  const fee = useSelector((state)=>state.liquidityToken.feeTier);

  const updateLowerTick = useCallback((tick) => {
    dispatch(setLowerTick(
      Math.floor((Math.log(tick)/Math.log(1.0001))/spacing)*spacing
    ));},[]);

  const updateUpperTick = useCallback((tick) => {
    
    dispatch(setUpperTick(
      Math.floor((Math.log(tick)/Math.log(1.0001))/spacing)*spacing
  ));},[]);

  const updateTokenAamount = useCallback((amount) => {
    console.log(currentPriceNumber);
    dispatch(setTokenAamount(amount));
  },[])

  const updateTokenBamount = useCallback((amount) => {
    dispatch(setTokenBamount(amount));
  },[]);

  const priceRef = createRef();
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
      console.log(price)
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
  },[tokenA,tokenB,fee])


  return (
    <div className="price-range-panel">
      <h3>Select Price Range</h3>
      <RangeOptions selectedType={rangeType} onChange={setRangeType} />

      {currentPriceNumber >0 &&<div className="current-price">
        <h3>Current price:</h3>
        <strong>{currentPrice}</strong>
      </div>}
      {currentPriceNumber<=0 && 
        <div style={{marginTop:"10px",display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <InputComponent >
            <input ref={priceRef} className='number-input' style={{fontSize:"1.2rem",width:"100%" ,fontWeight:"600" ,backgroundColor:"transparent", border:0, color:"black"}} type="number" placeholder="Enter Starting Price" onChange={(e)=>{
                          // setCurrentPriceNumber(e.currentTarget.value)        
            }}/>            
            <strong>{`${nameToken0}/${nameToken1}`}</strong>
          </InputComponent>        
          <button onClick={()=>{
            setCurrentPriceNumber(Number(priceRef.current.value))
            setCurrentPrice(`${Number(priceRef.current.value)} ${nameToken0}/${nameToken1}`)
          }}>Set Price</button>
        </div>
      }

      <SliderRange
        token0={tokenA}
        token1={tokenB}
        setMinPrice={updateLowerTick}
        setMaxPrice={updateUpperTick}
        token0Name={nameToken0}
        token1Name={nameToken1}
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

      <CreatePositionButton price={currentPriceNumber}/>
    </div>
  );
};

export default PriceRangePanel;
