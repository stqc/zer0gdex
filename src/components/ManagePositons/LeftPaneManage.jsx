import InputComponent from "../InputComponent/InputComponent";
import { InputElement } from "../InputComponent/InputComponent";
import { useState } from "react";
import { RemoveLiquidityElements } from "../InputComponent/InputComponent";
import { addLiquidity, removeLiquidity } from "../../ContractInteractions/LiquidityPositionsManagement";

export const LeftPaneManage = ({props})=>{


    return (
        <div className="left-pane-manage">
                <OptionPageManage content={[
                    <p>{props.token0+" per "+props.token1}</p>,
                    <p>{props.token1+" per "+props.token0}</p>
                ]}/>
            <div className="range-info">
                <RangeInfoContent left={true} tickLeft={props.tickLeft}/>
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
                    {Math.pow(1.0001,props.left?props.tickLeft:props.tickRight)}
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

export const RightPaneManage = ({props})=>{

    const [currentPage,updateCurrentPage] = useState('Add');
    const [token0Amount,updateToken0Amount] = useState(0);
    const [token1Amount,updateToken1Amount] = useState(0);
    const [percentage,UpdatePercentage] = useState(25);

    return (<div className="left-pane-manage">
                <OptionPageManage content={[
                    <p onClick={()=>{updateCurrentPage('Add')}}>{"Add"}</p>,
                    <p onClick={()=>{updateCurrentPage('Remove')}}>{"Remove"}</p>,
                    <p onClick={()=>{updateCurrentPage('Transfer')}}>{"Transfer"}</p>
                ]}/>
           {currentPage === 'Add' &&  <>
                <h4>{"Deposit Amounts"}</h4>
                <InputComponent>
                    <InputElement name={props.token0} updateTokenAmount={updateToken0Amount}/>
                </InputComponent>
                <InputComponent>
                    <InputElement name={props.token1} updateTokenAmount={updateToken1Amount}/>
                </InputComponent>
                <button style={{alignSelf:"center"}} onClick={()=>{
                    console.log(token0Amount,token1Amount);
                    addLiquidity(props.NFTid,token0Amount,token1Amount,props.token0Add,props.token1Add)
                }}>Confirm</button>
            </>}
            {currentPage === 'Remove' &&  <>
                <h4>{"Remove Liquidity"}</h4>
                <InputComponent>
                  <RemoveLiquidityElements defVal={percentage} changePercentage={UpdatePercentage}/>
                </InputComponent>
                <button style={{alignSelf:"center"}} onClick={()=>{
                    removeLiquidity(props.NFTid,percentage,props.liquidity);
                }}>Confirm</button>
            </>}
            
        </div>

    )
}