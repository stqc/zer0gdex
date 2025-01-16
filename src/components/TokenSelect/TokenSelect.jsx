import { useDispatch } from "react-redux";
import InputComponent, { InputElement } from "../InputComponent/InputComponent";
import { TokenSelector } from "../Swap/Swap";
import { useState } from "react";

const TokenSelect = (props)=>{

    const dispatch = useDispatch();

    const dispatchUpdates=(value)=>{
        dispatch(props.changeCurrentToken(value));  
    }

    const [currentTokenName,UpdateTokenName]  = useState('Choose Token')
 return(   
    <div className="token-select">
        <InputComponent>
            {/* <InputElement type="text" updateTokenAmount={dispatchUpdates}/> */}
            <TokenSelector token={currentTokenName} setToken={UpdateTokenName} updateToken={props.changeCurrentToken}/>
        </InputComponent>
        {/* <input placeholder="token-address" onChange={(e)=>{
            dispatch(props.changeCurrentToken(e.target.value));  
        }}/> */}
    </div>
    )
}

export default TokenSelect