import {ethers} from "ethers";
import RouterABI from "./ABI/UniRouter.json";
import QuoterABI from "./ABI/Quoter.json";
import { provider, Quoter } from "../components/ContractInteractions/constants";
import {RouterV3,WETH} from "../components/ContractInteractions/constants";
import { hasEnoughApproval,requestApproval } from "../components/ContractInteractions/ERC20Methods";
import ERC20Abi from "../components/ContractInteractions/ERC20abi.json";



export async function getBestQuote( tokenIn,tokenOut, amountIn=0.00001, feeTiers=[500,3000,10000]) {
    
    const Signer = await provider.getSigner();
    const routerContract = new ethers.Contract(Quoter, QuoterABI, Signer);
    amountIn = ethers.parseEther(amountIn.toString());
    
    let bestQuote = {
        amountOut: BigInt(0),
        feeTier: null
    };

    for (const feeTier of feeTiers) {
        try {
            const amountOut = await routerContract.quoteExactInputSingle.staticCall({
                tokenIn:tokenIn,
                tokenOut:tokenOut,
                fee:feeTier,
                amountIn:amountIn,
                sqrtPriceLimitX96:0
        });
            
            if (amountOut.amountOut >bestQuote.amountOut){
                bestQuote.amountOut = amountOut.amountOut;
                bestQuote.feeTier = feeTier;
            }
        } catch (error) {
            console.error(`Error getting quote for fee tier ${feeTier}:`, error);
        }
    }
    console.log(bestQuote);
    return bestQuote;
}

export async function executeSwap(tokenIn,tokenOut,amountIn,feeTier){
    
    const Signer  = await provider.getSigner();
    const routerContract = new ethers.Contract(RouterV3, RouterABI, provider);
    amountIn = ethers.parseEther(amountIn.toString());
    
    const tokenInContract = new ethers.Contract(tokenIn,ERC20Abi,provider);

    const approvalNotRequired =await tokenIn!==WETH?hasEnoughApproval(tokenInContract,Signer.address,RouterV3,amountIn):true;

    if(!approvalNotRequired){
        await requestApproval(tokenInContract,Signer,RouterV3,amountIn);
    }

    try{
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
    console.log(recipt.hash);
    alert("Transaction executed:"+recipt.hash);}
    catch(e){
        alert(e.message)
    }
}