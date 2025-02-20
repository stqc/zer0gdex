import {ethers} from 'ethers';
import { provider, WETH} from '../components/ContractInteractions/constants';
import { NFTPositionManagerAddress } from '../components/ContractInteractions/constants';
import NFTPositionManagerABI from "../ContractInteractions/ABI/NFTPositionManager.json";
import { findListingToken } from './SearchToken';
import { getTokenBalance, hasEnoughApproval,requestApproval } from '../components/ContractInteractions/ERC20Methods';
import FactoryABI from "../ContractInteractions/ABI/Factory.json";
import ERC20abi from "../components/ContractInteractions/ERC20abi.json";
import PoolABI from "../ContractInteractions/ABI/v3pool.json";
import { ManageState } from '../components/ManagePositons/Manage';

const getPool = async (token0,token1,feeTier) => { 
    
    const contract  = new ethers.Contract("0xe1aAD0bac492F6F46BFE1992080949401e1E90aD", FactoryABI, provider);
    const address = await contract.getPool(token0, token1, feeTier);
    
    return address;
  }


function calculateAmount0(liquidity, sqrtPriceLower, sqrtPriceUpper, sqrtPriceCurrent) {
    if (sqrtPriceCurrent <= sqrtPriceLower) {
      // Current price is below range
      return (liquidity * (sqrtPriceUpper - sqrtPriceLower)) / sqrtPriceUpper;
    } else if (sqrtPriceCurrent < sqrtPriceUpper) {
      // Current price is within range
      return (liquidity * (sqrtPriceUpper - sqrtPriceCurrent)) / sqrtPriceUpper;
    } else {
      // Current price is above range
      return 0;
    }
  }
  
export function tickToPrice(tick) {
    // Each tick represents a 0.01% (1.0001) price change
    const price = Math.pow(1.0001, tick);
    // Convert to fixed point number (96 decimals)
    return price;
  }

function calculateAmount1(liquidity, sqrtPriceLower, sqrtPriceUpper, sqrtPriceCurrent) {
    if (sqrtPriceCurrent <= sqrtPriceLower) {
      // Current price is below range
      return 0n;
    } else if (sqrtPriceCurrent < sqrtPriceUpper) {
      // Current price is within range
      return liquidity * (sqrtPriceCurrent - sqrtPriceLower);
    } else {
      // Current price is above range
      return liquidity * (sqrtPriceUpper - sqrtPriceLower);
    }
  }


export const getLiqudityPairOfUser = async ()=>{
    
    const Signer = await provider.getSigner();
    const NFTpositionManagerContract = new ethers.Contract(NFTPositionManagerAddress, NFTPositionManagerABI, provider);
    const balanceOfUser = await NFTpositionManagerContract.balanceOf(Signer.address);
    
    console.log(balanceOfUser,"postions of user",Signer.address);

    let userPositions = [];
    for(let i=0;i<balanceOfUser;i++){
        
        const tokenId = await NFTpositionManagerContract.tokenOfOwnerByIndex(Signer.address,i);
        
        const position = await NFTpositionManagerContract.positions(tokenId);
        
        const poolAddress = await getPool(position.token0,position.token1,position.fee);
        
        const poolContract = new ethers.Contract(poolAddress,PoolABI,provider);
        
        const slot0 = await poolContract.slot0();

        const balanceOfToken0 = await calculateAmount0(position.liquidity,position.tickLower,position.tickUpper,slot0.tick)
        
        const balanceOfToken1 = await calculateAmount1(position.liquidity,position.tickLower,position.tickUpper,slot0.tick)

          
        // console.log(i);

        userPositions.push({
                tokenId: tokenId.toString(),
                token0:await findListingToken(position.token0),
                token1: await findListingToken(position.token1),
                fee:  ethers.toNumber(position.fee)/10000,
                tickLower: ethers.toNumber(position.tickLower),
                tickUpper: ethers.toNumber(position.tickUpper),
                liquidityToken0 : balanceOfToken0,
                liquidityToken1 : balanceOfToken1,
                tokensOwed0: ethers.formatUnits(position.tokensOwed0, 18), // Assuming token0 has 18 decimals
                tokensOwed1: ethers.formatUnits(position.tokensOwed1, 18),
                tokenAdd0:position.token0,
                tokenAdd1:position.token1,
                liquidity:position.liquidity,
                currentTick:slot0.tick
        });

        // if(ManageState?.positions?.action){
        // ManageState.positions.action(userPositions);}
        
    }

    return userPositions;
}

