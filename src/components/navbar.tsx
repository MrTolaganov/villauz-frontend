import { Avatar, Box, Button, Container, Popover, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import WbSunnySharpIcon from "@mui/icons-material/WbSunnySharp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import NightsStaySharpIcon from "@mui/icons-material/NightsStaySharp";
import { toggleTheme } from "../slices/theme.slice";
import { setAuthState, setIsAuth, setIsOpen } from "../slices/authstate.slice";
import { ChangeEvent, MouseEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import $axios from "../http/axios";
import { setUser } from "../slices/user.slice";
import { setOpenedSnack, setSeverity } from "../slices/snackbar.slice";
import { AxiosError } from "axios";
import { UserType } from "../types";
import { setCurrency, setCurVal } from "../slices/currency.slice";

export default function Navbar() {
  const { theme } = useSelector((state: RootState) => state.theme);
  const { isAuth } = useSelector((state: RootState) => state.authState);
  const { user } = useSelector((state: RootState) => state.user);
  const { currency } = useSelector((state: RootState) => state.currency);
  const [openedPopover, setOpenedPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const { data } = await $axios.delete("/auth/signout");
      return data;
    },
    onSuccess: () => {
      dispatch(setIsAuth(false));
      dispatch(setUser({} as UserType));
      localStorage.removeItem("accessToken");
      navigate("/auth");
      setOpenedPopover(false);
    },
    onError: (error: AxiosError) => {
      dispatch(setOpenedSnack(true));
      dispatch(setSeverity("error"));
      // @ts-ignore
      dispatch(setSnackMessage(error.response.data.message!));
    },
  });

  return (
    <Box
      sx={{
        color: "primary.contrastText",
        height: "10vh",
        position: "fixed",
        bgcolor: "primary.main",
        zIndex: 100,
        inset: 0,
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid green",
        }}
      >
        <Box>
          <Link to={"/"}>
            <img src="/villauz-logo.png" alt="Villauz" width={150} height={150} />
          </Link>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <div
            className="cursor-pointer"
            onClick={() => {
              dispatch(toggleTheme());
              localStorage.setItem(
                "villauz-theme",
                JSON.stringify(theme === "dark" ? "light" : "dark")
              );
            }}
          >
            {theme === "dark" ? <WbSunnySharpIcon /> : <NightsStaySharpIcon />}
          </div>
          {isAuth ? (
            <>
              {user.activated && (
                <select
                  id="currency"
                  className="p-2 bg-inherit border-2 border-green-500 text-green-500"
                  value={currency}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    dispatch(setCurrency(e.target.value! as "usd" | "eur" | "uzs"));
                    dispatch(setCurVal());
                  }}
                >
                  <option value="usd" className={`${currency === "usd" && "hidden"}`}>
                    USD
                  </option>
                  <option value="eur" className={`${currency === "eur" && "hidden"}`}>
                    EUR
                  </option>
                  <option value="uzs" className={`${currency === "uzs" && "hidden"}`}>
                    UZS
                  </option>
                </select>
              )}
              <span
                onClick={(e: MouseEvent<HTMLSpanElement>) => {
                  setAnchorEl(e.currentTarget);
                  setOpenedPopover(true);
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
                      Math.random() * 255
                    })`,
                    cursor: "pointer",
                  }}
                >
                  {user?.username?.at(0)?.toUpperCase()}
                </Avatar>
              </span>
              <Popover
                open={openedPopover}
                onClose={() => setOpenedPopover(false)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                anchorEl={anchorEl}
              >
                <Typography sx={{ p: 1, borderBottom: "1px solid green" }}>
                  @{user?.username}
                </Typography>
                <Typography sx={{ p: 1, borderBottom: "1px solid green" }}>
                  {user?.email}
                </Typography>
                <Typography sx={{ p: 1, borderBottom: "1px solid green" }}>
                  {user?.phone}
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ margin: 1 }}
                    onClick={() => mutate()}
                  >
                    Sign out
                  </Button>
                </Box>
              </Popover>
            </>
          ) : (
            <>
              <Button
                sx={{ bgcolor: "green" }}
                onClick={() => {
                  dispatch(setAuthState("signin"));
                  dispatch(setIsOpen(true));
                  navigate("/auth");
                }}
              >
                Sign in
              </Button>
              <Button
                variant="contained"
                sx={{ color: "green" }}
                onClick={() => {
                  dispatch(setAuthState("signup"));
                  dispatch(setIsOpen(true));
                  navigate("/auth");
                }}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}
