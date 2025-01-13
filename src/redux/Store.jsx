import { configureStore } from "@reduxjs/toolkit";
import liqudityTokenSelector from "./liquidityTokenSelectorSlice";
import SwapSlice from "./SwapSlice";

const Store = configureStore({
    reducer:{
        liquidityToken: liqudityTokenSelector.reducer,
        swapReducer : SwapSlice.reducer,
    }
})

export default Store;