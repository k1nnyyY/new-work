const express = require('express');
const crypto = require('crypto');
const supabase = require('./server');

const app = express();
app.use(express.json());


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

app.post("/api/auth/verify", async (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    return res.status(400).json({ success: false, message: "initData is missing" });
  }

  if (!checkSignature(initData, BOT_TOKEN)) {
    return res.status(403).json({ success: false, message: "Invalid signature" });
  }

  const user = Object.fromEntries(new URLSearchParams(initData));

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    return res.status(500).json({ success: false, message: "Database error" });
  }

  if (!data) {
    // Создаем нового пользователя
    await supabase.from("users").insert({
      id: user.id,
      username: user.username || "Unknown",
      subscription: false,
      expiredsubscription: "2000-01-01",
      star: 0,
    });

    return res.json({ success: false, message: "New user created" });
  }

  return res.json({ success: true, user: data });
});

// Добавление нового пользователя
app.post('/api/users', async (req, res) => {
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
    return res
      .status(400)
      .json({ error: 'id, userName, Gender, and dayOfBirth are required fields.' });
  }

  const { data, error } = await supabase.from('users').insert([
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
    console.error('Error inserting user:', error);
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

// Получение данных пользователя по ID



const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
