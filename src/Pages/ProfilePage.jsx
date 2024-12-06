import React, { useState, useEffect } from "react";
import styled from "styled-components";


// Основной фон страницы
const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: url("/path/to/background-image.jpg") center/cover no-repeat;
  background-color: ${({ theme }) => theme.background};
  background-size: cover;
`;

const ScrollableContainer = styled.div`
  flex: 1; /* Займает оставшееся пространство */
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  overflow-y: auto; /* Добавляет вертикальный скролл при переполнении */
  padding: 20px 0;

  /* Скрытие скроллбара */
  scrollbar-width: none; /* Для Firefox */
  -ms-overflow-style: none; /* Для Internet Explorer и Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Для Chrome, Safari и других WebKit-браузеров */
  }
`;

// Контейнер профиля
const ProfileContainer = styled.div`
  width: 100%;
  max-width: 360px;
  padding: 20px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom:35%;
`;

// Аватар
const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: url("https://via.placeholder.com/80") center/cover no-repeat;
  margin: 0 auto 15px;
  border: 2px solid ${({ theme }) => theme.color};
`;

// Заголовок
const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.color};

  span {
    display: block;
    font-size: 14px;
    color: ${({ theme }) => theme.color};
  }
`;

// Секция данных
// Секция данных с рамкой
const Section = styled.div`
  margin-bottom: 20px;
  padding: 10px 10px 15px 10px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3); /* Обводка для каждой секции */
  background-color: rgba(255, 255, 255, 0.1); /* Лёгкий фон для секции */
`;

const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.color};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.color};
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);

  span {
    flex: 1;
  }

  a {
    color: ${({ theme }) => theme.color};
    text-decoration: none;
    font-weight: bold;
  }
`;

// Кнопки выхода и удаления
const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    flex: 1;
    padding: 10px 20px;
    margin: 0 5px;
    font-size: 14px;
    font-weight: bold;
    color: ${({ theme }) => theme.color};
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

// Футер с иконками
const Footer = styled.div`
  width: 100%;
  max-width: 360px;
  position: fixed; /* Закрепляет футер */
  bottom: 0;
  left: 50%;
  border-radius: 20px 20px 0 0;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const FooterIcon = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.color};
  cursor: pointer;

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`;

  const ProfilePage = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
        const initData = window.Telegram.WebApp.initData;
        const userId = JSON.parse(new URLSearchParams(initData).get("user")).id;
  
        try {
          const response = await fetch(`http://localhost:9000/api/users/${userId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, []);

    if (!userData) {
      return <div>Loading...</div>;
    }


    return (
      <Background>
        <ScrollableContainer>
          <ProfileContainer>
            <Avatar />
            <Title>
            <h1>Welcome, {userData.first_name}</h1>
              Добрый день, {userData.first_name}
              <span>id 2345678</span>
            </Title>
            <Section>
              <SectionTitle>Личное</SectionTitle>
              <InfoRow>
                <span>Имя</span>
                <span>Тимур</span>
              </InfoRow>
              <InfoRow>
                <span>Дата рождения</span>
                <span>25.11.1987</span>
              </InfoRow>
              <InfoRow>
                <span>Пол</span>
                <span>мужской</span>
              </InfoRow>
              <InfoRow>
                <span>Профессия</span>
                <span>предприниматель</span>
              </InfoRow>
              <InfoRow>
                <span>Отношения</span>
                <span>женат</span>
              </InfoRow>
              <InfoRow>
                <span>Цель</span>
                <span>5 целей</span>
              </InfoRow>
            </Section>
            <Section>
              <SectionTitle>Подписка</SectionTitle>
              <InfoRow>
                <span>Подписка</span>
                <span>Оплачена</span>
              </InfoRow>
              <InfoRow>
                <span>Окончание подписки</span>
                <span>12.01.2025</span>
              </InfoRow>
            </Section>

            <Section>
              <SectionTitle>Юридическое</SectionTitle>
              <InfoRow>
                <span>Политика конфиденциальности</span>
                <a href="#">Открыть</a>
              </InfoRow>
              <InfoRow>
                <span>Политика конфиденциальности</span>
                <a href="#">Открыть</a>
              </InfoRow>
            </Section>
            <ActionButtons>
              <button>Выйти</button>
              <button>Удалить</button>
            </ActionButtons>
          </ProfileContainer>
        </ScrollableContainer>
        <Footer>
          <FooterIcon>👤</FooterIcon>
          <FooterIcon>📄</FooterIcon>
          <FooterIcon>🌙</FooterIcon>
          <FooterIcon>❤️</FooterIcon>
          <FooterIcon>🏠</FooterIcon>
        </Footer>
      </Background>
    );
  };

  export default ProfilePage;
