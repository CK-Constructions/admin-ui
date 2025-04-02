import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setAuthHeader, clearAuthHeader } from "../../api";

type User = {
  id: number;
  username: string;
  fullname: string;
  address: string;
  phone: string;
  email: string;
  token: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
};

const initialState: AuthState = { user: null, token: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<User>
    ) => {
      state.user = action.payload;
      state.token = action.payload.token;
      setAuthHeader(action.payload.token);
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

export const selectCurrentAuth = (state: RootState) =>
  state.auth;
