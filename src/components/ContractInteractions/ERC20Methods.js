import { ethers } from 'ethers';
import ERC20Abi from "./ERC20abi.json";
import { provider } from './constants';

// Function to check if an address has enough approval
async function hasEnoughApproval(contract, owner, spender, amount) {
    const allowance = await contract.allowance(owner, spender);
    console.log(allowance>=amount)
    return allowance>=amount;
}

// Function to request approval
async function requestApproval(contract, signer, spender, amount) {
    const tx = await contract.connect(signer).approve(spender, amount);
    await tx.wait();
    console.log(`Approval granted for ${spender} to spend ${amount.toString()} tokens`);
}

// Function to create an ERC20 token instance
function createERC20Instance(address) {
    return new ethers.Contract(address, ERC20Abi, provider);
}

async function getTokenBalance(token,address){
    const contract = createERC20Instance(token);
    return await contract.balanceOf(address);
}

export { hasEnoughApproval, requestApproval, createERC20Instance, getTokenBalance };