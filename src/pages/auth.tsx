import { Alert, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "../store/store";
import { ChangeEvent, useEffect, useState } from "react";
import { UserType } from "../types";
import { initialUserDataState } from "../constants";
import { useNavigate } from "react-router-dom";
import { setAuthState, setIsAuth, setIsOpen, setPassState } from "../slices/authstate.slice";
import { setOpenedSnack, setSeverity, setSnackMessage } from "../slices/snackbar.slice";
import { AxiosError } from "axios";
import $axios from "../http/axios";
import { setUser } from "../slices/user.slice";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { authState, isOpen, passState, isAuth } = useSelector(
    (state: RootState) => state.authState
  );
  const { theme } = useSelector((state: RootState) => state.theme);
  const [userData, setUserData] = useState<UserType>(initialUserDataState);
  const [sended, setSended] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationKey: ["auth"],
    mutationFn: async (values: UserType) => {
      setIsLoading(true);
      if (authState === "signin") {
        const { data } = await $axios.post("/auth/signin", {
          email: values.email,
          pass: values.password,
        });
        return data;
      }
      if (authState === "signup") {
        const { data } = await $axios.post("/auth/signup", {
          username: values.username,
          email: values.email,
          phone: values.phone,
          pass: values.password,
        });
        return data;
      }
      if (authState === "forgot-pass") {
        console.log(userData.email);

        const { data } = await $axios.post("/auth/forgot-pass", { email: userData.email });
        return data;
      }
    },
    onSuccess: data => {
      setIsLoading(false);
      if (authState === "signin" || authState === "signup") {
        dispatch(setIsAuth(true));
        dispatch(setIsOpen(false));
        dispatch(setUser({ ...data.user } as UserType));
        localStorage.setItem("accessToken", data.accessToken);
        if (!data.user.activated) {
          navigate("/activation");
        } else {
          navigate("/");
          dispatch(setOpenedSnack(true));
          dispatch(setSeverity("success"));
          dispatch(
            setSnackMessage(`User signed ${authState === "signin" ? "in" : "up"} successfully`)
          );
        }
      } else {
        setSended(true);
        dispatch(setOpenedSnack(true));
        dispatch(setSeverity("success"));
        dispatch(setSnackMessage(`Recovery Account has just sended this ${userData.email} email`));
      }
    },
    onError: (err: AxiosError) => {
      setIsLoading(false);
      dispatch(setOpenedSnack(true));
      dispatch(setSeverity("error"));
      // @ts-ignore
      dispatch(setSnackMessage(err.response.data.message!));
    },
  });

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(userData);
  };

  const handleCloseDialog = () => {
    dispatch(setIsOpen(false));
    navigate("/");
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    } else {
      dispatch(setIsOpen(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <main className="h-[90vh] mt-[10vh]">
      <Dialog open={isOpen} onClose={handleCloseDialog} fullWidth>
        <DialogContent sx={{ bgcolor: "primary.main" }}>
          <DialogTitle sx={{ color: "greenyellow", textAlign: "center" }}>
            {authState === "signin" && "Sign in"}
            {authState === "signup" && "Sign up"}
            {authState === "forgot-pass" && "Forgot password"}
          </DialogTitle>
          <form action="" className="flex flex-col gap-2 items-center" onSubmit={handleSubmit}>
            {authState === "signup" && (
              <div
                className={`w-full md:w-3/4 flex flex-col ${
                  theme === "dark" ? "dark:text-white" : "text-black"
                } gap-1`}
              >
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
                  value={userData.username}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserData({ ...userData, username: e.target.value! })
                  }
                />
              </div>
            )}
            <div
              className={`w-full md:w-3/4 flex flex-col ${
                theme === "dark" ? "dark:text-white" : "text-black"
              } gap-1`}
            >
              {sended && (
                <Alert severity={"info"}>
                  Please check your email address and click the recover account button to recover
                  your account
                </Alert>
              )}
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                disabled={sended}
                className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
                value={userData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUserData({ ...userData, email: e.target.value! })
                }
              />
            </div>
            {authState === "signup" && (
              <div
                className={`w-full md:w-3/4 flex flex-col ${
                  theme === "dark" ? "dark:text-white" : "text-black"
                } gap-1`}
              >
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
                  value={userData.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserData({ ...userData, phone: e.target.value! })
                  }
                />
              </div>
            )}
            {(authState === "signin" || authState === "signup") && (
              <div
                className={`w-full md:w-3/4 flex flex-col ${
                  theme === "dark" ? "dark:text-white" : "text-black"
                } gap-1`}
              >
                <label htmlFor="password">Password</label>
                <input
                  type={passState === "hide" ? "password" : "text"}
                  id="password"
                  className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
                  value={userData.password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setUserData({ ...userData, password: e.target.value! })
                  }
                />
                <div className="space-x-1">
                  <input
                    type="checkbox"
                    id="pass-state"
                    className="accent-green-500"
                    checked={passState === "show" ? true : false}
                    onChange={() => dispatch(setPassState(passState === "hide" ? "show" : "hide"))}
                  />
                  <label
                    htmlFor="pass-state"
                    className={`${theme === "dark" ? "text-white" : "text-black"}`}
                  >
                    {passState === "hide" ? "Show " : "Hide "}password
                  </label>
                </div>
              </div>
            )}
            {(authState === "signin" || authState === "signup") && (
              <div className="flex flex-col items-start text-sm w-full md:w-3/4">
                <div className="space-x-1">
                  <span className={`${theme === "dark" ? "text-white" : "text-black"}`}>
                    {authState === "signin" ? "Don't have " : "Have "}an account?
                  </span>
                  <span
                    className="cursor-pointer text-green-500 underline"
                    onClick={() =>
                      dispatch(setAuthState(authState === "signin" ? "signup" : "signin"))
                    }
                  >
                    {authState === "signin" ? "Sign up" : "Sign in"}
                  </span>
                </div>
                {authState === "signin" && (
                  <p
                    className="cursor-pointer text-green-500 underline"
                    onClick={() => dispatch(setAuthState("forgot-pass"))}
                  >
                    Forgot password?
                  </p>
                )}
              </div>
            )}
            <div className="w-full md:w-3/4">
              <Button
                fullWidth
                type="submit"
                color="success"
                variant="contained"
                disabled={isLoading}
                sx={{ marginTop: 2 }}
              >
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
