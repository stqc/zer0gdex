import { useDispatch } from "react-redux";
import InputComponent, { InputElement } from "../InputComponent/InputComponent";

const TokenSelect = (props)=>{

    const dispatch = useDispatch();

    const dispatchUpdates=(value)=>{
        dispatch(props.changeCurrentToken(value));  
    }

 return(   
    <div className="token-select">
        <InputComponent>
            <InputElement type="text" updateTokenAmount={dispatchUpdates}/>
        </InputComponent>
        {/* <input placeholder="token-address" onChange={(e)=>{
            dispatch(props.changeCurrentToken(e.target.value));  
        }}/> */}
    </div>
    )
}

export default TokenSelect