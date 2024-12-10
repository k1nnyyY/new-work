import React from "react";
import styled from "styled-components";
import logBackground from "../assets/Logo-light.svg";
import buttonImage from "../assets/price.svg";

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("background-image-url.jpg") no-repeat center center/cover; // Replace with your actual background image URL
`;

const Container = styled.div`
  width: 90%;
  max-width: 360px;
  padding: 20px;
  text-align: left;
  color: #fff;
  border-radius: 20px;
  position: relative;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
`;

const Logo = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto 30%;
  background-image: url(${logBackground});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const FeatureList = styled.div`
  margin: 20px 0;
  text-align: left;
  font-size: 16px;
  line-height: 1.5;

  div {
    position: relative; /* Needed for proper placement of ::after */
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    padding-bottom: 5%; /* Space between the text and the line */
  }

  div::before {
    content: "∞";
    color: #fff;
    margin-right: 10px; /* Space between "∞" and the text */
  }

  div::after {
    content: '';
    position: absolute;
    left: 20px; /* Start the line after the "∞" */
    right: 0; /* Extend the line beyond the text */
    bottom: 0;
    height: 1px; /* Thickness of the line */
    background-color: #fff; /* Line color */
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 90%;
  margin-top: 20px;
  margin-bottom:30%;
`;

const Button = styled.button`
  width: 70%; /* Button width */
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #1c0019;
  border: none;
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    background-color: #5a3e5b;
  }
`;

const ImageButton = styled.div`
  width: 100%; /* Adjust width based on the image */
  max-width: 300px; /* Example maximum width */
  height: auto;
  cursor: pointer;
  margin-top: 20px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  &:hover {
    opacity: 0.9; /* Optional hover effect */
  }
`;

const PaymentInfoPage = () => {
  const handleButtonClick = () => {
    alert("Button Clicked!");
  };
  return (
    <Background>
      <Container>
        <Logo />
        <FeatureList>
          <div>Безлимитный доступ</div>
          <div>Медитации для снятия стресса</div>
          <div>Дыхательные практики</div>
        </FeatureList>
        <ImageButton onClick={handleButtonClick}>
          <img src={buttonImage} alt="Попробовать" />
        </ImageButton>
        <ButtonContainer>
          <Button>Попробовать</Button>
        </ButtonContainer>
      </Container>
    </Background>
  );
};

export default PaymentInfoPage;
