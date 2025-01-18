import "./Manage.css";
import { LeftPaneManage,RightPaneManage } from "./LeftPaneManage";
import { useSelector } from "react-redux";
import ZeroLogo from "../../Assets/zer0.svg";
import BackIcon from "../../Assets/backIcon.svg";
import { useEffect, useState } from "react";
import { getBestQuote } from "../../ContractInteractions/Swap";
import { ethers } from "ethers";
import { getBalanceOfUser } from "../../ContractInteractions/SearchToken";

export const ManagePanel =(props)=>{
    const currentData = useSelector(state=>state.ManageSinglePositionReducer)
    console.log(currentData)

    const [price,UpdatePrice]= useState(0);
    const [tokenAbalance,updateTokenAbalance] = useState(0);
    const [tokenBbalance,updateTokenBbalance] = useState(0)

    useEffect(()=>{
        (
            async()=>{
                let currentPrice = await getBestQuote(currentData.token0Add,currentData.token1Add,1);
                currentPrice = Number(ethers.formatEther(currentPrice.amountOut));
                UpdatePrice(currentPrice);
                updateTokenAbalance(await getBalanceOfUser(currentData.token0Add));
                updateTokenBbalance(await getBalanceOfUser(currentData.token1Add))
            }
        )();

    },[])


    return (
        <div>
            <div style={{display:"flex", alignItems:"center", gap:"10px", background:"white", borderRadius:"50px", maxWidth:"200px", padding:"2px 10px", maxHeight:"40px", cursor:"pointer"}}
                onClick={()=>{
                    props.showManage(false);
                }}
            >
                    <div style={{height:"20px", width:"20px"}}>
                        <img src={BackIcon} height={"100%"} width={"100%"}/>
                    </div>
                <div className='position-logo' style={{ display:"flex",flexDirection:"row", position:"relative", gap:"1px"}}>
                    <div style={{height:"30px", width:"30px"}}>
                        <img src={ZeroLogo} height={"100%"} width={"100%"}/>
                    </div>
                    <div style={{height:"30px", width:"30px"}}>
                        <img src={ZeroLogo} height={"100%"} width={"100%"}/>
                    </div>
                </div>
                <h4>{currentData.token0}/{currentData.token1}</h4>
            </div>
            <div className="main-manage-panel">
                <LeftPaneManage props={currentData} price={price}/>
                <RightPaneManage props={currentData} currentPrice={price} tokenAbal={tokenAbalance} tokenBbal={tokenBbalance}/>
            </div>
        </div>
    )


}