export const addLiquidity = async (tokenId, token0Amount, token1Amount,token0,token1)=>{

    const Signer = await provider.getSigner();
    
    const NFTpositionManagerContract = new ethers.Contract(NFTPositionManagerAddress,NFTPositionManagerABI,provider);

    token0Amount = ethers.parseEther(token0Amount.toString());
    token1Amount = ethers.parseEther(token1Amount.toString());
    
    let value = null;

    if(token0.toLowerCase()===WETH.toLowerCase()){
        console.log("0 wins")
        value = token0Amount;
      }
    else{
        const contract = new ethers.Contract(token0,ERC20abi,provider);
        const EnoughApproval =await hasEnoughApproval(contract,Signer.address,NFTPositionManagerAddress,token0Amount);
        console.log(EnoughApproval,token0);
        if(!EnoughApproval){
           await requestApproval(contract,Signer,NFTPositionManagerAddress,ethers.parseUnits(token0Amount.toString(),50));
        }
    }
    if(token1.toLowerCase()===WETH.toLowerCase()){
        console.log("1 wins")
        value =token1Amount;
      }
    else{
        
        const contract = new ethers.Contract(token1,ERC20abi,provider);
        const EnoughApproval =await hasEnoughApproval(contract,Signer.address,NFTPositionManagerAddress,token1Amount);
        console.log(EnoughApproval,token1);
        if(!EnoughApproval){
            await requestApproval(contract,Signer,NFTPositionManagerAddress,ethers.parseUnits(token1Amount.toString(),50));
        }
    }

    const params = {
        tokenId: tokenId, 
        amount0Desired: token0Amount, 
        amount1Desired: token1Amount, 
        amount0Min: 0, 
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10 
      }; 
      try{
      const tx = await NFTpositionManagerContract.connect(Signer).increaseLiquidity(params,{value:value})
      const recipt = await tx.wait();
      alert(recipt.hash);}
      catch(e){
        alert(e.message);
      }
}

export const removeLiquidity = async (tokenId,percentage,liquidity)=>{

    console.log(liquidity);
    const Signer = await provider.getSigner();

    const NFTpositionManagerContract = new ethers.Contract(NFTPositionManagerAddress,NFTPositionManagerABI,Signer);

    const LiquidityToRemove = (liquidity*percentage/100).toFixed(18);

    console.log(LiquidityToRemove);

    const decreaseParams = {
        tokenId:tokenId,
        liquidity:ethers.parseEther(LiquidityToRemove.toString()),
        amount0Min:0,
        amount1Min:0,
        deadline: Math.floor( Date.now()/1000)+ 60 * 10

    }

    

    const collectParams={
        tokenId: tokenId,
        recipient: Signer.address,
        amount0Max: BigInt(Math.pow(2,64)),
        amount1Max: BigInt(Math.pow(2,64))
    }

    const multicall = [
        NFTpositionManagerContract.interface.encodeFunctionData('decreaseLiquidity', [decreaseParams]),
        NFTpositionManagerContract.interface.encodeFunctionData('collect', [collectParams])
    ]

    try{
    const tx = await NFTpositionManagerContract.multicall(multicall)

   
    const reciept = await tx.wait();
    alert("removed: "+reciept.hash);}
    catch(e){
        alert(e.message)
    }
}



export const getPriceFromTick = (tick)=>{

    return Math.pow(1.0001,tick)
}

const priceToSqrtX96 = (price) => BigInt(Math.floor(price * 2 ** 96));


export const getTokenARequired=(tokenAamt,upperPrice,lowerPrice,currentPrice)=>{
 
    
    // const sqrtCurrentPrice = Math.sqrt(currentPrice);
    // const sqrtUpperPrice = Math.sqrt(upperPrice);
    // const sqrtLowerPrice = Math.sqrt(lowerPrice);
  
    // const liquidity = (tokenAamt * sqrtCurrentPrice * sqrtUpperPrice) / (sqrtUpperPrice - sqrtCurrentPrice);

    // const amountB = liquidity * (sqrtCurrentPrice - sqrtLowerPrice);

    // if(currentPrice>upperPrice){
    //     alert("Price above the specified range, 0 tokenB will be added")
    //     return 0
    // }

    // return currentPrice>lowerPrice?tokenAamt/currentPrice:0;

    // console.log(upperPrice,lowerPrice,currentPrice,liquidity,amountB);
    // return amountB>0?amountB:0;
    console.log(lowerPrice,currentPrice)
    //  if (currentPrice < lowerPrice) {
    //     alert("Price below the specified range, 0 tokenA will be added");
    //     return 0;
    // }
    if (currentPrice > upperPrice) {
      alert("Price above the specified range, 0 tokenB will be added");
      return 0;
  }
    return currentPrice > lowerPrice ? tokenAamt*currentPrice : 0;
}

