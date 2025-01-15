import React, { useState } from 'react';
import './InputComponent.css';
import ZeroLogo from "../../Assets/zer0.svg";

const InputComponent = (props) => {
    return (
        <div className="input-component">
            {props.children}
        </div>
    );
};

export default InputComponent;


export const InputElement =(props)=>{


    return (
        <div style={{display:"flex", justifyContent:"space-between"}}>
            <input className='number-input' style={{fontSize:"1.4rem",width:"100%" ,fontWeight:"600" ,backgroundColor:"transparent", border:0, color:"black"}} placeholder={props.type?"Address":'0.00'} type={props.type?props.type:"number"} onChange={(e)=>{
                props.updateTokenAmount(e.target.value);
            }}>
            </input>
            {props.name && 
            <div style={{display:"flex",gap:"10px", alignItems:"center", width:"30%", justifyContent:"flex-end"}}>
                <div style={{height:"30px", width:"30px"}}>
                    <img src={ZeroLogo} height={"100%"} width={"100%"}/>
                </div>
                <h5>
                    {props.name}
                </h5>
            </div>
            }

        </div>
    )
}

export const RemoveLiquidityElements =(props)=>{
    const [currentValue,UpdateCurrentValue] = useState(props.defVal)
    return (
        <div style={{display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"top"}}>
                <h2 style={{margin:0}}>{currentValue}%</h2>
                <div style={{display:"flex", gap:"5px"}}>
                    <div className="option" onClick={()=>{UpdateCurrentValue(25);
                        props.changePercentage(25);
                    }}>
                        25%
                    </div>
                    <div className="option" onClick={()=>{UpdateCurrentValue(50);
                        props.changePercentage(50);
                    }}>
                        50%
                    </div>
                    <div className="option" onClick={()=>{UpdateCurrentValue(75);
                        props.changePercentage(75);
                    }}>
                        75%
                    </div>
                    <div className="option" onClick={()=>{UpdateCurrentValue(100);
                        props.changePercentage(100);
                    }}>
                        100%
                    </div>
                </div>
            </div>
            <div style={{margin:"30px 0px", width:"100%"}}>
                <input className='slider' type='range' style={{width:"100%"}} value={currentValue} onChange={(e)=>{
                    UpdateCurrentValue(e.target.value);
                    props.changePercentage(Number(e.target.value));
                }}/>
            </div>
        </div>
    )
}