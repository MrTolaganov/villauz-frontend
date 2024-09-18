import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

type SnackbarType = {
  openedSnack: boolean;
  snackMessage: string;
  severity: "success" | "error" | "info" | "warning";
};

const initialState: SnackbarType = {
  openedSnack: false,
  snackMessage: "",
  severity: "success",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setOpenedSnack: (state, action: PayloadAction<boolean>) => {
      state.openedSnack = action.payload;
    },
    setSnackMessage: (state, action: PayloadAction<string>) => {
      state.snackMessage = action.payload;
    },
    setSeverity: (state, action: PayloadAction<"success" | "error" | "info" | "warning">) => {
      state.severity = action.payload;
    },
  },
});

export const { setOpenedSnack, setSnackMessage, setSeverity } = snackbarSlice.actions;
export default snackbarSlice.reducer;
