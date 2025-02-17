import React, { useEffect, useState } from "react";
import "./Swap.css";
import { findListingToken, getBalanceOfUser } from "../../ContractInteractions/SearchToken";
import { executeSwap, getBestQuote } from "../../ContractInteractions/Swap";
import { useSelector } from "react-redux";
import InputComponent, { InputElement } from "../InputComponent/InputComponent";
import ZeroLogo from "../../Assets/zer0.svg";
import DropDownLogo from "../../Assets/dropdown.svg";
import { ethers } from "ethers";
import SlippageControl  from "../../Assets/slippage.svg";
import tokenJson from "../../../tokens.json";
import { Search } from 'lucide-react';
import { X } from "lucide-react";

const SwapComponent = () => {
  const [tokenA, setTokenA] = useState("USDT");
  const [tokenB, setTokenB] = useState("BTC"); 
  const [amountA, setAmountA] = useState();
  const [amountB, setAmountB] = useState();
  const [slippage, setSlippage] = useState(); // Example slippage
  const [priceImpact, setPriceImpact] = useState(); // Example price impact
  const [price, setPrice] = useState();
  const [tokenAaddress,setTokenAAddress] = useState('0x9A87C2412d500343c073E5Ae5394E3bE3874F76b');
  const [tokenBaddress,setTokenBAddress] = useState('0x1e0d871472973c562650e991ed8006549f8cbefc');
  const [tokenBalanceA,setTokenBalanceA] = useState(0)
  const [tokenBalanceB,setTokenBalanceB] = useState(0)

  const tokenIn = useSelector((state) => state.swapReducer.token0);
  const tokenOut = useSelector((state) => state.swapReducer.token1);

  const handleSwap = async () => {
    
    console.log("Swap Executed!");
    console.log(tokenIn, tokenOut);
    const bestQuote =await getBestQuote(tokenAaddress,tokenBaddress,amountA);
    await executeSwap(tokenAaddress,tokenBaddress,amountA,bestQuote.feeTier);
};

useEffect(()=>{

  (async()=>{
    const tokenA = await getBalanceOfUser(tokenAaddress)
    console.log(tokenA)
    setTokenBalanceA(tokenA);
  })();


},[tokenAaddress,tokenBaddress])

useEffect(()=>{
(async ()=>{
  !amountA?setAmountA(0):<></>;
  const quote =await getBestQuote(tokenAaddress,tokenBaddress,amountA)
  const outputAmount = ethers.formatEther(quote.amountOut)
  setAmountB(outputAmount);

  const expected = Number(price)*amountA
  const priceImpact = expected-Number(outputAmount);
  setPriceImpact(priceImpact>0?(priceImpact*100/expected).toFixed(2):(0.01).toFixed(2));

})();
},[amountA,tokenAaddress,tokenBaddress])


useEffect(()=>{
  (async ()=>{
    const quote =await getBestQuote(tokenAaddress,tokenBaddress,1)
    const outputAmount = ethers.formatEther(quote.amountOut)
    setPrice(outputAmount);

  })();
  },[tokenAaddress,tokenBaddress])



  return (
    <div className="swap-container">
      <div style={{display:"flex", marginBottom:"25px",justifyContent:"space-between"}}>
        <h4 className="swap-title">Swap</h4>
        
        <div style={{height:"40px", width:"40px", cursor:"pointer"}} role="button">
          <img src={SlippageControl} height={"100%"} width={"100%"}/>
        </div>

      </div>
      {/* Input for Token A */}
      <SwapInput
        token={tokenA}
        setToken={setTokenA}
        amount={amountA}
        setAmount={setAmountA}
        label="MAX"
        isToken0={true}
        setTokenAddress={setTokenAAddress}
        tokenABal ={tokenBalanceA}
      />

      <div className="price-info">
        <p>1 {tokenA} = {price} {tokenB}</p>
      </div>

      {/* Input for Token B */}
      <SwapInput
        token={tokenB}
        setToken={setTokenB}
        amount={amountB}
        setAmount={setAmountB}
        label=""
        isToken0={false}
        setTokenAddress={setTokenBAddress}
      />

      {/* Swap Details */}
      <SwapDetails
        minReceived={amountB}
        slippage={slippage}
        priceImpact={priceImpact}
      />

      {/* Swap Button */}
      <SwapButton onClick={handleSwap} />
    </div>
  );
};

