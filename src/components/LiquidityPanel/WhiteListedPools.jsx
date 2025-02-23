import React, { useEffect, useState } from 'react';
import './LiquidityPanel.css';
import WhiteList from "./popularPools.json";
import Tokens from "../../../tokens.json";
import { provider } from '../ContractInteractions/constants';
import { ethers } from 'ethers';


const POOL_ABI = [
    "function feeGrowthGlobal0X128() external view returns (uint256)",
    "function feeGrowthGlobal1X128() external view returns (uint256)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function liquidity() external view returns (uint128)"
];

const ERC20_ABI = [
    "function balanceOf(address) external view returns (uint256)",
    "function decimals() external view returns (uint8)",
    "function symbol() external view returns (string)"
];

const PoolRow = ({pool,createNewPool}) => {

    const calculatePoolFee= async ()=>{

        const poolContract = new ethers.Contract(pool.poolAddress, POOL_ABI, provider);
        const [fee0,fee1,liquidity]=await Promise.all([poolContract.feeGrowthGlobal0X128(),
                                                poolContract.feeGrowthGlobal1X128(),
                                                poolContract.liquidity()]);
        const totalFees0 = (fee0 * liquidity) >> 128n;
        const totalFees1 = (fee1 * liquidity) >> 128n;                                                

        const formattedFees0 = ethers.formatUnits(totalFees0, 18);
        const formattedFees1 = ethers.formatUnits(totalFees1, 18);

        console.log(formattedFees0,formattedFees1)


        return {formattedFees0,formattedFees1}
    }

    const getPoolTVL = async ()=>{
        const token0 = new ethers.Contract(pool.token0,ERC20_ABI,provider);
        const token1 = new ethers.Contract(pool.token1,ERC20_ABI,provider);

        const bal0 = await token0.balanceOf(pool.poolAddress);
        const bal1 = await token1.balanceOf(pool.poolAddress)

        const formattedBal0 = ethers.formatEther(bal0);
        const formattedBal1 = ethers.formatEther(bal1);

        return {formattedBal0,formattedBal1};
    }

    const [fee0,setFee0] = useState("-");
    const [fee1,setFee1] = useState("-");

    const [tvl0,setTVL0] = useState("-");
    const [tvl1,setTVL1] = useState("-");

    useEffect(()=>{

        (async ()=>{
            const fee = await calculatePoolFee();
            console.log(fee)
            setFee0(Number(fee.formattedFees0).toFixed(3));
            setFee1(Number(fee.formattedFees1).toFixed(3));

            const tvl = await getPoolTVL();
            setTVL0(Number(tvl.formattedBal0).toFixed(3));
            setTVL1(Number(tvl.formattedBal1).toFixed(3));

        })();


    },[])



return(
  <div className="pool-row">
    <div className="pair-info">
      <div className="token-icons">
        <img src={Tokens[pool.token1Name].logo} alt="Token 1" className="token-icon" />
        <img src={Tokens[pool.token0Name].logo} alt="Token 0" className="token-icon" />
      </div>
      <div className="pair-details">
        <span className="pair-name">{pool.token1Name}/{pool.token0Name}</span>
        <span className="pair-type">Fee: {pool.fee}</span>
      </div>
    </div>

    {/* <div className="apr-badge">
      {}
    </div> */}

    <div className="stats-cell">
      <span className="stats-main">TVL</span>
      <span className="stats-sub">{tvl1} {pool.token1Name}</span>
      <span className="stats-sub">{tvl0} {pool.token0Name}</span>
    </div>

    <div className="stats-cell">
      <span className="stats-main">Volume 24h</span>
      <span className="stats-sub">- {pool.token1Name}</span>
      <span className="stats-sub">- {pool.token0Name}</span>
    </div>

    <div className="stats-cell">
      <span className="stats-main">Total Fees</span>
      <span className="stats-sub">{fee1} {pool.token1Name}</span>
      <span className="stats-sub">{fee0} {pool.token0Name}</span>
    </div>

    <button className="deposit-button" onClick={()=>{createNewPool(false)}}>
      Deposit
    </button>
  </div>
)};

const LiquidityPool = (props) => {
  
  return (
    <div className="liquidity-pool">
      <div className="pool-header">
        <h1 className="pool-title">Liquidity Pool</h1>
        <button className="create-position-btn" onClick={()=>{
            props.createNewPool(false);
        }}>Create Position</button>
      </div>

      {WhiteList.map((pool, index) => (
        <PoolRow key={index} pool={pool} createNewPool={props.createNewPool} />
      ))}
    </div>
  );
};

export default LiquidityPool;