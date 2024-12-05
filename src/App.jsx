import React from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles";
import { lightTheme, darkTheme } from "./theme";
import WelcomePage from "./Pages/WelcomePage";
import QuizPage from "./Pages/QuizPage";
import ProfilePage from "./Pages/ProfilePage";

const App = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };


  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
      <button
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={toggleTheme}
      >
        Переключить тему
      </button>
    </ThemeProvider>
  );
};

export default App;
