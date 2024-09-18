export type UserType = {
  id: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  activated?: boolean;
};

export type HouseType = {
  id: string;
  label: string;
  image?: string;
  body: string;
  price: number;
  owner: UserType;
};

export type PassValType = {
  newPass: string;
  confirmPass: string;
};
