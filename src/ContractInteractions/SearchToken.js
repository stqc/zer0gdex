import { provider } from "../components/ContractInteractions/constants";
import { ethers } from "ethers";
import ERC20abi from "../components/ContractInteractions/ERC20abi.json"

export const  findListingToken = async (token) => {
    const contract = new ethers.Contract(token, ERC20abi, provider);
    const name = await contract.symbol();
    const decimals = await contract.decimals();
    return [name,ethers.toNumber(decimals)];
}
