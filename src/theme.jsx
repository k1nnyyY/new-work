import lightBackground from './assets/images (1).jpeg';
import darkBackground from './assets/winter.jpeg';

export const lightTheme = {
  background: `url(${lightBackground})`,
  backgroundSize: "cover",
  color: "#000",
  inputBackground: "rgba(255, 255, 255, 0.8)",
  buttonBackground: "#6B46C1",
  buttonColor: "#FFF",
};

export const darkTheme = {
  background: `url(${darkBackground})`,
  backgroundSize: "cover",
  color: "#FFF",
  inputBackground: "rgba(0, 0, 0, 0.8)",
  buttonBackground: "#FFF",
  buttonColor: "#6B46C1",
};
