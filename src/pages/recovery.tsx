import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { PassValType } from "../types";
import { setAuthState, setPassState } from "../slices/authstate.slice";
import { setOpenedSnack, setSeverity, setSnackMessage } from "../slices/snackbar.slice";
import $axios from "../http/axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Recovery() {
  const { theme } = useSelector((state: RootState) => state.theme);
  const { passState } = useSelector((state: RootState) => state.authState);
  const [passVal, setPassVal] = useState<PassValType>({ newPass: "", confirmPass: "" });
  const [openRecDialog, setOpenedRecDialog] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!passVal.newPass.trim() || !passVal.confirmPass.trim()) {
      dispatch(setOpenedSnack(true));
      dispatch(setSeverity("error"));
      dispatch(setSnackMessage("Password must not be empty"));
      return;
    }
    if (passVal.newPass !== passVal.confirmPass) {
      dispatch(setOpenedSnack(true));
      dispatch(setSeverity("error"));
      dispatch(setSnackMessage("Confirm password must be the same as new password"));
      return;
    }
    if (passVal.confirmPass.length < 8) {
      dispatch(setOpenedSnack(true));
      dispatch(setSeverity("error"));
      dispatch(setSnackMessage("Password must be existed at least 8 charecters"));
      return;
    }
    setIsLoading(true);
    const { data } = await $axios.put("/auth/rec-acc", { token, pass: passVal.confirmPass });
    dispatch(setOpenedSnack(true));
    dispatch(setSeverity("success"));
    dispatch(setSnackMessage(data.message));
    setOpenedRecDialog(false);
    setIsLoading(false);
    dispatch(setAuthState("signin"));
    navigate("/auth");
  };

  return (
    <main className="h-[90vh] mt-[10vh]">
      <Dialog open={openRecDialog} fullWidth>
        <DialogContent sx={{ bgcolor: "primary.main" }}>
          <DialogTitle sx={{ color: "greenyellow", textAlign: "center" }}>
            Recovery Account
          </DialogTitle>
          <form action="" className="flex flex-col gap-2 items-center" onSubmit={handleSubmit}>
            <div
              className={`w-full md:w-3/4 flex flex-col  ${
                theme === "dark" ? "dark:text-white" : "text-black"
              } gap-1`}
            >
              <div className="flex flex-col">
                <label htmlFor="password">New password</label>
                <input
                  type={passState === "hide" ? "password" : "text"}
                  id="password"
                  className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
                  value={passVal.newPass}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassVal({ ...passVal, newPass: e.target.value! })
                  }
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Confirm password</label>
                <input
                  type={passState === "hide" ? "password" : "text"}
                  id="password"
                  className={`p-2 ${theme === "dark" ? "dark:bg-slate-950" : "bg-gray-100"}`}
                  value={passVal.confirmPass}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPassVal({ ...passVal, confirmPass: e.target.value! })
                  }
                />
              </div>
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
                  {passState === "hide" ? "Show " : "Hide "}passwords
                </label>
              </div>
            </div>
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
