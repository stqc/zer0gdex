import { createSlice } from "@reduxjs/toolkit";


const liqudityTokenSelector = createSlice({
    name:"liquidityTokenSelector",
    initialState:{
        tokenA:"",
        tokenB:"",
        feeTier:3000,
        tokenAamount:0,
        tokenBamount:0,
        lowerTick:0,
        upperTick:0,
        spacing:60,
    },
    reducers:{
        setTokenA: (state,action)=>{
            state.tokenA = action.payload;
        },
        setTokenB: (state,action)=>{
            state.tokenB = action.payload;
        },
        setFeeTier: (state,action)=>{
            state.feeTier = action.payload;
        },
        setTokenAamount: (state,action)=>{
            state.tokenAamount = action.payload;
        },
        setTokenBamount: (state,action)=>{
            state.tokenBamount = action.payload;
        },
        setLowerTick: (state,action)=>{
            state.lowerTick = action.payload;
            console.log(state.lowerTick);
        },
        setUpperTick: (state,action)=>{
            state.upperTick = action.payload;
            console.log(state.upperTick);
        },
        setSpacing: (state,action)=>{
            state.spacing = action.payload;
        }
    }
})


export default liqudityTokenSelector;
export const {setTokenA,setTokenB,setFeeTier,setSpacing,setTokenAamount,setTokenBamount,setLowerTick,setUpperTick} = liqudityTokenSelector.actions;