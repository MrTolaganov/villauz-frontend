import { createTheme } from "@mui/material";

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#001e2b",
      contrastText: "#fff",
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: "#fff5ef",
      contrastText: "#000",
    },
  },
});
