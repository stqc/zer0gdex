import React from "react";
import "./CreatePositionButton.css";
import NFTPositionManagerABI from "../../ContractInteractions/ABI/NFTPositionManager.json";
import FactoryABI from "../../ContractInteractions/ABI/Factory.json";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { NFTPositionManagerAddress, provider, WETH } from "../ContractInteractions/constants";
import { createERC20Instance, hasEnoughApproval, requestApproval } from "../ContractInteractions/ERC20Methods";

const CreatePositionButton = () => {

  const {tokenA,
    tokenB,
    feeTier,
    tokenAamount,
    tokenBamount,
    lowerTick,
    upperTick,
    } = useSelector((state)=>state.liquidityToken);

  const getPool = async (token0,token1) => { 
    
    const contract  = new ethers.Contract("0xe1aAD0bac492F6F46BFE1992080949401e1E90aD", FactoryABI, provider);
    console.log(token0,token1,feeTier)
    const address = await contract.getPool(token0, token1, feeTier);
    
    return address;
  }

  const createPoolIfNecessary = async (token0,token1) => {
    const signer = await provider.getSigner();
    const contract  = new ethers.Contract("0xdEA2e2AF102F95cc688E12BB4AFAEE36D7082434", NFTPositionManagerABI,signer);
    const sqrtPrice = Math.sqrt((tokenAamount/tokenBamount));
    const sqrtPricex96 = BigInt(Math.floor(sqrtPrice*2**96)); 
    const tx = await contract.createAndInitializePoolIfNecessary(token0, token1, feeTier,sqrtPricex96);
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Pool created and initialized. Transaction receipt:", receipt);

  }

  const createPosition = async () => {

    const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase()
  ? [tokenA, tokenB]
  : [tokenB, tokenA];

    const signer = await provider.getSigner();
    
    const contract  = new ethers.Contract("0xdEA2e2AF102F95cc688E12BB4AFAEE36D7082434", NFTPositionManagerABI,signer);
    const address = await getPool(token0,token1);

    console.log(address)

    if(address === ethers.ZeroAddress){
      await createPoolIfNecessary(token0,token1);
    }

    const contract0 = token0!==WETH? createERC20Instance(token0):null;
    const contract1 = token1!==WETH? createERC20Instance(token1):null;

    console.log("requesting approval...");

    if(contract0){
      const status = hasEnoughApproval(contract0,signer.address,NFTPositionManagerAddress,ethers.parseEther(tokenAamount.toString()));
      if(!status){
        requestApproval(contract0,signer,NFTPositionManagerAddress,ethers.parseEther(tokenAamount.toString()));
      }
    }

    if(contract1){
      const status = hasEnoughApproval(contract1,signer.address,NFTPositionManagerAddress,ethers.parseEther(tokenBamount.toString()));
      if(!status){
        requestApproval(contract1,signer,NFTPositionManagerAddress,ethers.parseEther(tokenBamount.toString()));
      }
    }


    console.log("Creating position...");

    console.log(upperTick,lowerTick, feeTier)
    const tx = await contract.mint(
      {token0:token0, token1:token1, fee:feeTier ,tickLower:lowerTick, tickUpper:upperTick, recipient:signer.getAddress() ,amount0Desired:ethers.parseEther(tokenAamount.toString()), amount1Desired:ethers.parseEther(tokenBamount.toString()), amount0Min:0,amount1Min:0,
        deadline:BigInt(Math.floor(Date.now()/1000)+60*10)
      },
      {value:ethers.parseEther(tokenBamount.toString())}
  );
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    console.log("Position created. Transaction receipt:", receipt);
  }
  return (
    <button className="create-position-button" onClick={async ()=>{ createPosition()}}>Create Position</button>
  );

};

export default CreatePositionButton;
