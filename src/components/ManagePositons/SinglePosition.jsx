import {ethers} from 'ethers';

export const SingePosition = (props) => {

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
                <p>Size: {Number(ethers.formatUnits(props.liquidity0,props.token0[1])).toFixed(3)}<br/>{Number(ethers.formatUnits(props.liquidity1,props.token1[1])).toFixed(3)}</p>
            </div>
            <div className="reward">
                <p>Reward: {props.tokensOwed0} - {props.tokensOwed1}</p>
            </div>
            <div className="status">
                <p>Status: {props.status}</p>
            </div>
            <div className="action">
                <button>Manage</button>
            </div>
        </div>
    )
};