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
  const dataCheckString = initData
    .split("&")
    .filter((entry) => !entry.startsWith("hash="))
    .sort()
    .join("\n");
  const hash = crypto.createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  const receivedHash = new URLSearchParams(initData).get("hash");
  return hash === receivedHash;
};


// Верификация пользователя
app.post("/api/auth/verify", async (req, res) => {
  try {
    const { initData } = req.body;
    console.log("Получено initData от клиента:", initData);

    if (!initData) {
      console.error("initData отсутствует.");
      return res.status(400).json({ success: false, message: "initData отсутствует" });
    }

    if (checkSignature(initData, BOT_TOKEN)) {
      const user = Object.fromEntries(new URLSearchParams(initData));
      console.log("Данные пользователя:", user);

      // Проверка в базе данных
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Ошибка Supabase:", error.message);
        return res.status(500).json({ success: false, message: "Ошибка базы данных" });
      }

      if (!data) {
        console.log("Пользователь отсутствует. Создаем запись.");
        const { error: insertError } = await supabase.from("users").insert({
          id: user.id,
          username: user.first_name || "Неизвестный",
          subscription: false,
          expiredsubscription: "2000-01-01",
          star: 0,
        });

        if (insertError) {
          console.error("Ошибка при добавлении пользователя:", insertError.message);
          return res.status(500).json({ success: false, message: "Ошибка при создании пользователя" });
        }
      }

      console.log("Пользователь обработан успешно:", data || user);
      return res.json({ success: true, user: data || user });
    } else {
      console.error("Ошибка проверки подписи Telegram.");
      return res.status(403).json({ success: false, message: "Неверная подпись" });
    }
  } catch (err) {
    console.error("Неизвестная ошибка сервера:", err.message, err.stack);
    return res.status(500).json({ success: false, message: "Внутренняя ошибка сервера" });
  }
});


app.post("/api/users", async (req, res) => {
  const { initData, userName, dayOfBirth, Gender, maritalStatus, WhatIsJob, yourObjective } = req.body;

  // Проверка наличия initData
  if (!initData) {
    return res.status(400).json({ error: "initData отсутствует." });
  }

  // Проверка подписи initData
  if (!checkSignature(initData, BOT_TOKEN)) {
    return res.status(403).json({ error: "Неверная подпись Telegram." });
  }

  // Получаем данные пользователя из initData
  const user = Object.fromEntries(new URLSearchParams(initData));

  // Проверка обязательных данных квиза
  if (!userName || !dayOfBirth || Gender === undefined) {
    return res.status(400).json({ error: "Некоторые обязательные поля не заполнены." });
  }

  // Данные для записи в базу
  const payload = {
    id: user.id, // ID из Telegram
    username: userName,
    dayofbirth: dayOfBirth,
    gender: Gender,
    maritalstatus: maritalStatus || "Не указано",
    whatisjob: WhatIsJob || "Не указано",
    yourobjective: yourObjective || "Не указаны цели",
    star: 0, // Значение по умолчанию
    subscription: false, // Значение по умолчанию
    expiredsubscription: "2000-01-01", // Просроченная подписка
  };

  console.log("Сохраняем данные пользователя в базу:", payload);

  try {
    // Сохраняем данные в базе
    const { data, error } = await supabase.from("users").insert([payload]);

    if (error) {
      console.error("Ошибка базы данных:", error);
      return res.status(500).json({ error: "Ошибка базы данных." });
    }

    res.status(201).json({ message: "Пользователь успешно добавлен.", user: data });
  } catch (err) {
    console.error("Ошибка сервера:", err);
    res.status(500).json({ error: "Внутренняя ошибка сервера." });
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
