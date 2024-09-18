import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type AuthStateType = {
  authState: "signin" | "signup" | "forgot-pass";
  isAuth: boolean;
  isOpen: boolean;
  passState: "hide" | "show";
};

const initialState: AuthStateType = {
  authState: "signin",
  isAuth: localStorage.getItem("accessToken") ? true : false,
  isOpen: false,
  passState: "hide",
};

const authStateSlice = createSlice({
  name: "authState",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<"signin" | "signup" | "forgot-pass">) => {
      state.authState = action.payload;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setPassState: (state, action: PayloadAction<"hide" | "show">) => {
      state.passState = action.payload;
    },
  },
});

export const { setAuthState, setIsAuth, setIsOpen, setPassState } = authStateSlice.actions;
export default authStateSlice.reducer;
