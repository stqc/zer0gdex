import {ethers} from 'ethers';
import { provider, WETH} from '../components/ContractInteractions/constants';
import { NFTPositionManagerAddress } from '../components/ContractInteractions/constants';
import NFTPositionManagerABI from "../ContractInteractions/ABI/NFTPositionManager.json";
import { findListingToken } from './SearchToken';
import { getTokenBalance, hasEnoughApproval,requestApproval } from '../components/ContractInteractions/ERC20Methods';
import FactoryABI from "../ContractInteractions/ABI/Factory.json";
import ERC20abi from "../components/ContractInteractions/ERC20abi.json";

const getPool = async (token0,token1,feeTier) => { 
    
    const contract  = new ethers.Contract("0xe1aAD0bac492F6F46BFE1992080949401e1E90aD", FactoryABI, provider);
    const address = await contract.getPool(token0, token1, feeTier);
    
    return address;
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
        const balanceOfToken0 = await getTokenBalance(position.token0,poolAddress);
        const balanceOfToken1 = await getTokenBalance(position.token1,poolAddress);
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
                liquidity:position.liquidity
        });
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
      console.log(recipt);}
      catch(e){
        console.log(e);
      }
}

export const removeLiquidity = async (tokenId,percentage,liquidity)=>{

    console.log(liquidity);
    const Signer = await provider.getSigner();

    const NFTpositionManagerContract = new ethers.Contract(NFTPositionManagerAddress,NFTPositionManagerABI,Signer);

    const LiquidityToRemove = liquidity*percentage/100;

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

    const tx = await NFTpositionManagerContract.multicall(multicall)

    const reciept = await tx.wait();

    console.log("removed: "+reciept);
}