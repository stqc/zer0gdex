import { getLiqudityPairOfUser } from "../../ContractInteractions/LiquidityPositionsManagement"
import { useEffect,useState } from "react";
import "./Manage.css";
import { SingePosition } from "./SinglePosition";
import { ManagePanel } from "./ManagePanel";

export const ManageState = {}

export const Manage = () => {

    const [Positions, setPositions] = useState([]);
    const [manageSinglePosition,updateManageSinglePosition] = useState(false);

    ManageState['positions']={'action':setPositions}

    useEffect(() => {
        const fetchPositions = async () => {
            const positions = await getLiqudityPairOfUser();
            setPositions(positions);
        }
        fetchPositions();

    },[])
    
    useEffect(()=>{
        console.log(Positions);
    },[Positions])

    return (
        <div style={{maxWidth:"1080px", margin:"auto"}}>      
            
            {!manageSinglePosition && Positions.map((position,index) => {
                    return <SingePosition
                        key={index}
                        id={position.tokenId}
                        token0={position.token0}
                        token1={position.token1}
                        fee={position.fee}
                        tickLower={position.tickLower}
                        tickUpper={position.tickUpper}
                        tokensOwed0={position.tokensOwed0}
                        tokensOwed1={position.tokensOwed1}
                        liquidity0 = {position.liquidityToken0}
                        liquidity1 = {position.liquidityToken1}
                        showManage = {updateManageSinglePosition}
                        token0Add = {position.tokenAdd0}
                        token1Add = {position.tokenAdd1}
                        liquidity = {position.liquidity}
                        currentTick = {position.currentTick}
                    />

                        }
                    )
            }  
            {
                manageSinglePosition &&
                <ManagePanel showManage={updateManageSinglePosition}/>
            } 
        </div>
    )

}
