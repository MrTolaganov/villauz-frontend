import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../types";

type UserSliceType = {
  user: UserType;
};
const initialState: UserSliceType = {
  user: {} as UserType,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
