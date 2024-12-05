import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./ThemeContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ThemeProvider> 
      <App />
    </ThemeProvider>,
  document.getElementById("root")
);
