import { createSlice } from "@reduxjs/toolkit";

const UserInfoSlice = createSlice({
    name:"user",
    initialState:{
        etherBalance:0,
    },
    reducers:{

        updateBalance:(state,payload)=>{
            state.balance = payload;
        }
    }

})


export default UserInfoSlice;
export const {updateBalance} = UserInfoSlice.actions;