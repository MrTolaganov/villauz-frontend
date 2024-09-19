import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import Auth from "./pages/auth";
import { Avatar, Box, Container, ThemeProvider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { darkTheme, lightTheme } from "./lib/theme";
import { Alert, Snackbar } from "@mui/material";
import { setOpenedSnack } from "./slices/snackbar.slice";
import $axios from "./http/axios";
import { setUser } from "./slices/user.slice";
import { setIsAuth } from "./slices/authstate.slice";
import { useEffect } from "react";
import { setHouseState, setOpenedDialog } from "./slices/house.slice";
import HouseDialog from "./components/house-dialog";
import Activation from "./pages/activation";
import { UserType } from "./types";
import Recovery from "./pages/recovery";

export default function App() {
  const { theme } = useSelector((state: RootState) => state.theme);
  const { openedSnack, snackMessage, severity } = useSelector((state: RootState) => state.snackbar);
  const { isAuth } = useSelector((state: RootState) => state.authState);
  const { user } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  const checkAuth = async () => {
    try {
      const { data } = await $axios.get("/auth/refresh");
      dispatch(setUser(data.user as UserType));
      dispatch(setIsAuth(true));
      localStorage.setItem("accessToken", data.accessToken);
      return data;
    } catch {
      dispatch(setIsAuth(false));
      localStorage.removeItem("accessToken");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      checkAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
      <Box sx={{ bgcolor: "primary.main" }} className="min-h-screen">
        <Container fixed>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/activation" element={<Activation />} />
            <Route path="/rec-acc/:token" element={<Recovery />} />
          </Routes>
        </Container>
        <Snackbar
          open={openedSnack}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => dispatch(setOpenedSnack(false))}
          autoHideDuration={3000}
        >
          <Alert severity={severity} onClose={() => dispatch(setOpenedSnack(false))}>
            {snackMessage}
          </Alert>
        </Snackbar>
        {isAuth && (
          <span
            className="relative cursor-pointer"
            onClick={() => {
              dispatch(setHouseState("add"));
              dispatch(setOpenedDialog(true));
            }}
          >
            <Avatar
              sx={{
                bgcolor: "green",
                position: "fixed",
                bottom: 20,
                right: 20,
                width: 50,
                height: 50,
                fontSize: 32,
              }}
            >
              +
            </Avatar>
          </span>
        )}
      </Box>
      <HouseDialog />
    </ThemeProvider>
  );
}
