const express = require("express");
const supabase = require("./server");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware для логирования запросов
app.use(morgan("combined"));
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://new-work-kohl.vercel.app",
      "https://web.telegram.org",
    ],
    methods: ["GET", "POST"],
  })
);

// Логирование каждого входящего запроса
app.use((req, res, next) => {
  console.log("Incoming request:");
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Body: ${JSON.stringify(req.body, null, 2)}`);
  console.log(`Headers: ${JSON.stringify(req.headers, null, 2)}`);
  next();
});

// Проверка пользователя по username
app.post("/api/auth/verify", async (req, res) => {
  const { username } = req.body;

  console.log("Processing /api/auth/verify with username:", username);

  if (!username) {
    console.error("Username is missing");
    return res.status(400).json({ success: false, message: "Username is missing" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Database error:", error.message);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!data) {
      console.log("User not found, redirecting to /welcome");
      return res.json({ success: false, redirect: "/welcome" });
    }

    console.log("User found, redirecting to /profile:", data);
    return res.json({ success: true, redirect: "/profile", user: data });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return res.status(500).json({ success: false, message: "Unexpected error" });
  }
});

// Создание пользователя
app.post("/api/users/create", async (req, res) => {
  const {
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

  console.log("Processing /api/users/create with data:", req.body);

  if (!username || !dayofbirth || !gender) {
    console.error("Required fields are missing");
    return res
      .status(400)
      .json({ error: "username, dayofbirth, and gender are required fields." });
  }

  try {
    const { data, error } = await supabase.from("users").insert([
      {
        username,
        first_name: first_name || "",
        last_name: last_name || "",
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
      console.error("Error inserting user into database:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("User created successfully:", data);
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error("Unexpected error during user creation:", error.message);
    res.status(500).json({ error: "Unexpected server error" });
  }
});
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack || err.message || err);
  res.status(500).send("Something broke!");
});

// Запуск сервера
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
