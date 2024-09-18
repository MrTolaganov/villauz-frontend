import { HouseType, UserType } from "../types";

export const initialUserDataState: UserType = {
  id: "",
  username: "",
  email: "",
  phone: "+998",
  password: "",
};

export const initialHouseDataState: HouseType = {
  id: "",
  label: "",
  body: "",
  price: 0,
  owner: {} as UserType,
};
