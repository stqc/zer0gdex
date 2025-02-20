import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';
import { updateData } from '../../redux/MyPositonSlice';
import ZeroLogo from "../../Assets/zer0.svg";

export const SingePosition = (props) => {
    const dispatch = useDispatch();

    return (
        <div className="single-position">
            {/* Pair and Type Section */}
            <div className="token-info">
                <div className="token-logos">
                    <div className="logo-wrapper first-logo">
                        <img src={ZeroLogo} alt="Token 0" />
                    </div>
                    <div className="logo-wrapper second-logo">
                        <img src={ZeroLogo} alt="Token 1" />
                    </div>
                </div>
                <div className="token-details">
                    <div className="token-name">{props.token0[0]}/{props.token1[0]}</div>
                    <div className="token-fee">Fee {props.fee}%</div>
                </div>
            </div>

            {/* Range Section */}
            <div className="range-info">
                <div className="range-labels">
                    <span>min</span>
                    <span className="range-arrow">↔</span>
                    <span>max</span>
                </div>
                <div className="range-values">
                    <span>{props.tickLower}</span>
                    <span>{props.tickUpper}</span>
                </div>
                <div className={`range-status ${1.0001**Number(props.tickLower)<1.0001**Number(props.currentTick) && 1.0001**Number(props.currentTick)<1.0001**Number(props.tickUpper) ?"status badge receiving-rewards":"out-of-range"}`}>{1.0001**Number(props.tickLower)<1.0001**Number(props.currentTick) && 1.0001**Number(props.currentTick)<1.0001**Number(props.tickUpper) ?"In Range":"• Out of Range"}</div>
            </div>

            {/* Position Size Section */}
            <div className="position-info">
                <div className="position-value">
                    <div className="main-value">Position Size</div>
                    <div className="sub-values">
                        <div>{Number(ethers.formatUnits(props.liquidity0, props.token0[1])).toFixed(2)} {props.token0[0]}</div>
                        <div>{Number(ethers.formatUnits(props.liquidity1, props.token1[1])).toFixed(2)} {props.token1[0]}</div>
                    </div>
                </div>
            </div>

            {/* Rewards Section */}
            <div className="rewards-info">
                <div className="reward-value">
                    <div className="main-value">Rewards</div>
                    <div className="sub-values">
                        <div>{Number(props.tokensOwed0).toFixed(2)} {props.token0[0]}</div>
                        <div>{Number(props.tokensOwed1).toFixed(2)} {props.token1[0]}</div>
                    </div>
                </div>
            </div>

            {/* Status Section */}
            <div className="status-info">
                <div className={`status-badge ${1.0001**Number(props.tickLower)<1.0001**Number(props.currentTick) && 1.0001**Number(props.currentTick)<1.0001**Number(props.tickUpper) ?"receiving-rewards":"out-of-range"}`}>
                    {1.0001**Number(props.tickLower)<1.0001**Number(props.currentTick) && 1.0001**Number(props.currentTick)<1.0001**Number(props.tickUpper) ?"Receiving Rewards":"Out of Range"}
                </div>
            </div>

            {/* Action Button */}
            <div className="action-section">
                <button className="deposit-button" onClick={() => {
                    props.showManage(true);
                    dispatch(updateData({
                        token0: props.token0[0],
                        token1: props.token1[0],
                        tickLeft: props.tickLower,
                        tickRight: props.tickUpper,
                        token0Add: props.token0Add,
                        token1Add: props.token1Add,
                        NFTid: props.id,
                        liquidity: ethers.formatEther(props.liquidity),
                        token0owed: props.tokensOwed0,
                        token1owed: props.tokensOwed1
                    }))
                }}>
                    Manage
                </button>
            </div>
        </div>
    );
};