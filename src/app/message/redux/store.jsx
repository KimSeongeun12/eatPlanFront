import {configureStore} from "@reduxjs/toolkit";
import MsgSelectSlice from './msgslice.jsx'

const Store = configureStore({

    reducer: {
        msg_select: MsgSelectSlice
    }
})

export default Store;