import {createSlice} from "@reduxjs/toolkit";

const MsgSelectSlice = createSlice({
    name:'msg_select',
    // 초기값
    initialState:{
        list:[],
    },
    // States
    reducers:{
        setList:(state,payload)=>{
            state.list=payload;
            return state;
        },
        del:(state,payload)=>{
            console.log('del called',state, payload);
        }
    }
})

export default MsgSelectSlice.reducer;