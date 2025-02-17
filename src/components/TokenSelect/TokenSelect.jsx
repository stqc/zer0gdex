import { useDispatch } from "react-redux";
import InputComponent, { InputElement } from "../InputComponent/InputComponent";
import { TokenSelector } from "../Swap/Swap";
import { useState } from "react";
import { setLowerTick,setUpperTick } from "../../redux/liquidityTokenSelectorSlice";
const TokenSelect = (props)=>{

    const dispatch = useDispatch();

    const dispatchUpdates=(value)=>{
        dispatch(props.changeCurrentToken(value)); 
        dispatch(setLowerTick(null))
        dispatch(setUpperTick(0))
    }

    const [currentTokenName,UpdateTokenName]  = useState('Choose Token')
 return(   
    <div className="token-select" style={{width:"100%"}}>
        <InputComponent width="100%" radius="25px">
            {/* <InputElement type="text" updateTokenAmount={dispatchUpdates}/> */}
            <TokenSelector width={"100%"} token={currentTokenName} setToken={UpdateTokenName} updateToken={dispatchUpdates} style={{width:"100px"}}/>
        </InputComponent>
        {/* <input placeholder="token-address" onChange={(e)=>{
            dispatch(props.changeCurrentToken(e.target.value));  
        }}/> */}
    </div>
    )
}

export default TokenSelect