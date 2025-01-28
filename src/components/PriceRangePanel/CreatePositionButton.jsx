import React from "react";
import "./CreatePositionButton.css";
import NFTPositionManagerABI from "../../ContractInteractions/ABI/NFTPositionManager.json";
import FactoryABI from "../../ContractInteractions/ABI/Factory.json";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { NFTPositionManagerAddress, provider, WETH } from "../ContractInteractions/constants";
import { createERC20Instance, hasEnoughApproval, requestApproval } from "../ContractInteractions/ERC20Methods";

const CreatePositionButton = (props) => {

  let {tokenA,
    tokenB,
    feeTier,
    tokenAamount,
    tokenBamount,
    lowerTick,
    upperTick,
    spacing
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
    const sqrtPrice = Math.sqrt(props.price);
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

  console.log(token0,tokenAamount,tokenA)
  console.log(token1,tokenBamount,tokenB)

    const signer = await provider.getSigner();
    
    const contract  = new ethers.Contract("0xdEA2e2AF102F95cc688E12BB4AFAEE36D7082434", NFTPositionManagerABI,signer);
    const address = await getPool(token0,token1);

    console.log(address)

    if(address === ethers.ZeroAddress && tokenAamount!==0 && tokenBamount!==0){
      await createPoolIfNecessary(token0,token1);
    }

    if(address === ethers.ZeroAddress && (tokenAamount===0 || tokenBamount===0)){
      alert('Pool Does Not Exist, Please fill both token A and Token B amount to continue')
    }
  

    const contract0 = token0.toLowerCase()!==WETH.toLowerCase()? createERC20Instance(token0):null;
    const contract1 = token1.toLowerCase()!==WETH.toLowerCase()? createERC20Instance(token1):null; 

    console.log(token0,"token 0")
    console.log(token1,"token1")

    console.log(tokenAamount,tokenBamount)
    if(contract0){
      const status =await hasEnoughApproval(contract0,signer.address,NFTPositionManagerAddress,ethers.parseEther(tokenAamount.toString()));
      if(!status){
        await requestApproval(contract0,signer,NFTPositionManagerAddress,ethers.parseEther(tokenAamount.toString()));
      }
    }

    if(contract1){
      const status = await hasEnoughApproval(contract1,signer.address,NFTPositionManagerAddress,ethers.parseEther(tokenBamount.toString()));
      if(!status){
        await requestApproval(contract1,signer,NFTPositionManagerAddress,ethers.parseEther(tokenBamount.toString()));
      }
    }

    console.log("updating ticks for ",spacing);
    
    lowerTick = Math.floor(lowerTick/spacing)*spacing;
    upperTick = Math.floor(upperTick/spacing)*spacing;

    try{
    console.log("Creating position...");
//add a check to only send ETHERS IF the current tick is lower than the position being created
    console.log(upperTick,lowerTick, feeTier,ethers.parseEther(tokenAamount.toString()),tokenBamount,token0,token1)
    const tx = await contract.mint(
      {token0:token0, token1:token1, fee:feeTier ,tickLower:lowerTick, tickUpper:upperTick, recipient:signer.getAddress() ,amount0Desired:ethers.parseEther(tokenAamount.toString()), amount1Desired:ethers.parseEther(tokenBamount.toString()), amount0Min:0,amount1Min:0,
        deadline:BigInt(Math.floor(Date.now()/1000)+60*10)
      },
      {value:token1.toLowerCase()===WETH.toLowerCase()?ethers.parseEther(tokenBamount.toString()):null}
  );
    console.log("Transaction sent:", tx.hash);

    const receipt = await tx.wait();
    alert("Position created. Transaction receipt:"+receipt.hash);
  }catch(e){
    alert(e.message)
  }
}
  return (
    <button className="create-position-button" onClick={async ()=>{ createPosition()}}>Create Position</button>
  );


};

export default CreatePositionButton;
