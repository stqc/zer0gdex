import {ethers} from 'ethers';
import { useDispatch } from 'react-redux';
import { updateData } from '../../redux/MyPositonSlice';

export const SingePosition = (props) => {

    const dispatch = useDispatch();

    return (
        <div className="single-position">
            <div className="name-fee">
                <p>{props.token0[0]} - {props.token1[0]}</p>
                <p>Fee: {props.fee}</p>
            </div>
            <div className="range">
                <p>Range: {props.tickLower} - {props.tickUpper}</p>
            </div>
            <div className="position-size">
                <p>Size: <br/>Token 0: {Number(ethers.formatUnits(props.liquidity0,props.token0[1])).toFixed(3)} Token 1: {Number(ethers.formatUnits(props.liquidity1,props.token1[1])).toFixed(3)}</p>
            </div>
            <div className="reward">
                <p>Reward: {props.tokensOwed0} - {props.tokensOwed1}</p>
            </div>
            <div className="status">
                <p>Status: {props.status}</p>
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