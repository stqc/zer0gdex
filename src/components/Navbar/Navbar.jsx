import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { provider } from "../ContractInteractions/constants";

function Navbar() {

  const [walletAddress, setWalletAddress] = useState(null);

  async function connectWallet() {
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      setWalletAddress(_walletAddress);
  }

  return (
    <div className="navbar">
      <div className="navbar-left">
        {/* Logo */}
        <div className="logo">
          <span>zero</span>
        </div>
      </div>

      <div className="navbar-center">
        {/* Navigation Links */}
        <nav>
          <Link to={"/swap"}>Swap</Link>
          <Link to={"/add"}>Add Liquidity</Link>
          <Link to={"/manage"}>Manage Liquidity</Link>
          {/* <a href="#vote">
            Vote <span className="badge">Soon</span>
          </a> */}
        </nav>
      </div>

      <div className="navbar-right">
        {/* Icons and Connect Wallet */}
        <div className="icon">
          <img src="https://via.placeholder.com/30" alt="icon" />
        </div>
        <button className="connect-wallet" onClick={()=>{
          connectWallet();
        }}>{walletAddress?walletAddress.slice(0,5)+"....":"Connect"}</button>
      </div>
    </div>
  );
}

export default Navbar;
