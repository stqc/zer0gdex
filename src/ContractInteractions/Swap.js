import {ethers} from "ethers";
import RouterABI from "./ABI/UniRouter.json";
import { provider } from "../components/ContractInteractions/constants";
import {RouterV3,WETH} from "../components/ContractInteractions/constants";
import { hasEnoughApproval,requestApproval } from "../components/ContractInteractions/ERC20Methods";
import ERC20Abi from "../components/ContractInteractions/ERC20abi.json";



export async function getBestQuote( tokenIn,tokenOut, amountIn=0.00001, feeTiers=[500,3000,10000]) {
    
    const Signer = await provider.getSigner();
    const routerContract = new ethers.Contract(RouterV3, RouterABI, Signer);
    amountIn = ethers.parseEther(amountIn.toString());
    
    let bestQuote = {
        amountOut: BigInt(0),
        feeTier: null
    };

    for (const feeTier of feeTiers) {
        try {
            const amountOut = await routerContract.exactInputSingle.staticCall({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: feeTier,
                recipient: Signer.address,
                deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            },{value:tokenIn===WETH? amountIn:null});

            if (amountOut >bestQuote.amountOut){
                bestQuote.amountOut = amountOut;
                bestQuote.feeTier = feeTier;
            }
        } catch (error) {
            console.error(`Error getting quote for fee tier ${feeTier}:`, error);
        }
    }
    return bestQuote;
}

export async function executeSwap(tokenIn,tokenOut,amountIn,feeTier){
    
    const Signer  = await provider.getSigner();
    const routerContract = new ethers.Contract(RouterV3, RouterABI, provider);
    amountIn = ethers.parseEther(amountIn.toString());
    
    const tokenInContract = new ethers.Contract(tokenIn,ERC20Abi,provider);

    const approvalNotRequired =tokenIn!==WETH?hasEnoughApproval(tokenInContract,Signer.address,RouterV3,amountIn):true;

    if(!approvalNotRequired){
        requestApproval(tokenInContract,Signer,RouterV3,amountIn);
    }

    const tx = await routerContract.connect(Signer).exactInputSingle({
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: feeTier,
        recipient: Signer.address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10, // 20 minutes from the current Unix time
        amountIn: amountIn,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0
    },{value:tokenIn===WETH? amountIn:null});

    const recipt = await tx.wait();
    console.log("Transaction executed:",recipt);
}