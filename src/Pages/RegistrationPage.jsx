import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegistrationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get initData from the Telegram WebApp
    const initData = window.Telegram.WebApp.initData;

    // Send initData to the backend for validation
    axios
      .post('http://localhost:9000/api/validate-init', { initData })
      .then((response) => {
        if (response.status === 201) {
          // User created, redirect to /profile
          navigate('/profile');
        } else if (response.status === 200) {
          // User exists, redirect to /profile
          navigate('/profile');
        }
      })
      .catch((error) => {
        console.error('Error during validation:', error.response.data);
      });
  }, [navigate]);

  return (
    <div>
      <h1>Loading...</h1>
    </div>
  );
};

export default RegistrationPage;
