import React from "react";
import "./CreatePositionButton.css";
import NFTPositionManagerABI from "../../ContractInteractions/ABI/NFTPositionManager.json";
import FactoryABI from "../../ContractInteractions/ABI/Factory.json";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { NFTPositionManagerAddress, provider, WETH } from "../ContractInteractions/constants";
import { createERC20Instance, hasEnoughApproval, requestApproval } from "../ContractInteractions/ERC20Methods";

const CreatePositionButton = (props) => {
  let {
    tokenA,
    tokenB,
    feeTier,
    tokenAamount,
    tokenBamount,
    lowerTick,
    upperTick,
    spacing
  } = useSelector((state) => state.liquidityToken);

  const getPool = async (token0, token1) => {
    const contract = new ethers.Contract(
      "0xe1aAD0bac492F6F46BFE1992080949401e1E90aD",
      FactoryABI,
      provider
    );
    const address = await contract.getPool(token0, token1, feeTier);
    return address;
  };

  const createPoolIfNecessary = async (token0, token1, price) => {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      "0xdEA2e2AF102F95cc688E12BB4AFAEE36D7082434",
      NFTPositionManagerABI,
      signer
    );
    try {
      const tx = await contract.createAndInitializePoolIfNecessary(
        token0,
        token1,
        feeTier,
        price
      );
      console.log("Transaction sent:", tx.hash);
      const receipt = await tx.wait();
      console.log("Pool created and initialized. Transaction receipt:", receipt);
    } catch (error) {
      console.error("Error creating pool:", error);
      throw error;
    }
  };

  const calculateTicks = (token0IsTokenA, lowerPrice, upperPrice) => {
    // Convert prices to token1/token0 format if needed
    const adjustedLowerPrice = token0IsTokenA ? 1/upperPrice : lowerPrice;
    const adjustedUpperPrice = token0IsTokenA ? 1/lowerPrice : upperPrice;
    
    // Calculate ticks using log base 1.0001
    const tickLower = Math.floor(Math.log(adjustedLowerPrice) / Math.log(1.0001));
    const tickUpper = Math.floor(Math.log(adjustedUpperPrice) / Math.log(1.0001));
    
    // Adjust for tick spacing
    return {
      tickLower: Math.floor(tickLower / spacing) * spacing,
      tickUpper: Math.floor(tickUpper / spacing) * spacing
    };
  };

  const createPosition = async () => {
    {
      // Sort tokens
      const token0Checksum = ethers.getAddress(tokenA);
      const token1Checksum = ethers.getAddress(tokenB);
      const token0Int = BigInt(token0Checksum);
      const token1Int = BigInt(token1Checksum);
      const [token0, token1] = token0Int < token1Int 
        ? [token0Checksum, token1Checksum] 
        : [token1Checksum, token0Checksum];

      const token0IsTokenA = token0 === tokenA;
      
      // Calculate amounts
      const amount0Desired = ethers.parseEther(
        (token0IsTokenA ? tokenAamount : tokenBamount).toString()
      );
      const amount1Desired = ethers.parseEther(
        (token0IsTokenA ? tokenBamount : tokenAamount).toString()
      );

      // Calculate initial sqrt price
      const priceRatio = token0IsTokenA 
        ? tokenBamount / tokenAamount 
        : tokenAamount / tokenBamount;
      const sqrtPrice = Math.sqrt(priceRatio);
      const sqrtPricex96 = BigInt(Math.floor(sqrtPrice * 2 ** 96));

      // Calculate ticks
      const { tickLower, tickUpper } = calculateTicks(
        token0IsTokenA,
        lowerTick,
        upperTick
      );

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        "0xdEA2e2AF102F95cc688E12BB4AFAEE36D7082434",
        NFTPositionManagerABI,
        signer
      );

      // Check pool existence
      const address = await getPool(token0, token1);
      if (address === ethers.ZeroAddress) {
        if (tokenAamount === 0 || tokenBamount === 0) {
          throw new Error('Pool Does Not Exist, Please fill both token A and Token B amount to continue');
        }
        await createPoolIfNecessary(token0, token1, sqrtPricex96);
      }

      // Handle approvals
      const approvalPromises = [];
      if (token0.toLowerCase() !== WETH.toLowerCase()) {
        const contract0 = createERC20Instance(token0);
        const status0 = await hasEnoughApproval(
          contract0,
          signer.address,
          NFTPositionManagerAddress,
          amount0Desired
        );
        if (!status0) {
          approvalPromises.push(
            requestApproval(contract0, signer, NFTPositionManagerAddress, amount0Desired)
          );
        }
      }
      
      if (token1.toLowerCase() !== WETH.toLowerCase()) {
        const contract1 = createERC20Instance(token1);
        const status1 = await hasEnoughApproval(
          contract1,
          signer.address,
          NFTPositionManagerAddress,
          amount1Desired
        );
        if (!status1) {
          approvalPromises.push(
            requestApproval(contract1, signer, NFTPositionManagerAddress, amount1Desired)
          );
        }
      }
      
      await Promise.all(approvalPromises);

      // Create position
      const tx = await contract.mint(
        {
          token0,
          token1,
          fee: feeTier,
          tickLower,
          tickUpper,
          recipient: await signer.getAddress(),
          amount0Desired,
          amount1Desired,
          amount0Min: 0,
          amount1Min: 0,
          deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 10)
        },
        {
          value: token1.toLowerCase() === WETH.toLowerCase() 
            ? amount1Desired 
            : token0.toLowerCase() === WETH.toLowerCase()
            ? amount0Desired
            : 0
        }
      );

      const receipt = await tx.wait();
      alert("Position created. Transaction receipt: " + receipt.hash);
    } 
  };

  return (
    <button 
      className="create-position-button" 
      onClick={createPosition}
    >
      Create Position
    </button>
  );
};

export default CreatePositionButton;