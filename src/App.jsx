import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles";
import { lightTheme, darkTheme } from "./theme";
import WelcomePage from "./Pages/WelcomePage";
import QuizPage from "./Pages/QuizPage";
import ProfilePage from "./Pages/ProfilePage";
import { useNavigate } from "react-router-dom";


const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

 
const checkUser = async () => {
  const initData = window.Telegram.WebApp.initData;

  if (!initData) {
    console.error("Telegram InitData is missing");
    setIsAuthenticated(false);
    return;
  }

  try {
    const response = await fetch("http://localhost:9000/api/auth/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData }),
    });

    const result = await response.json();

    if (result.redirect === "/welcome") {
      setIsAuthenticated(false);
      navigate("/welcome");
    } else if (result.redirect === "/profile") {
      setIsAuthenticated(true);
      navigate("/profile");
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    setIsAuthenticated(false);
  }
};
  useEffect(() => {
    checkUser();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Отображение загрузки до завершения проверки
  }

  return (
    <ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/profile" />
              ) : (
                <Navigate to="/welcome" />
              )
            }
          />
          <Route path="/welcome" element={<WelcomePage />} />
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
