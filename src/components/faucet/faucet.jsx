import React, { useState } from 'react';
import { provider } from '../ContractInteractions/constants';
import { ethers } from 'ethers';

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'system-ui, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  title: {
    color: '#9333ea',
    fontSize: '20px',
    fontWeight: '500'
  },
  settingsButton: {
    padding: '8px',
    borderRadius: '50%',
    backgroundColor: '#faf5ff',
    border: 'none',
    cursor: 'pointer'
  },
  inputSection: {
    backgroundColor: '#faf5ff',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px'
  },
  inputRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  input: {
    fontSize: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    width: '50%',
    color:"black"
  },
  tokenSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  tokenIcon: {
    width: '24px',
    height: '24px',
    backgroundColor: '#e9d5ff',
    borderRadius: '50%'
  },
  select: {
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    color:'black',
    width:'100%',
  },
  maxLabel: {
    color: '#6b7280'
  },
  priceImpact: {
    color: '#6b7280',
    marginBottom: '16px'
  },
  mintButton: {
    width: '100%',
    backgroundColor: '#E074DD',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '16px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }
};

const abi = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "mintPoint",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "_decimals",
				"type": "uint8"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "DOMAIN_SEPARATOR",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "amtToMint",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "lastClaimed",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "nonces",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deadline",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "v",
				"type": "uint8"
			},
			{
				"internalType": "bytes32",
				"name": "r",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "s",
				"type": "bytes32"
			}
		],
		"name": "permit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const Faucet = () => {
  const [selectedToken, setSelectedToken] = useState('BTC');
  const tokens = ['BTC', 'USDT', 'ETH'];
  const amt ={'BTC':0.1,'USDT':10000, 'ETH':10}
  const addresses = {'BTC':"0x1e0d871472973c562650e991ed8006549f8cbefc",'ETH':"0xce830D0905e0f7A9b300401729761579c5FB6bd6","USDT":"0x9A87C2412d500343c073E5Ae5394E3bE3874F76b"}

  const mint = async ()=>{
    const Signer =await provider.getSigner();
	console.log(addresses[selectedToken])
    const contract  = new ethers.Contract(addresses[selectedToken],abi,Signer);

    try{
		console.log("heloo")
    const tx = await contract.mint();
    const recipt = await tx.wait();

    alert(recipt.hash);}
    catch(e){
        alert(e.message);
    }
  }
  return (
    <div style={{display:"flex", justifyContent:"center"}}>
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Mint</div>

      </div>

      <div style={styles.inputSection}>
        <div style={styles.inputRow}>
          {/* <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
            placeholder="addree"
          /> */}
          {/* <div style={styles.tokenSelector}> */}
            {/* <div style={styles.tokenIcon} /> */}
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              style={styles.select}
            >
              {tokens.map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          {/* </div> */}
        </div>
      </div>
      <button 
        style={styles.mintButton}
        onMouseOver={(e) => e.target.style.backgroundColor = '#7e22ce'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#E074DD'}
		onClick={async ()=>{
				await mint();
		}}
      >
        Mint
      </button>

      <h5>*Claim {amt[selectedToken].toLocaleString()} {selectedToken} every 24 hrs</h5>
    </div>
    </div>
  );
};

export default Faucet