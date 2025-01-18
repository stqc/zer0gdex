import { provider } from "../components/ContractInteractions/constants";
import { ethers } from "ethers";
import ERC20abi from "../components/ContractInteractions/ERC20abi.json"
import { WETH } from "../components/ContractInteractions/constants";

export const  findListingToken = async (token) => {
    const contract = new ethers.Contract(token, ERC20abi, provider);
    const name = await contract.symbol();
    const decimals = await contract.decimals();
    

    return [name,ethers.toNumber(decimals)];
}

export const getBalanceOfUser= async (token)=>{
    
    const contract = new ethers.Contract(token, ERC20abi, provider);
    const Signer = await provider.getSigner()
    let balance = token.toLowerCase()!==WETH.toLocaleLowerCase()?await contract.balanceOf(Signer.address):await provider.getBalance(Signer.address);
    balance = ethers.formatEther(balance)
    console.log(balance)
    return balance
}
