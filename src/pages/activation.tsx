import { Alert, Container } from "@mui/material";

import { useNavigate } from "react-router-dom";
import { UserType } from "../types";

export default function Activation({ user, isAuth }: { user: UserType; isAuth: boolean }) {
  const navigate = useNavigate();

  if (!(!user.activated && isAuth)) {
    navigate("/");
  }

  return (
    <>
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
    </>
  );
}
