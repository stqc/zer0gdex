import {ethers} from 'ethers';
import { useDispatch } from 'react-redux';
import { updateData } from '../../redux/MyPositonSlice';
import ZeroLogo from "../../Assets/zer0.svg";

export const SingePosition = (props) => {

    const dispatch = useDispatch();

    return (
        <div className="single-position">
            <div className="name-fee">
                <div className='position-logo' style={{ display:"flex",flexDirection:"row", position:"relative"}}>
                    <div style={{height:"50px", height:"50px"}}>
                        <img src={ZeroLogo} height={"100%"} width={"100%"}/>
                    </div>
                    <div style={{height:"50px", height:"50px"}}>
                        <img src={ZeroLogo} height={"100%"} width={"100%"}/>
                    </div>
                </div>
                <div>
                    <p className='position-name-fee'>{props.token0[0]}/{props.token1[0]}</p>
                    <p className='position-name-fee' style={{color:"#A591A4"}}>Fee: {props.fee}</p>
                </div>
            </div>
            <div className="range">
                <p className='info-heading'>Tick Range</p>
                <div style={{display:"flex", width:"150px", width:"100%"}}>
                    <div style={{display:"flex",justifyContent:"space-between", flexDirection:"column", width:"100%", alignItems:"center",justifyContent:"space-between"}}>
                        <p className='max-min-range'>min</p>
                        <p className='max-min-range value-range'>{props.tickLower}</p>
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between",  flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"space-between"}}> 
                        <p className='max-min-range'>max</p>  
                        <p className='max-min-range value-range'>{props.tickUpper}</p>
                    </div>
                </div>
            </div>
            <div className="position-size">
                <p className='info-heading'>Size</p>
                <p className='position-size-value' >{Number(ethers.formatUnits(props.liquidity0,props.token0[1])).toFixed(3)} {props.token0[0]}</p>
                <p className='position-size-value'>{Number(ethers.formatUnits(props.liquidity1,props.token1[1])).toFixed(3)} {props.token1[0]}</p>
            </div>
            <div className="position-size">
                <p className='info-heading'>Reward</p>
                <p className='position-size-value'>{Number(props.tokensOwed0).toFixed(3)} {props.token0[0]}</p>
                <p className='position-size-value'>{Number(props.tokensOwed1).toFixed(3)} {props.token1[0]}</p>
            </div>
            <div className="position-size">
                <p className='info-heading'>Status</p>
                <p className='position-size-value'> {props.status}</p>
            </div>
            <div className="action">
                <button onClick={()=>{
                    props.showManage(true);
                    dispatch(updateData({
                        token0:props.token0[0],
                        token1:props.token1[0],
                        tickLeft:props.tickLower,
                        tickRight:props.tickUpper,
                        token0Add:props.token0Add,
                        token1Add:props.token1Add,
                        NFTid: props.id,
                        liquidity: ethers.formatEther(props.liquidity)
                    }))
                }}>Manage</button>
            </div>
        </div>
    )
};