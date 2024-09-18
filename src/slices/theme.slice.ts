import { createSlice } from "@reduxjs/toolkit";

type ThemeType = {
  theme: "dark" | "light";
};

const initialState: ThemeType = {
  theme: JSON.parse(localStorage.getItem("villauz-theme")!)
    ? (JSON.parse(localStorage.getItem("villauz-theme")!) as "dark" | "light")
    : "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: state => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
