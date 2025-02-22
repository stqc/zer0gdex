import { createSlice } from "@reduxjs/toolkit"


const MyPositionSlice = createSlice({
    name:"singlePositionData",
    initialState:{
        token0:"",
        token1:"",
        tickLeft:"",
        tickRight:"",
        token0Add:"",
        token1Add:"",
        NFTid:"",
        liquidity:0,
        token0owed:0,
        token1owed:0
    },
    reducers:{
        updateData:(state,payload)=>{
            state.NFTid = payload.payload.NFTid;
            state.token0 = payload.payload.token0;
            state.token1 = payload.payload.token1;
            state.tickLeft = payload.payload.tickLeft;
            state.tickRight = payload.payload.tickRight;
            state.token0Add = payload.payload.token0Add;
            state.token1Add = payload.payload.token1Add;
            state.liquidity = payload.payload.liquidity;
            state.token0owed = payload.payload.token0owed;
            state.token1owed = payload.payload.token1owed
        },

        
    }
})

export default MyPositionSlice;
export const {updateData} = MyPositionSlice.actions;