const SwapInput = ({ token, setToken, amount, setAmount, label, setTokenAddress,tokenABal }) => {
  return (
    <InputComponent>
      <div style={{display:"flex"}}>
      <InputElement updateTokenAmount={setAmount} value={amount}/>
      <div className="token-selector">
        <TokenSelector token={token} setToken={setToken} updateToken={setTokenAddress} />        
      </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between", cursor:"pointer"}}>
        <span className="max-label" onClick={()=>{
          setAmount(tokenABal)
        }}>{label}</span>
        {tokenABal && <span>{Number(tokenABal).toFixed(3)}</span>}
      </div>
    </InputComponent>
  );
};

export const TokenSelector = ({ token, setToken,updateToken, width }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens,updateTokenList] = useState([
    {name:"USDT", address:'0x9A87C2412d500343c073E5Ae5394E3bE3874F76b',decimals:18},
    {name:"BTC",address:'0x1e0d871472973c562650e991ed8006549f8cbefc',decimals:18},
    {name:'ETH',address:"0xce830D0905e0f7A9b300401729761579c5FB6bd6",decimals:18},
 ]);

  const setCurrentToken = (token) => {
    updateToken(token.address);
  }

  const findToken = async (address) => {
        const [name,decimal] =await findListingToken(address);
        updateTokenList([...tokens,{name:name,address:address,decimals:decimal}]);
  }

  const handleTokenSelect = (selectedToken) => {
    setCurrentToken(selectedToken);
    setToken(selectedToken.name);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="token-dropdown"
        onClick={() => setIsModalOpen(true)}
        style={{display:"flex",wordWrap:"break-word", gap:"10px", cursor:"default", width:width?width:"100px",fontWeight:"700" ,justifyContent:"space-between"}}
      >
        
        <div style={{height:"30px", width:"30px"}}>
          <img src={tokenJson[token]?tokenJson[token]?.logo:ZeroLogo} height={"100%"} width={"100%"}/>
        </div>
        <div style={{marginRight:"auto"}} >{token}</div>
        <div style={{height:"10px",width:"10px"}}>
          <img src={DropDownLogo} height={"100%"} width={"100%"}/>
        </div>
        </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title">Select Token</h1>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>
              <X size={24} strokeWidth={3} />
            </button>
          </div>
            <div className="search-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or paste address"
                className="token-search"
                onChange={(e) => {
                  if (e.target.value.length >= 42) {
                    findToken(e.target.value);
                  }
                }}
              />
            </div>
            <div className="token-list">
              {tokens.map((tokenItem, index) => (
                <div
                  key={index}
                  className="token-list-item"
                  onClick={() => handleTokenSelect(tokenItem)}
                >
                  <div style={{height:"30px", width:"30px"}}>
                    <img src={tokenJson[tokenItem.name]?tokenJson[tokenItem.name]?.logo:ZeroLogo} height={"100%"} width={"100%"}/>
                  </div>
                  <div style={{display:"flex", flexDirection:"column"}}>
                    <div style={{fontWeight:"700"}}>{tokenItem.name}</div> 
                    <div style={{fontSize:"0.7rem"}}>({tokenItem.address.slice(0, 6)}...)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SwapDetails = ({ minReceived, priceImpact }) => {
  return (
    <div className="swap-details">
      <p>Minimum Received: {minReceived}</p>
      <p>Price Impact: {priceImpact}%</p>
    </div>
  );
};

const SwapButton = ({ onClick }) => {
  return (
    <button className="swap-button" onClick={onClick}>
      Swap
    </button>
  );
};

export default SwapComponent;
