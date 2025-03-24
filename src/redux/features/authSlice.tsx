import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { setAuthHeader, clearAuthHeader } from "../../api";

type TAuthState = {
    user: {
        id: number;
        name: string;
        email: string;
        mobile: string;
        image: string | null;
        role: number;
        role_name: string;
        clinic: number;
        clinic_name: string;

        token: string;
        logo: string | null;
    } | null;
    token: string | null;
};

const initialState: TAuthState = { user: null, token: null };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const user = action.payload;
            state.user = user;
            state.token = user.token;
            setAuthHeader(user.token);
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            clearAuthHeader();
        },
    },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentAuth = (state: RootState) => state.auth;
