import { createSlice } from "@reduxjs/toolkit";


const SwapSlice = createSlice({
    name:"Swap",
    initialState:{
        token0:"",
        token1:"",
        poolAddress:""
    },
    reducers:{
        setoken0 : (state,action)=>{
            state.token0 = action.payload;
        },
        setoken1 : (state,action)=>{
            state.token1 = action.payload;
        },
        setPoolAddress: (state,action)=>{
            state.poolAddress = action.payload;
        }
    }
})

export default SwapSlice;
export const { setoken0,setoken1 } = SwapSlice.actions;