export const getTokenBRequired = (tokenBamt,upperPrice,lowerPrice,currentPrice)=>{

    // upperPrice = tickToPrice(upperPrice)
    // lowerPrice = tickToPrice(lowerPrice)
    // const sqrtCurrentPrice = Math.sqrt(currentPrice);
    // const sqrtUpperPrice = Math.sqrt(upperPrice);
    // const sqrtLowerPrice = Math.sqrt(lowerPrice);
    
    // const liquidity = tokenBamt / (sqrtCurrentPrice - sqrtLowerPrice);

    // const amountA = liquidity * (sqrtUpperPrice - sqrtCurrentPrice) / (sqrtCurrentPrice * sqrtUpperPrice);

    // if(currentPrice<lowerPrice){
    //     alert("Price below the specified range, 0 tokenB will be added")
    //     return 0;
    // }

    // return currentPrice<upperPrice?tokenBamt*currentPrice:0

    // console.log(upperPrice,lowerPrice,currentPrice,liquidity,amountA);
    // return amountA>0?amountA:0;
    if (currentPrice < lowerPrice) {
      alert("Price below the specified range, 0 tokenA will be added");
      return 0;
  }
    console.log(upperPrice,currentPrice)
    console.log( currentPrice < upperPrice ? tokenBamt/currentPrice : 0)
  return currentPrice < upperPrice ? tokenBamt/currentPrice : 0;
}


export const getTokenARequiredManage=(tokenAamt,upperPrice,lowerPrice,currentPrice)=>{
 
  upperPrice = 1/tickToPrice(upperPrice)
  lowerPrice = 1/tickToPrice(lowerPrice)
  currentPrice = 1/currentPrice;
  // const sqrtCurrentPrice = Math.sqrt(currentPrice);
  // const sqrtUpperPrice = Math.sqrt(upperPrice);
  // const sqrtLowerPrice = Math.sqrt(lowerPrice);

  // const liquidity = (tokenAamt * sqrtCurrentPrice * sqrtUpperPrice) / (sqrtUpperPrice - sqrtCurrentPrice);

  // const amountB = liquidity * (sqrtCurrentPrice - sqrtLowerPrice);

  // if(currentPrice>upperPrice){
  //     alert("Price above the specified range, 0 tokenB will be added")
  //     return 0
  // }

  // return currentPrice>lowerPrice?tokenAamt/currentPrice:0;

  // console.log(upperPrice,lowerPrice,currentPrice,liquidity,amountB);
  // return amountB>0?amountB:0;
  console.log(lowerPrice,currentPrice,upperPrice)
  //  if (currentPrice < lowerPrice) {
  //     alert("Price below the specified range, 0 tokenA will be added");
  //     return 0;
  // }
  if (currentPrice < upperPrice) {
    alert("Price below the specified range, 0 tokenA will be added");
    return 0;
}
  return currentPrice < lowerPrice ? tokenAamt*currentPrice : 0;
}

export const getTokenBRequiredManage = (tokenBamt,upperPrice,lowerPrice,currentPrice)=>{

  upperPrice = tickToPrice(upperPrice);
  lowerPrice = tickToPrice(lowerPrice);

  console.log(currentPrice,upperPrice,lowerPrice)


  // If price is above upper bound, you only provide token1
  if (currentPrice > upperPrice) {
      alert("Price above the specified range, only token1 is needed");
      return 0;
  }

  // If within range, calculate the amount needed
  // Since we're working with token1/token0 ratio:
  // tokenB (token1) needed = tokenBamt * (1 - (currentPrice - lowerPrice)/(upperPrice - lowerPrice))
  return currentPrice < upperPrice ? tokenBamt*currentPrice : 0;
}