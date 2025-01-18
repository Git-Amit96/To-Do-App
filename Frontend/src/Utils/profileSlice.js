import { createSlice } from "@reduxjs/toolkit";

const profileSlice= createSlice({
    name: 'profile',
    initialState:{
        id: '',
        name: '',
        email: '',
        isLoggedIn: false,
        pageInfo: '',
    },
    reducers:{
        setProfile:(state, action)=>{
            const {name, email, id}= action.payload;
            state.id= id;
            state.name= name;
            state.email= email;
        },

        setLoginState:(state, action)=>{
            state.isLoggedIn= action.payload;
        },
        updatePage:(state, action)=>{
            state.pageInfo= action.payload;
        },

        clearProfile:(state)=>{
            state.name='';
            state.email='';
            state.isLoggedIn=false;
        }

    }
})

export const {setProfile, clearProfile, setLoginState, updatePage}= profileSlice.actions;
export default profileSlice.reducer;