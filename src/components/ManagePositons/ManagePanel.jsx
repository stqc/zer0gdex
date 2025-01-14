import "./Manage.css";
import { LeftPaneManage,RightPaneManage } from "./LeftPaneManage";
import { useSelector } from "react-redux";
export const ManagePanel =()=>{
    const currentData = useSelector(state=>state.ManageSinglePositionReducer)
    return (
        
        <div className="main-manage-panel">
            <LeftPaneManage props={currentData}/>
            <RightPaneManage props={currentData}/>
        </div>
    )


}