import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "../Utils/profileSlice.js";
import taskReducer from "../Utils/taskSlice.js";


const Store= configureStore({
    reducer:{
        profile: profileReducer,
        task: taskReducer,
    }
})

export default Store;