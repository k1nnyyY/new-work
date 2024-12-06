const express = require('express');
const { validate } = require('@telegram-apps/init-data-node');
const supabase = require('./server');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      'https://new-work-kohl.vercel.app',
      'https://new-work-n776hw9pd-k1nnyyys-projects.vercel.app',
      "https://new-work-3he2gjdfm-k1nnyyys-projects.vercel.app",
      "http://localhost:5173/quiz",
      "http://localhost:5173"
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

const BOT_TOKEN = '8020257687:AAFTfQoThU4qI_DJjE8S4TEnzGBm-AKgVhw';

// Проверка пользователя при заходе
app.post('/api/auth/verify', async (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ success: false, message: 'initData is missing' });
  }

  try {
    validate(initData, BOT_TOKEN);

    const userParams = new URLSearchParams(initData);
    const user = {
      id: userParams.get('user') && JSON.parse(userParams.get('user')).id,
      username: userParams.get('user') && JSON.parse(userParams.get('user')).username,
    };

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (!data) {
      return res.json({ success: false, redirect: '/welcome' });
    }

    return res.json({ success: true, redirect: '/profile', user: data });
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid signature or expired data' });
  }
});

// Обработка завершения квиза и создание профиля
app.post('/api/users/create', async (req, res) => {
  const {
    id,
    username,
    first_name,
    last_name,
    dayofbirth,
    gender,
    marital_status,
    job,
    objective,
    subscription,
    expiredsubscription,
  } = req.body;

  if (!id || !username || !dayofbirth || !gender) {
    return res
      .status(400)
      .json({ error: 'id, username, dayofbirth, and gender are required fields.' });
  }

  const { data, error } = await supabase.from('users').insert([
    {
      id,
      username,
      first_name: first_name || '',
      last_name: last_name || '',
      dayofbirth,
      gender,
      maritalstatus: marital_status || null,
      whatisjob: job || null,
      yourobjective: objective || null,
      subscription: subscription || false,
      expiredsubscription: expiredsubscription || null,
    },
  ]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ success: true, data });
});
app.use((req, res, next) => {
  console.log("Incoming request data:", req.body);
  next();
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
