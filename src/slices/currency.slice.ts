import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CurrencySliceType = {
  currency: "usd" | "eur" | "uzs";
  curVal: number;
};

const initialState: CurrencySliceType = {
  currency: "usd",
  curVal: 1,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<"usd" | "eur" | "uzs">) => {
      state.currency = action.payload;
    },

    setCurVal: state => {
      if (state.currency === "eur") {
        state.curVal = 0.91;
      } else if (state.currency === "uzs") {
        state.curVal = 12760;
      } else {
        state.curVal = 1;
      }
    },
  },
});

export const { setCurrency, setCurVal } = currencySlice.actions;
export default currencySlice.reducer;
