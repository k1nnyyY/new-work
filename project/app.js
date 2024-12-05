const express = require('express');
const crypto = require('crypto');
const supabase = require('./server');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173', // Разрешаем запросы с этого источника
    methods: ['GET', 'POST'], // Указываем методы, которые разрешены
    credentials: true, // Если нужны куки или авторизация
  })
);

// Telegram Bot Token
const BOT_TOKEN = '8020257687:AAFTfQoThU4qI_DJjE8S4TEnzGBm-AKgVhw';


// Проверка подписи Telegram
const checkSignature = (initData, botToken) => {
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const data = initData
    .split("&")
    .filter((entry) => !entry.startsWith("hash="))
    .sort()
    .join("\n");
  const hash = crypto.createHmac("sha256", secretKey).update(data).digest("hex");
  const receivedHash = new URLSearchParams(initData).get("hash");
  return hash === receivedHash;
};

// Верификация пользователя
app.post('/api/auth/verify', async (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ success: false, message: 'No initData' });
  }

  if (checkSignature(initData, BOT_TOKEN)) {
    const userData = Object.fromEntries(new URLSearchParams(initData));

    // Проверяем, существует ли пользователь в Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userData.id)
      .single();

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    // Возвращаем данные пользователя, если верификация успешна
    return res.json({ success: true, user: data });
  } else {
    return res.status(403).json({ success: false, message: 'Invalid signature' });
  }
});

app.post("/api/users", async (req, res) => {
  console.log("Запрос получен на /api/users");
  console.log("Данные от клиента:", req.body);

  const {
    userName,
    dayOfBirth,
    Gender,
    maritalStatus,
    WhatIsJob,
    yourObjective,
  } = req.body;

  // Проверка обязательных полей
  if (!userName || !dayOfBirth || Gender === undefined) {
    console.error("Ошибка валидации: отсутствуют обязательные поля.");
    return res.status(400).json({
      error: "Обязательные поля: userName, dayOfBirth, Gender должны быть заполнены.",
    });
  }

  // Формирование данных для базы данных
  const payload = {
    username: userName,
    dayofbirth: dayOfBirth,
    gender: Gender,
    maritalstatus: maritalStatus || "Не указано", // Значение по умолчанию
    whatisjob: WhatIsJob || "Не указано", // Значение по умолчанию
    yourobjective: yourObjective || "Не указаны цели", // Значение по умолчанию
    star: 0, // Значение по умолчанию
    subscription: false, // Значение по умолчанию
    expiredsubscription: "2000-01-01", // Дата в прошлом
  };

  console.log("Данные для вставки в базу данных:", payload);

  try {
    const { data, error } = await supabase.from("users").insert([payload]);

    if (error) {
      console.error("Ошибка при вставке в базу данных:", error);
      return res.status(400).json({ error: error.message });
    }

    console.log("Данные успешно сохранены в базе:", data);
    res.status(201).json(data);
  } catch (err) {
    console.error("Неизвестная ошибка на сервере:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
});

// Получение данных пользователя по ID
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching user:', error);
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});

// Получить всех пользователей
app.get('/api/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select(
      'id, userName, dayOfBirth, Gender, maritalStatus, WhatIsJob, yourObjective, star, subscription, expiredSubscription'
    );

  if (error) {
    console.error('Error fetching users:', error);
    return res.status(400).json({ error: error.message });
  }

  res.json(data);
});



// Эндпоинт для проверки подписи
app.post("/api/auth/verify", async (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    console.error("initData отсутствует");
    return res.status(400).json({ success: false, message: "initData не переданы" });
  }

  if (checkSignature(initData, BOT_TOKEN)) {
    const user = Object.fromEntries(new URLSearchParams(initData));
    console.log("Пользователь успешно верифицирован:", user);

    // Проверяем, существует ли пользователь в базе данных
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Ошибка Supabase:", error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    if (!data) {
      // Если пользователь отсутствует, добавляем его
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        username: user.first_name || "Неизвестный",
        subscription: false,
        expiredsubscr: "2000-01-01",
        star: 0,
      });

      if (insertError) {
        console.error("Ошибка вставки нового пользователя:", insertError.message);
        return res.status(500).json({ success: false, message: insertError.message });
      }
    }

    return res.json({ success: true, user });
  } else {
    console.error("Ошибка проверки подписи Telegram");
    return res.status(403).json({ success: false, message: "Ошибка проверки подписи" });
  }
});


const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
