// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
});

createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
    </ThemeProvider>
);
