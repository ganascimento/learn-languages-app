import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    allVariants: {
      color: "rgba(219, 219, 235, 0.87)",
    },
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "rgba(219, 219, 235, 0.87)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "rgba(219, 219, 235, 0.87)",
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: 5,
          },
        },
      },
    },
  },
});

export default theme;
