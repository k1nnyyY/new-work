const express = require("express");
const crypto = require("crypto");
const supabase = require("./server");

const cors = require("cors");
const app = express();
app.use(express.json());


app.use(cors({
  origin: "https://new-work-kohl.vercel.app", // Разрешите запросы только с вашего клиента
  methods: "GET,POST,PUT,DELETE", // Укажите допустимые HTTP-методы
  credentials: true, // Если требуется передача cookies
}));
// Проверка подлинности данных Telegram Web App
function checkTelegramAuth(initData, botToken) {
  const secretKey = crypto.createHash("sha256").update(botToken).digest();
  const dataCheckString = Object.keys(initData)
    .filter((key) => key !== "hash")
    .sort()
    .map((key) => `${key}=${initData[key]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");
  return hmac === initData.hash;
}

// Настройка маршрута для проверки пользователя
app.post("/api/check-user", async (req, res) => {
  const { initData } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;

  if (!initData || !BOT_TOKEN) {
    return res
      .status(400)
      .json({ error: "Invalid request or missing BOT_TOKEN." });
  }

  const initDataObj = Object.fromEntries(new URLSearchParams(initData));

  if (!checkTelegramAuth(initDataObj, BOT_TOKEN)) {
    return res.status(403).json({ error: "Unauthorized request." });
  }

  // Разбор данных пользователя
  const user = JSON.parse(initDataObj.user);

  // Сохранение данных пользователя в базе
  const { data, error } = await supabase.from("users").upsert({
    id: user.id,
    userName: user.username,
    dayOfBirth: null, // Можете задать дефолтное значение или оставить null
    Gender: null,
    maritalStatus: null,
    WhatIsJob: null,
    yourObjective: null,
    star: 0,
    subscription: false,
    expiredSubscription: null,
  });

  if (error) {
    console.error("Error upserting user:", error);
    return res.status(500).json({ error: "Failed to save user data." });
  }

  res.json({ message: "User authenticated and saved.", user: data });
});

// Добавление нового пользователя вручную
app.post("/api/users", async (req, res) => {
  const {
    id,
    userName,
    dayOfBirth,
    Gender,
    maritalStatus,
    WhatIsJob,
    yourObjective,
    star,
    subscription,
    expiredSubscription,
  } = req.body;

  if (!id || !userName || Gender === undefined || dayOfBirth === undefined) {
    return res.status(400).json({
      error: "id, userName, Gender, and dayOfBirth are required fields.",
    });
  }

  const { data, error } = await supabase.from("users").insert([
    {
      id,
      userName,
      dayOfBirth,
      Gender,
      maritalStatus,
      WhatIsJob,
      yourObjective,
      star,
      subscription,
      expiredSubscription,
    },
  ]);

  if (error) {
    console.error("Error inserting user:", error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
