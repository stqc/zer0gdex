import { ethers } from "ethers";

export const provider =  window.ethereum 
? new ethers.BrowserProvider(window.ethereum)
: new ethers.JsonRpcProvider('https://evmrpc-testnet.0g.ai');

export const WETH = "0x493ea9950586033ea8894b5e684bb4df6979a0d3";

export const NFTPositionManagerAddress = "0xdEA2e2AF102F95cc688E12BB4AFAEE36D7082434";

export const RouterV3 = "0xD86b764618c6E3C078845BE3c3fCe50CE9535Da7";

export const Quoter = "0x8B4f88a752Fd407ec911A716075Ca7809ADdBadd";