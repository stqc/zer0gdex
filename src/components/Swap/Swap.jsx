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
    {name:"USD", address:'0x0D4eb9d047E57b6DB64CB9FE53945F197035D17d',decimals:18},
    {name:"BTC",address:'0x3559ABeAA66773E9995cdD0ecBa6a36EfAcD1334',decimals:18},
    {name:'ETH',address:"0xEc587B7D14236C9185d2f5974c268Df72F594353",decimals:18},
    {name:'BNB',address:"0xd7bA8228891392Ed59D93788815E226FD138425C",decimals:18},
    {name:"SOL",address:"0xd00475355398782923354fcA062BC958e04CFA87",decimals:18},
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
