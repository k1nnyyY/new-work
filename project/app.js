const express = require('express');
const { validate } = require('@telegram-apps/init-data-node'); // Импорт библиотеки
const supabase = require('./server'); // Подключение базы данных
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    'https://new-work-kohl.vercel.app', // Разрешить запросы с вашего фронтенда
    'https://new-work-n776hw9pd-k1nnyyys-projects.vercel.app', // Другие допустимые источники
  ],
  methods: ['GET', 'POST'],
  credentials: true, // Если используете куки
}));

// Логирование всех входящих запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

const BOT_TOKEN = '8020257687:AAFTfQoThU4qI_DJjE8S4TEnzGBm-AKgVhw';

app.post("/api/auth/verify", async (req, res) => {
  const { initData } = req.body;

  if (!initData) {
    console.error("initData is missing");
    return res.status(400).json({ success: false, message: "initData is missing" });
  }

  try {
    validate(initData, BOT_TOKEN); // Проверка подписи
    console.log("Signature is valid");

    const userParams = new URLSearchParams(initData);
    const user = {
      id: userParams.get('user') && JSON.parse(userParams.get('user')).id,
      username: userParams.get('user') && JSON.parse(userParams.get('user')).username,
    };

    console.log("Extracted user:", user);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!data) {
      console.log("User not found, creating a new one...");
      // Используем мок-данные для обязательных полей
      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        username: user.username || "Unknown",
        first_name: "John", // Мок-значение для имени
        last_name: "Doe", // Мок-значение для фамилии
        dayofbirth: "2000-01-01", // Мок-значение для даты рождения
        subscription: false,
        expiredsubscription: "2000-01-01",
        star: 0,
      });

      if (insertError) {
        console.error("Error inserting user:", insertError);
        return res.status(500).json({ success: false, message: "Error creating user" });
      }

      return res.json({ success: false, message: "New user created with mock data" });
    }

    return res.json({ success: true, user: data });
  } catch (error) {
    console.error("Invalid signature or expired data:", error.message);
    return res.status(403).json({ success: false, message: "Invalid signature or expired data" });
  }
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
