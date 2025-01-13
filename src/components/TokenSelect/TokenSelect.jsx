import { useDispatch } from "react-redux";

const TokenSelect = (props)=>{

    const dispatch = useDispatch();

 return(   
    <div className="token-select">
        <input placeholder="token-address" onChange={(e)=>{
            dispatch(props.changeCurrentToken(e.target.value));  
        }}/>
    </div>
    )
}

export default TokenSelect