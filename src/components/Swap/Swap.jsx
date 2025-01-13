import React, { useState } from "react";
import "./Swap.css";
import { useDispatch } from "react-redux";
import { setoken0,setoken1 } from "../../redux/SwapSlice";
import { findListingToken } from "../../ContractInteractions/SearchToken";
import { executeSwap, getBestQuote } from "../../ContractInteractions/Swap";
import { useSelector } from "react-redux";

const SwapComponent = () => {
  const [tokenA, setTokenA] = useState("Select Token");
  const [tokenB, setTokenB] = useState("Select Token"); 
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [price, setPrice] = useState(); // Example price
  const [slippage, setSlippage] = useState(); // Example slippage
  const [priceImpact, setPriceImpact] = useState(); // Example price impact

  const tokenIn = useSelector((state) => state.swapReducer.token0);
  const tokenOut = useSelector((state) => state.swapReducer.token1);

  const handleSwap = async () => {
    
    console.log("Swap Executed!");
    console.log(tokenIn, tokenOut);
    const bestQuote =await getBestQuote(tokenIn.address,tokenOut.address);
    executeSwap(tokenIn.address,tokenOut.address,amountA,bestQuote.feeTier);
};

  return (
    <div className="swap-container">
      <h3 className="swap-title">Swap</h3>
      {/* Input for Token A */}
      <SwapInput
        token={tokenA}
        setToken={setTokenA}
        amount={amountA}
        setAmount={setAmountA}
        label="MAX"
        isToken0={true}
      />

      {/* Price Information */}
      <div className="price-info">
        <p>1 {tokenA} = {price} {tokenB}</p>
      </div>

      {/* Input for Token B */}
      <SwapInput
        token={tokenB}
        setToken={setTokenB}
        amount={amountB}
        setAmount={setAmountB}
        label="MAX"
        isToken0={false}
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

const SwapInput = ({ token, setToken, amount, setAmount, label, isToken0 }) => {
  return (
    <div className="swap-input">
      <input
        type="number"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.0"
        className="amount-input"
      />
      <div className="token-selector">
        <TokenSelector token={token} setToken={setToken} updateToken={isToken0?setoken0:setoken1} />
        <span className="max-label">{label}</span>
      </div>
    </div>
  );
};

const TokenSelector = ({ token, setToken,updateToken }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const [tokens,updateTokenList] = useState([
    { name: "A0GI", address: "0x493ea9950586033ea8894b5e684bb4df6979a0d3", decimals:18 },
 ]);

  const setCurrentToken = (token) => {
    dispatch(updateToken(token));
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
        style={{display:"flex",wordWrap:"break-word", alignItems:"center"}}
      >
        <div>▼</div>
        <div>{token}</div>
         
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

const SwapDetails = ({ minReceived, slippage, priceImpact }) => {
  return (
    <div className="swap-details">
      <p>Minimum Received: {minReceived}</p>
      <p>Slippage: {slippage}%</p>
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
