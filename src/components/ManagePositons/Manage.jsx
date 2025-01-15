import { getLiqudityPairOfUser } from "../../ContractInteractions/LiquidityPositionsManagement"
import { useEffect,useState } from "react";
import "./Manage.css";
import { SingePosition } from "./SinglePosition";
import { ManagePanel } from "./ManagePanel";

export const Manage = () => {

    const [Positions, setPositions] = useState([]);
    const [manageSinglePosition,updateManageSinglePosition] = useState(false);

    useEffect(() => {
        const fetchPositions = async () => {
            const positions = await getLiqudityPairOfUser();
            setPositions(positions);
        }
        fetchPositions();
    },[])

    return (
        <div>      
            
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
