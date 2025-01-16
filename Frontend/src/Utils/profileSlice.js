import { createSlice } from "@reduxjs/toolkit";

const profileSlice= createSlice({
    name: 'profile',
    initialState:{
        id: '',
        name: '',
        email: '',
        isLoggedIn: false,
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

        clearProfile:(state)=>{
            state.name='';
            state.email='';
            state.isLoggedIn=false;
        }

    }
})

export const {setProfile, clearProfile, setLoginState}= profileSlice.actions;
export default profileSlice.reducer;