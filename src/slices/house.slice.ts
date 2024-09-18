import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HouseType } from "../types";

type InitialType = {
  houseState: "add" | "edit";
  openedDialog: boolean;
  house: HouseType;
  houses: HouseType[];
};

const initialState: InitialType = {
  houseState: "add",
  openedDialog: false,
  house: {} as HouseType,
  houses: [],
};

const houseSlice = createSlice({
  name: "house",
  initialState,
  reducers: {
    setHouseState: (state, action: PayloadAction<"add" | "edit">) => {
      state.houseState = action.payload;
    },
    setOpenedDialog: (state, action: PayloadAction<boolean>) => {
      state.openedDialog = action.payload;
    },
    setHouse: (state, action: PayloadAction<HouseType>) => {
      state.house = action.payload;
    },
    setHouses: (state, action: PayloadAction<HouseType[]>) => {
      state.houses = action.payload;
    },
  },
});

export const { setHouseState, setOpenedDialog, setHouse, setHouses } = houseSlice.actions;
export default houseSlice.reducer;
