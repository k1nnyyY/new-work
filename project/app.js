const express = require("express");
const supabase = require("./server");
const YooKassa = require("yookassa");
const bodyParser = require("body-parser");
const cors = require("cors")
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());


app.use(cors({
  origin: "http://localhost:5173", // Разрешаем запросы с вашего фронтенда
  methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные методы
  credentials: true // Если нужно передавать cookies или заголовки аутентификации
}));

// Настройка YooKassa
const yooKassa = new YooKassa({
  shopId: "YOUR_SHOP_ID", // Укажите ваш Shop ID
  secretKey: "YOUR_SECRET_KEY", // Укажите ваш секретный ключ
});
app.post("/api/viewed-content", async (req, res) => {
  const { user_id, content_id } = req.body;

  console.log("Received data from client:", req.body); // Лог входящих данных

  if (!user_id || !content_id) {
    console.error("Missing user_id or content_id");
    return res.status(400).json({ error: "user_id and content_id are required." });
  }

  try {
    const { data, error } = await supabase
      .from("viewed_content")
      .insert([{ user_id: parseInt(user_id), content_id: parseInt(content_id) }]);

    if (error) {
      console.error("Error inserting into database:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Content viewed recorded successfully", data });
  } catch (err) {
    console.error("Error saving viewed content:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/recently-viewed/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from("viewed_content")
      .select(
        `
        content (
          id,
          title,
          type,
          subtitle,
          duration,
          image_url
        )
      `
      )
      .eq("user_id", user_id)
      .order("viewed_at", { ascending: false }) // Сортируем по дате
      .limit(5)
      .order("viewed_at", { ascending: false });

    if (error) {
      console.error("Error fetching recently viewed:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(200).json({ recentlyViewed: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/check-user", async (req, res) => {
  const { username } = req.query; // Извлекаем username из строки запроса

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  try {
    const { data, error } = await supabase
      .from("users") // Таблица "users"
      .select("*")
      .eq("username", username) // Изменено на "username"
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ error: error.message });
    }

    if (data) {
      return res.json({ message: `User ${username} exists`, user: data });
    } else {
      return res.status(404).json({ message: `User ${username} not found` });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/check-favorites", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: `No favorites found for user ID ${user_id}` });
    }

    res.json({
      message: `Favorites found for user ID ${user_id}`,
      favorites: data,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/favorites", async (req, res) => {
  const { user_id, content_id } = req.body;

  if (!user_id || !content_id) {
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id: parseInt(user_id), content_id: parseInt(content_id) }])
    .select("*");
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Added to favorites", data });
});

// Получение избранных записей для пользователя
app.get("/api/favorites/:user_id", async (req, res) => {
  const { user_id } = req.params;

  // Получаем избранный контент для пользователя
  const { data, error } = await supabase
    .from("favorites")
    .select(
      `
      content (
        id,
        title,
        type,
        subtitle,
        duration,
        image_url
      )
    `
    )
    .eq("user_id", parseInt(user_id));

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ favorites: data });
});

// Удаление из избранного
app.delete("/api/favorites", async (req, res) => {
  const { user_id, content_id } = req.body;

  // Проверяем, что параметры переданы
  if (!user_id || !content_id) {
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  // Удаляем запись из таблицы favorites
  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", parseInt(user_id))
    .eq("content_id", parseInt(content_id));

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Removed from favorites", data });
});

app.post("/api/favorites", async (req, res) => {
  const { user_id, content_id } = req.body;

  if (!user_id || !content_id) {
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id, content_id }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Added to favorites", data });
});

app.get("/api/favorites/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { data, error } = await supabase
    .from("favorites")
    .select("content(*)")
    .eq("user_id", user_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ favorites: data });
});

app.delete("/api/favorites", async (req, res) => {
  const { user_id, content_id } = req.body;

  if (!user_id || !content_id) {
    return res
      .status(400)
      .json({ error: "user_id and content_id are required." });
  }

  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user_id)
    .eq("content_id", content_id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Removed from favorites", data });
});

// Маршрут для создания платежа
app.post("/api/payment", async (req, res) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ error: "userId and email are required" });
  }

  try {
    // Создание платежа
    const payment = await yooKassa.createPayment({
      amount: {
        value: "200.00",
        currency: "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: "http://localhost:9000/success",
      },
      description: `Subscription for user ${email}`,
    });

    // Сохранение платежа в таблице
    await supabase.from("payments").insert([
      {
        user_id: userId,
        payment_id: payment.id,
        status: "pending",
        created_at: new Date(),
      },
    ]);

    res.json({ paymentUrl: payment.confirmation.confirmation_url });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ error: "Payment creation failed" });
  }
});

// Вебхук для обработки статуса платежа
app.post("/api/webhook", async (req, res) => {
  const { object } = req.body;

  if (object && object.status === "succeeded") {
    const paymentId = object.id;

    const { data: paymentData, error: paymentError } = await supabase
      .from("payments")
      .select("user_id")
      .eq("payment_id", paymentId)
      .single();

    if (paymentError || !paymentData) {
      console.error("Payment not found:", paymentError);
      return res.status(400).json({ error: "Payment not found" });
    }

    const userId = paymentData.user_id;

    // Активировать подписку
    await supabase.from("subscriptions").insert([
      {
        user_id: userId,
        expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    ]);

    // Обновить статус платежа
    await supabase
      .from("payments")
      .update({ status: "succeeded" })
      .eq("payment_id", paymentId);

    res.status(200).send("OK");
  } else {
    res.status(400).send("Invalid webhook data");
  }
});

app.post("/api/users", async (req, res) => {
  const {
    username,
    dayofbirth,
    gender,
    maritalstatus,
    whatisjob,
    yourobjective,
    star,
    subscription,
    expiredsubscription,
    job,
    firstName,
  } = req.body;

  if (!username || !gender || !dayofbirth) {
    return res.status(400).json({
      error: "id, username, gender, and dayofbirth are required fields.",
    });
  }

  try {
    const { data, error } = await supabase.from("users").insert([
      {
        username,
        dayofbirth,
        gender,
        maritalstatus,
        whatisjob,
        yourobjective,
        star: star || 0,
        subscription: subscription || false,
        expiredsubscription,
        job,
        firstName,
      },
    ]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/audio_players/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("audio_players")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/all_data", async (req, res) => {
  const { data, error } = await supabase.from("all_data").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/all_data/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("all_data")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/cards", async (req, res) => {
  const { data, error } = await supabase.from("cards").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/cards/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/lessons", async (req, res) => {
  const { data, error } = await supabase.from("lessons").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/lessons/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/content", async (req, res) => {
  const { data, error } = await supabase.from("content").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/content/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("content")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/meditations", async (req, res) => {
  const { data, error } = await supabase.from("meditations").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/meditations/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("meditations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/subscriptions", async (req, res) => {
  const { data, error } = await supabase.from("subscriptions").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Маршрут для получения записи по ID
app.get("/api/subscriptions/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

app.get("/api/user_dashboard", async (req, res) => {
  const { data, error } = await supabase.from("user_dashboard").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/user_dashboard/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("user_dashboard")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json(data);
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
