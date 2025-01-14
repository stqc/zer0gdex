import { configureStore } from "@reduxjs/toolkit";
import liqudityTokenSelector from "./liquidityTokenSelectorSlice";
import SwapSlice from "./SwapSlice";
import MyPositionSlice from "./MyPositonSlice";

const Store = configureStore({
    reducer:{
        liquidityToken: liqudityTokenSelector.reducer,
        swapReducer : SwapSlice.reducer,
        ManageSinglePositionReducer: MyPositionSlice.reducer,
    }
})

export default Store;