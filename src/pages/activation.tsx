import { Alert, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Activation() {
  const { user } = useSelector((state: RootState) => state.user);
  const { isAuth } = useSelector((state: RootState) => state.authState);
  const navigate = useNavigate();

  useEffect(() => {
    if (user.activated || !isAuth) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.activated]);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Container sx={{ color: "primary.contrastText" }}>
        <Alert
          severity="warning"
          className="w-full md:w-1/2 mx-auto"
          sx={{
            bgcolor: "primary.main",
            border: "1px solid yellow",
            color: "primary.contrastText",
          }}
        >
          Please activate your account that sended your gmail address.
        </Alert>
      </Container>
    </div>
  );
}
