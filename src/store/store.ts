import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../slices/theme.slice";
import authStateReducer from "../slices/authstate.slice";
import snackbarReducer from "../slices/snackbar.slice";
import userReducer from "../slices/user.slice";
import houseReducer from "../slices/house.slice";
import currencyReducer from "../slices/currency.slice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    authState: authStateReducer,
    snackbar: snackbarReducer,
    user: userReducer,
    house: houseReducer,
    currency: currencyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
