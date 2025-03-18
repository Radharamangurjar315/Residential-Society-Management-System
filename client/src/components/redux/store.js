import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; // Ensure correct reducer path

export const store = configureStore({
    reducer: {
        auth: authReducer, // Add your reducers here
    },
});
