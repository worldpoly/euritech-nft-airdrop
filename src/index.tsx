import React from "react";
import ReactDOM from "react-dom";
// import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App";
import { darkTheme } from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
