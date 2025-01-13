import { getLiqudityPairOfUser } from "../../ContractInteractions/LiquidityPositionsManagement"
import { useEffect,useState } from "react";
import "./Manage.css";
import { SingePosition } from "./SinglePosition";

export const Manage = () => {

    const [Positions, setPositions] = useState([]);

    useEffect(() => {
        const fetchPositions = async () => {
            const positions = await getLiqudityPairOfUser();
            setPositions(positions);
        }
        fetchPositions();
    },[])

    return (
        <div>      
            
            {Positions.map((position,index) => {
                    return <SingePosition
                        key={index+position.tokenId}
                        token0={position.token0}
                        token1={position.token1}
                        fee={position.fee}
                        tickLower={position.tickLower}
                        tickUpper={position.tickUpper}
                        tokensOwed0={position.tokensOwed0}
                        tokensOwed1={position.tokensOwed1}
                        liquidity0 = {position.liquidityToken0}
                        liquidity1 = {position.liquidityToken1}
                    />

                        }
                    )
            }   
        </div>
    )

}
