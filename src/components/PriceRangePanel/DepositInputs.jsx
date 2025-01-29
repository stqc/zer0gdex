import React, { useEffect, useState } from "react";
import "./DepositInputs.css";
import InputComponent from "../InputComponent/InputComponent";
import { InputElement } from "../InputComponent/InputComponent";
import { ethers } from "ethers";
import { getBestQuote } from "../../ContractInteractions/Swap";
import { useSelector,useDispatch } from "react-redux";
import { getTokenBRequired, getTokenARequired, getPriceFromTick } from "../../ContractInteractions/LiquidityPositionsManagement";
import FactoryABI from "../../ContractInteractions/ABI/Factory.json";
import { provider } from "../ContractInteractions/constants";

const DepositInputs = ({token0,token1,setAAmount, setBAmount,name1,name0,bal0,bal1,price },props) => {
 
  const tokenA = useSelector((state) => state.liquidityToken.tokenA);
  const tokenB = useSelector((state) => state.liquidityToken.tokenB);
  const tokenAamount = useSelector((state)=>state.liquidityToken.tokenAamount);
  const tokenBamount = useSelector((state)=>state.liquidityToken.tokenBamount);
  const upperTick  = useSelector((state)=>state.liquidityToken.upperTick);
  const lowerTick = useSelector((state)=>state.liquidityToken.lowerTick);
  const feeTier = useSelector(state=>state.liquidityToken.feeTier)

  const [upperPrice,setUpperPrice] = useState(getPriceFromTick(Number(upperTick)));
  const [lowerPrice,setLowerPrice] = useState(getPriceFromTick(Number(lowerTick)));
  const [currentPrice,setCurrentPrice] = useState(0);
  const [Arequired,setARequired]=useState(0);
  const [Brequired,setBRequired]=useState(0)
  const [allowZero,UpdateAllowZero]=useState(false);

  useEffect(()=>{
    (async()=>{

      const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase()
          ? [tokenA, tokenB]
          : [tokenB, tokenA];
      const price = await getBestQuote(token0,token1,1);
      setCurrentPrice(price);    
    })();
    
  },[tokenAamount,tokenBamount])

  const getPool = async (token0,token1) => { 
    
    const contract  = new ethers.Contract("0xe1aAD0bac492F6F46BFE1992080949401e1E90aD", FactoryABI, provider);
    console.log(token0,token1,feeTier)
    const address = await contract.getPool(token0, token1, feeTier);
    
    return address;
  }

  useEffect(()=>{

    const pool=async()=>{
          const address= await getPool(tokenA,tokenB)
          console.log(address);
          address===ethers.ZeroAddress?UpdateAllowZero(true):UpdateAllowZero(false)
    };

    pool();

  },[tokenA,tokenB])


  return (
    
    <div className="deposit-inputs">
      <h3>Deposit Amounts</h3>
      <div className="input-group">
      <InputComponent>
                    <input className='number-input' value={Arequired} style={{fontSize:"1.4rem",width:"100%" ,fontWeight:"600" ,backgroundColor:"transparent", border:0, color:"black"}} placeholder={props.type?"Address":'0.00'} type={props.type?props.type:"number"} onChange={(e)=>{
                          setARequired(e.target.value)
                          setAAmount(Number(e.target.value))
                          setBRequired(getTokenBRequired(e.target.value,upperTick,lowerTick,price));
                          setBAmount(getTokenBRequired(e.target.value,upperTick,lowerTick,price));}
                       }/>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div style={{background:"transparent", borderRadius:"50px", width:"50px", textAlign:"center",  cursor:"pointer"}}>
                        <span className="max-label" style={{color:"black", fontWeight:"700"}}>{Number(bal0).toFixed(3)}</span>
                    </div>
                    <span style={{fontWeight:900}}>{name0}</span>
                    </div>
                    
      </InputComponent>

      <InputComponent>
      <input className='number-input' value={Brequired} style={{fontSize:"1.4rem",width:"100%" ,fontWeight:"600" ,backgroundColor:"transparent", border:0, color:"black"}} placeholder={props.type?"Address":'0.00'} type={props.type?props.type:"number"} onChange={(e)=>{
                      setBRequired(e.target.value)
                      setBAmount(Number(e.target.value))
                      setARequired(getTokenARequired(e.target.value,upperTick,lowerTick,price))
                      setAAmount(getTokenARequired(e.target.value,upperTick,lowerTick,price))}
                    }/>                    
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    <div style={{background:"transparent", borderRadius:"50px", width:"50px", textAlign:"center",  cursor:"pointer", color:"transparent"}}>
                        <span className="max-label" style={{color:"black", fontWeight:"700"}}>{Number(bal1).toFixed(3)}</span>
                    </div>
                    <span style={{fontWeight:900}}>{name1}</span>
                    </div>
      </InputComponent>
      </div>
    </div>
  );
};

export default DepositInputs;
