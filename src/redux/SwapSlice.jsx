import { createSlice } from "@reduxjs/toolkit";


const SwapSlice = createSlice({
    name:"Swap",
    initialState:{
        token0:"",
        token1:""
    },
    reducers:{
        setoken0 : (state,action)=>{
            state.token0 = action.payload;
        },
        setoken1 : (state,action)=>{
            state.token1 = action.payload;
        }
    }
})

export default SwapSlice;
export const { setoken0,setoken1 } = SwapSlice.actions;