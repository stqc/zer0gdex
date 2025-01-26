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

const SwapComponent = () => {
  const [tokenA, setTokenA] = useState("Token");
  const [tokenB, setTokenB] = useState("Token"); 
  const [amountA, setAmountA] = useState();
  const [amountB, setAmountB] = useState();
  const [slippage, setSlippage] = useState(); // Example slippage
  const [priceImpact, setPriceImpact] = useState(); // Example price impact
  const [price, setPrice] = useState();
  const [tokenAaddress,setTokenAAddress] = useState('');
  const [tokenBaddress,setTokenBAddress] = useState('');
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

export const TokenSelector = ({ token, setToken,updateToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokens,updateTokenList] = useState([
    { name: "A0GI", address: "0x493ea9950586033ea8894b5e684bb4df6979a0d3", decimals:18 },
    {name:"TT", address:'0x11fbB48Ba5b8403c9080a1C3d09AF3f91Ef74c60',decimals:18},
    {name:"Shib",address:'0xA0FFd008375Cf9a44BEae228794BF39283b43E66',decimals:18},
    {name:'MIKE',address:"0xa406Ad44348Bb07980973F6cf707E807201e8291",decimals:18},
    {name:'CHASE',address:"0xb94f411101e7E544C5f89329fBD32A272859fab4",decimals:18},
    {name:"WADE",address:"0xC58A321042268811cb93a6A4F3d6DE4cC1B0A83B",decimals:18},
    {name:'JD',address:"0xEFaaDea9110723Aca5793FD9C45190E1F5e5b45B",decimals:18}
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
        style={{display:"flex",wordWrap:"break-word", gap:"10px", cursor:"default", width:"100px",fontWeight:"700" ,justifyContent:"space-between"}}
      >
        
        <div style={{height:"30px", width:"30px"}}>
          <img src={ZeroLogo} height={"100%"} width={"100%"}/>
        </div>
        <div >{token}</div>
        <div style={{height:"10px",width:"10px"}}>
          <img src={DropDownLogo} height={"100%"} width={"100%"}/>
        </div>
        </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Select a Token</h3>
            <input
              type="text"
              placeholder="Enter token address..."
              className="token-search"
              onChange={(e) =>{
                
                if(e.target.value.length>=42){
                    findToken(e.target.value);
                }

              }}
            />
            <div className="token-list">
              {tokens.map((tokenItem, index) => (
                <div
                  key={index}
                  className="token-list-item"
                  onClick={() => handleTokenSelect(tokenItem)}
                >
                  {tokenItem.name} ({tokenItem.address.slice(0, 6)}...)
                </div>
              ))}
            </div>
            <button
              className="close-modal"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
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
