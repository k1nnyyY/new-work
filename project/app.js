const express = require("express");
const supabase = require("./server");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [
      "https://new-work-kohl.vercel.app",
      "https://new-work-n776hw9pd-k1nnyyys-projects.vercel.app",
      "https://new-work-3he2gjdfm-k1nnyyys-projects.vercel.app",
      "http://localhost:5173/quiz",
      "http://localhost:5173",
      "https://new-work-4187vfz8n-k1nnyyys-projects.vercel.app",
      "https://new-work-4187vfz8n-k1nnyyys-projects.vercel.app/quiz",
      "https://new-work-4187vfz8n-k1nnyyys-projects.vercel.app/",
      "https://new-work-4187vfz8n-k1nnyyys-projects.vercel.app/welcome",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Проверка пользователя по username
// Проверка пользователя по username
app.post("/api/auth/verify", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: "Username is missing" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error && error.code !== "PGRST116") {
      return res.status(500).json({ success: false, message: "Database error" });
    }

    if (!data) {
      return res.json({ success: false, redirect: "/welcome" });
    }

    return res.json({ success: true, redirect: "/profile", user: data });
  } catch (error) {
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

  if (!username || !dayofbirth || !gender) {
    return res
      .status(400)
      .json({ error: "username, dayofbirth, and gender are required fields." });
  }

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
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({ success: true, data });
});

const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
