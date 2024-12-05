import React, {useState,useEffect} from "react";
import styled from "styled-components";
import { useTheme } from "../ThemeContext";
import { useNavigate } from "react-router-dom";
import logBackground from "../assets/Logo-light.svg";

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.background};
  background-size: cover;
`;

const Container = styled.div`
  width: 90%;
  max-width: 360px;
  padding: 30px 20px;
  text-align: center;
  color: #fff; /* Белый текст */
  border-radius: 20px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.15); /* Светлый полупрозрачный фон */
  backdrop-filter: blur(15px); /* Размытие фона */
  -webkit-backdrop-filter: blur(15px); /* Для Safari */
`;

const Image = styled.div`
  width: 100px; /* Ширина логотипа */
  height: 100px; /* Высота логотипа */
  margin: 0 auto 50%; /* Центрирование по горизонтали и отступ снизу */
  background-image: url(${logBackground}); /* Указание изображения */
  background-size: contain; /* Адаптировать изображение */
  background-repeat: no-repeat; /* Избегать повторения */
  background-position: center; /* Центрировать изображение */
`;

const Title = styled.h1`
  font-size: 22px;
  margin-bottom: 15px;
  text-align: left;
  color: ${({ theme }) => theme.color};
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 1.5;
  text-align: left;
  margin-bottom: 30px;
  color: ${({ theme }) => theme.color};
`;
const TextWrapper = styled.div`
  width: 100%; /* Ширина контейнера */
  max-width: 360px; /* Максимальная ширина */
  margin: 0 auto; /* Центрирование контейнера */
  padding: 0 5%; /* Отступы с двух сторон */
  text-align: left; /* Выравнивание текста по левому краю */
`;
const Button = styled.button`
  padding: 15px;
  width: 85%;
  border: none;
  border-radius: 15px;
  background: #1c0019;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  margin: 25% 0 25% 0;
`;
const WelcomePage = () => {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/quiz");
  };
  const handleNextk = () => {
    navigate("/profile");
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Получение данных пользователя из Telegram WebApp
    const tg = window.Telegram.WebApp;
    const telegramUser = tg.initDataUnsafe?.user || null;

    if (telegramUser) {
      setUser(telegramUser);
    }
  }, []);

  if (!user) {
    return <p>Загрузка данных пользователя...</p>;
  }

  return (
    <Background>
      <Container>
        <Image />
        <TextWrapper>
          <p>
            <strong>Ваш ID:</strong> {user.id}
          </p>
          <p>
            <strong>Имя:</strong> {user.first_name}
          </p>
          <p>
            <strong>Фамилия:</strong> {user.last_name || "Не указана"}
          </p>
          <p>
            <strong>Username:</strong> {user.username || "Не указан"}
          </p>
          <Title>Добро пожаловать в Angelvoice!</Title>
          <Text>
            Избавьтесь от стресса и тревог с помощью медитаций и глубоких техник
            релаксации. В нашем приложении собраны инструменты, которые помогут
            услышать себя.
          </Text>
        </TextWrapper>
        <Button onClick={handleNext}>Далее</Button>
        <button onClick={handleNextk}>kdodd</button>
      </Container>
    </Background>
  );
};

export default WelcomePage;
