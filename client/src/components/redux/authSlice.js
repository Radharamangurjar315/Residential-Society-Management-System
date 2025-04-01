import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    societyId: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.user; // Contains role info
            state.token = action.payload.token;
            state.societyId = action.payload.societyId; // Assuming societyId is part of the payload


        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.societyId = null; // Reset societyId on logout
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
