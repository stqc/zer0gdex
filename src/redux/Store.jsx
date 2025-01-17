import { configureStore } from "@reduxjs/toolkit";
import liqudityTokenSelector from "./liquidityTokenSelectorSlice";
import SwapSlice from "./SwapSlice";
import MyPositionSlice from "./MyPositonSlice";
import UserInfoSlice from "./CurrentAddressSlice";

const Store = configureStore({
    reducer:{
        liquidityToken: liqudityTokenSelector.reducer,
        swapReducer : SwapSlice.reducer,
        ManageSinglePositionReducer: MyPositionSlice.reducer,
        userInfo : UserInfoSlice.reducer
    }
})

export default Store;