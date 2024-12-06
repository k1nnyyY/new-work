import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { GlobalStyles } from "./GlobalStyles";
import { lightTheme, darkTheme } from "./theme";
import WelcomePage from "./Pages/WelcomePage";
import QuizPage from "./Pages/QuizPage";
import ProfilePage from "./Pages/ProfilePage";
import PlayerPage from "./Pages/PlayerPage";

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const checkUser = async () => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;

    if (!telegramUser || !telegramUser.username) {
      console.error("Telegram user data is missing or incomplete");
      navigate("/quiz");
      return;
    }

    try {
      const response = await fetch("http://localhost:9000/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: telegramUser.username }),
      });

      const result = await response.json();

      if (result.redirect === "/welcome") {
        setIsAuthenticated(false);
        navigate("/quiz");
      } else if (result.redirect === "/profile") {
        setUserData(result.user);
        setIsAuthenticated(true);
        navigate("/profile");
      } else {
        console.error("Unexpected response:", result);
        setIsAuthenticated(false);
        navigate("/quiz");
      }
    } catch (error) {
      console.error("Error verifying user:", error);
      setIsAuthenticated(false);
      navigate("/quiz");
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <ThemeProvider theme={isDarkMode ? lightTheme : darkTheme}>
      <GlobalStyles />
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
        <Route path="/profile" element={<ProfilePage userData={userData} />} />
        <Route path="/player" element={<PlayerPage />} />
      </Routes>
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
