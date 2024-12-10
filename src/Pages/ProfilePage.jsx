import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Footer from "../Components/Footer";
import Logo from "../assets/Ellipse 1.svg";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../userSlice";

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
// Аватар
const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: url("https://via.placeholder.com/80") center/cover no-repeat;
  border: 2px solid ${({ theme }) => theme.color};
`;
// Заголовок
const Title = styled.div`
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.color};

  .greeting {
    font-size: 16px;
    margin-bottom: 5px;
  }

  .user-id {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const ProfileContainerData = styled.div`
  display: flex;
  align-items: center; /* Центрируем элементы по вертикали */
  justify-content: space-between; /* Распределяем элементы по сторонам */
  width: 100%;
  max-width: 360px;
  padding: 20px;
  border-radius: 20px;
  overflow: hidden;
  margin: 0 auto; /* Центрируем по вертикали */
`;

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
  margin-top: 10%; /* Adjust to align properly */
  margin-bottom: 20%; /* Adjust to align properly */
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column; /* Располагаем элементы вертикально */
  text-align: right; /* Выравниваем текст справа */
  margin-left: auto; /* Отталкиваем от аватара */

  .greeting {
    font-size: 16px;
    margin-bottom: 5px;
    font-weight: bold;
    color: ${({ theme }) => theme.color};
  }

  .user-id {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
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

const ProfilePage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = localStorage.getItem("username") || "k1nnyyY"; // Фиксированный username
        const response = await fetch(
          `http://localhost:9000/api/check-user?username=${username}`
        );
        const data = await response.json();

        if (response.ok) {
          dispatch(setUser(data.user));
        } else {
          console.error("Ошибка загрузки данных:", data.message);
        }
      } catch (err) {
        console.error("Ошибка подключения к серверу:", err);
      }
    };

    fetchUserData();
  }, [dispatch]);

  useEffect(() => {
    console.log("Redux state for user in ProfilePage:", userData);
  }, [userData]);
  return (
    <Background>
      <ScrollableContainer>
        <ProfileContainer>
          <ProfileContainerData>
            <Avatar style={{ backgroundImage: `url(${Logo})` }} />
            <TextContainer>
              <div className="greeting">
                Добрый день, {userData.firstName || "Гость"}
              </div>
              <div className="user-id">ID: {userData.id || "—"}</div>
            </TextContainer>
          </ProfileContainerData>
          <Section>
            <SectionTitle>Личное</SectionTitle>
            <InfoRow>
              <span>Имя</span>
              <span>{userData.firstName || "Не указано"}</span>
            </InfoRow>
            <InfoRow>
              <span>Дата рождения</span>
              <span>{userData.dayOfBirth || "Не указано"}</span>
            </InfoRow>
            <InfoRow>
              <span>Пол</span>
              <span>{userData.gender || "Не указано"}</span>
            </InfoRow>
            <InfoRow>
              <span>Профессия</span>
              <span>{userData.whatisjob || "Не указано"}</span>
            </InfoRow>
            <InfoRow>
              <span>Отношения</span>
              <span>{userData.maritalStatus || "Не указано"}</span>
            </InfoRow>
            <InfoRow>
              <span>Цели</span>
              <span>{userData.yourObjective || "Не указано"}</span>
            </InfoRow>
          </Section>
          <Section>
            <SectionTitle>Подписка</SectionTitle>
            <InfoRow>
              <span>Подписка</span>
              <span>{userData.subscription ? "Оплачена" : "Не оплачена"}</span>
            </InfoRow>
            <InfoRow>
              <span>Окончание подписки</span>
              <span>{userData.expiredSubscription || "Не оплачена"}</span>
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
      <Footer />
    </Background>
  );
};

export default ProfilePage;
