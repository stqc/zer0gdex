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
import PriceRangeSlider from "../PriceRangeSlider/PriceRangeSlider";

const PriceRangePanel = () => {

  const dispatch = useDispatch();

  const tokenA = useSelector((state) => state.liquidityToken.tokenA);
  const tokenB = useSelector((state) => state.liquidityToken.tokenB);
  const spacing  = useSelector((state) => state.liquidityToken.spacing);
  const fee = useSelector((state)=>state.liquidityToken.feeTier);

  const updateLowerTick = useCallback((tick) => {
    dispatch(setLowerTick(tick));
  },[]);

  const updateUpperTick = useCallback((tick) => {
    dispatch(setUpperTick(tick));
    },[]);

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
  const [token0,setToken0] = useState();
  const [token1,setToken1] = useState();

  useEffect(()=>{
    
    (async()=>{

      // const token0Checksum = ethers.getAddress(tokenA);
      // const token1Checksum = ethers.getAddress(tokenB);
      // const token0Int = BigInt(token0Checksum);
      // const token1Int = BigInt(token1Checksum);
      // const [token0, token1] = token0Int < token1Int 
      //   ? [token0Checksum, token1Checksum] 
      //   : [token1Checksum, token0Checksum];

      // setToken0(token0);
      // setToken1(token1);

      const price = await getBestQuote(tokenB,tokenA,1);
      console.log(price)
      const [token0name,] = await findListingToken(tokenA);
      const [token1name,] = await findListingToken(tokenB);

      setCurrentPrice(`${Number(ethers.formatEther(price.amountOut)).toFixed(9)} ${token0name}/${token1name}`);

      const Signer = await provider.getSigner()

      const bal0 = await getTokenBalance(tokenA,Signer.address)
      const bal1 = await getTokenBalance(tokenB,Signer.address)

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
            {nameToken0 && nameToken1 && <strong>{`${nameToken0}/${nameToken1}`}</strong>}
          </InputComponent>        
          <button onClick={()=>{
            setCurrentPriceNumber(Number(priceRef.current.value))
            setCurrentPrice(`${Number(priceRef.current.value)} ${nameToken0}/${nameToken1}`)
          }}>Set Price</button>
        </div>
      }
      {currentPriceNumber>0 &&<PriceRangeSlider updateTokenA ={updateLowerTick} updateTokenB={updateUpperTick} price={currentPriceNumber}/>}

      <SliderRange
        token0={tokenA}
        token1={tokenB}
        setMinPrice={updateLowerTick}
        setMaxPrice={updateUpperTick}
        token0Name={nameToken0}
        token1Name={nameToken1}
      />

      <DepositInputs
        token0={token0}
        token1={token1}
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
