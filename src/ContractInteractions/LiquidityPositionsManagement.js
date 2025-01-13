import {ethers} from 'ethers';
import { provider} from '../components/ContractInteractions/constants';
import { NFTPositionManagerAddress } from '../components/ContractInteractions/constants';
import NFTPositionManagerABI from "../ContractInteractions/ABI/NFTPositionManager.json";
import { findListingToken } from './SearchToken';
import { getTokenBalance } from '../components/ContractInteractions/ERC20Methods';
import FactoryABI from "../ContractInteractions/ABI/Factory.json";


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
        });
    }

    return userPositions;
}