import React, { useState } from 'react';
import './InputComponent.css';

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
            <input style={{fontSize:"1.8rem",width:"100%" ,backgroundColor:"transparent", border:0, color:"black"}} placeholder='Enter Amount' type="number" onChange={(e)=>{
                props.updateTokenAmount(e.target.value);
            }}>
            </input>
            <div>
                <h5>{props.name}</h5>
            </div>
        </div>
    )
}

export const RemoveLiquidityElements =(props)=>{
    const [currentValue,UpdateCurrentValue] = useState(props.defVal)
    return (
        <div style={{display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"top"}}>
                <h3 style={{margin:0}}>{currentValue}%</h3>
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