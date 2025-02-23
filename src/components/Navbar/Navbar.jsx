import React, { useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { provider } from "../ContractInteractions/constants";
import Logo from "../../Assets/Logo.svg";
import ZerogLogo from "../../Assets/0g.svg"

function Navbar() {

  const [walletAddress, setWalletAddress] = useState(null);

  async function connectWallet() {
      const signer = await provider.getSigner();
      const _walletAddress = await signer.getAddress();
      setWalletAddress(_walletAddress);
  }


  useEffect(()=>{
    (async ()=>{
      connectWallet();
    })();
  })

  return (
    <div className="navbar">
      <div className="navbar-left">
        {/* Logo */}
        <div className="logo" style={{height:"32px", width:"120px"}}>
            <img src={Logo} height={"100%"} width={"100%"}/>
        </div>
      </div>

      <div className="navbar-center">
        {/* Navigation Links */}
        <nav>
          <Link className="link-text" to={"/swap"}>Swap</Link>
          <Link className="link-text" to={"/pools"}>Pools</Link>
          <Link className="link-text" to={"/manage"}>My Pools</Link>
          <Link className="link-text" to={"/faucet"}>Faucet</Link>
        </nav>
      </div>

      <div className="navbar-right">
        {/* Icons and Connect Wallet */}
        <div className="icon">
          <img src={ZerogLogo} alt="icon" height={"100%"} width={"100%"}/>
        </div>
        <button className="connect-wallet" onClick={()=>{
          connectWallet();
        }}>{walletAddress?walletAddress.slice(0,5)+"....":"Connect"}</button>
      </div>
    </div>
  );
}

export default Navbar;
