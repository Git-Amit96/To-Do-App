import { createSlice } from "@reduxjs/toolkit";

const taskSlice= createSlice({
    name: 'task',
    initialState: {
        data: null,
    },
    reducers:{
        addTasks: (state, action)=>{
            state.data= action.payload;
        },
        clearTasks:(state)=>{
            state.data= null;
        }
    }
});

export const {addTasks, clearTasks}= taskSlice.actions;
export default taskSlice.reducer;