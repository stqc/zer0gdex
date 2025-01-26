import InputComponent from "../InputComponent/InputComponent";
import { InputElement } from "../InputComponent/InputComponent";
import { useState } from "react";
import { RemoveLiquidityElements } from "../InputComponent/InputComponent";
import { addLiquidity, getTokenARequired, getTokenBRequired, removeLiquidity } from "../../ContractInteractions/LiquidityPositionsManagement";

export const LeftPaneManage = ({props,price})=>{

    const [optionActive,updateOptionActive] = useState(1);
    
    return (
        <div className="left-pane-manage">
                <OptionPageManage content={[
                    <p className={optionActive===1?"active-tab":""} onClick={()=>{updateOptionActive(1)}}>{props.token0+" per "+props.token1}</p>,
                    // <p className={optionActive===0?"active-tab":""} onClick={()=>{updateOptionActive(0)}}>{props.token1+" per "+props.token0}</p>
                ]}/>
            <div className="range-info">
                <RangeInfoContent left={true} tickLeft={props.tickLeft}/>
                <div className="range-content">
                    <div className="range-heading">
                        Current Price
                    </div>
                    <div className="range-price">
                        {price.toFixed(3)}
                    </div>
                </div>
                <RangeInfoContent left={false} tickRight={props.tickRight}/>
            </div>
        </div>
    )

}

const RangeInfoContent = (props)=>{
    return (
            <div className="range-content">
                <div className="range-heading">
                    {props.left?"Min Price":"Max Price"}
                </div>
                <div className="range-price">
                    {Math.pow(1.0001,props.left?props.tickLeft:props.tickRight).toFixed(3)}
                </div>
            </div>
            )
}

const OptionPageManage = (props)=>{
    return (
            <div className="options-pane-manage">
                {
                    props.content
                }
            </div>
            )
}

export const RightPaneManage = ({props,currentPrice,tokenAbal,tokenBbal})=>{

    const [currentPage,updateCurrentPage] = useState('Add');
    const [token0Amount,updateToken0Amount] = useState(0);
    const [token1Amount,updateToken1Amount] = useState(0);
    const [percentage,UpdatePercentage] = useState(25);

    const updateABPrice = (price)=>{
        console.log(price);
        updateToken0Amount(price);
        updateToken1Amount(getTokenBRequired(price,props.tickRight,props.tickLeft,currentPrice));
    }

    const updateBAprice = (price)=>{
        console.log(price);
        updateToken1Amount(price);
        updateToken0Amount(getTokenARequired(price,props.tickRight,props.tickLeft,currentPrice));
    }

    return (<div className="left-pane-manage">
                <OptionPageManage content={[
                    <p className={currentPage==="Add"?"active-tab":""} onClick={()=>{updateCurrentPage('Add')}}>{"Add"}</p>,
                    <p className={currentPage==="Remove"?"active-tab":""}onClick={()=>{updateCurrentPage('Remove')}}>{"Remove"}</p>,
                ]}/>
           {currentPage === 'Add' &&  <>
                <h4>{"Deposit Amounts"}</h4>
                <InputComponent>
                    <InputElement value={token0Amount} name={props.token0} updateTokenAmount={updateABPrice}/>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div style={{background:"white", borderRadius:"50px", width:"50px", textAlign:"center", cursor:"pointer"}}>
                            <span className="max-label" style={{color:"black", fontWeight:"500"}} onClick={()=>{
                                updateABPrice(tokenAbal)
                            }}>Max</span>
                        </div>
                        <span>
                            {Number(tokenAbal).toFixed(3)}
                        </span>
                    </div>
                </InputComponent>
                <InputComponent>
                    <InputElement value={token1Amount} name={props.token1} updateTokenAmount={updateBAprice}/>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div style={{background:"white", borderRadius:"50px", width:"50px", textAlign:"center",  cursor:"pointer"}}>
                            <span className="max-label" style={{color:"black", fontWeight:"500"}} onClick={()=>{
                                updateBAprice(tokenBbal);
                            }}>Max</span>
                        </div>
                        <span>
                                {Number(tokenBbal).toFixed(3)}
                        </span>
                    </div>
                </InputComponent>
                <button style={{borderRadius:"50px", background:"#E074DD"}} onClick={()=>{
                    console.log(token0Amount,token1Amount);
                    addLiquidity(props.NFTid,token0Amount,token1Amount,props.token0Add,props.token1Add)
                }}>Confirm</button>
            </>}
            {currentPage === 'Remove' &&  <>
                <h4>{"Remove Liquidity"}</h4>
                <InputComponent>
                  <RemoveLiquidityElements defVal={percentage} changePercentage={UpdatePercentage}/>
                </InputComponent>
                <button style={{borderRadius:"50px", background:"#E074DD"}} onClick={()=>{
                    removeLiquidity(props.NFTid,percentage,props.liquidity);
                }}>Confirm</button>
            </>}
            
        </div>

    )
}