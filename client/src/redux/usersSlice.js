import {createSlice} from '@reduxjs/toolkit'
const usersSlice=createSlice({
    name:'users',
    initialState:{
        user:null,
        allUsers:[],
        notifications:[]
    },
    reducers:{
        setUser(state,action){
            state.user=action.payload
        },
        setAllUsers(state,action){
            state.allUsers=action.payload
        },
        setNotifications(state,action){
            state.notifications=action.payload
        }
    }
})

export const{setUser,setAllUsers,setNotifications}=usersSlice.actions
export default usersSlice.reducer